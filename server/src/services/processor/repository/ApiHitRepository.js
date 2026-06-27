import { BaseRepository } from "./BaseRepository.js";

export class ApiHitRepository extends BaseRepository {
    constructor({ model, logger: l }) {
        super({ logger: l });
        if (!model) {
            throw new Error("ApiHitRepository required mongoose model");
        }
        this.model = model;
    }

    async save(eventData) {
        try {
            const doc = new this.model(eventData);
            await doc.save();

            this.logger.info("API hit saved to MongoDB", {
                eventId: eventData.eventId,
            });

            return doc;
        } catch (error) {
            if (error && error.code === 11000) {
                this.logger.warn("Duplicate event ID, skipping save", {
                    eventId: eventData.eventId,
                });
                return null;
            }
            this.logger.error("Error saving API hit:", error);
            throw error;
        }
    }

    async find(filer = {}, options = {}) {
        try {
            const { limit = 100, skip = 0, sort = { timestamp: -1 } } = options;
            const hit = await this.model
                .find(filer)
                .sort(sort)
                .limit(limit)
                .skip(skip)
                .lean();
            return hit;
        } catch (error) {
            this.logger.error("Error finding API hits:", error);
            throw error;
        }
    }

    async count(filters = {}) {
        try {
            const count = await this.model.countDocuments(filters);
            return count;
        } catch (error) {
            this.logger.error("Error counting API hits:", error);
            throw error;
        }
    }

    async findHits(filters = {}) {
        try {
            const {
                clientId,
                serviceName,
                endpoint,
                method,
                statusClass,
                startTime,
                endTime,
                limit = 50,
                offset = 0,
                sortBy = "timestamp",
                sortDir = "desc",
            } = filters;

            const query = {};

            if (clientId) query.clientId = clientId;
            if (serviceName) query.serviceName = serviceName;
            if (endpoint) query.endpoint = endpoint;
            if (method) query.method = method;

            if (statusClass) {
                const classPrefix = parseInt(statusClass.charAt(0), 10);
                if (!isNaN(classPrefix)) {
                    const minCode = classPrefix * 100;
                    const maxCode = minCode + 99;
                    query.statusCode = { $gte: minCode, $lte: maxCode };
                }
            }

            if (startTime || endTime) {
                query.timestamp = {};
                if (startTime) query.timestamp.$gte = new Date(startTime);
                if (endTime) query.timestamp.$lte = new Date(endTime);
            }

            // Enforce hard cap limit
            const finalLimit = Math.min(parseInt(limit, 10) || 50, 200);
            const finalOffset = parseInt(offset, 10) || 0;

            // Whitelist sort fields
            const allowedSortFields = ["timestamp", "latencyMs"];
            const finalSortBy = allowedSortFields.includes(sortBy)
                ? sortBy
                : "timestamp";
            const sortDirection = sortDir === "asc" ? 1 : -1;
            const sortQuery = { [finalSortBy]: sortDirection };

            const [hits, total] = await Promise.all([
                this.model
                    .find(query)
                    .sort(sortQuery)
                    .skip(finalOffset)
                    .limit(finalLimit)
                    .lean(),
                this.model.countDocuments(query),
            ]);

            return { hits, total };
        } catch (error) {
            this.logger.error("Error finding API hits:", error);
            throw error;
        }
    }

    async deleteOldHits(beforeDate) {
        try {
            const result = await this.model.deleteMany({
                timestamp: { $lt: beforeDate },
            });
            this.logger.info("Deleted old API hits", {
                count: result.deletedCount,
            });
            return result.deletedCount;
        } catch (error) {
            this.logger.error("Error deleting old API hits:", error);
            throw error;
        }
    }
}
