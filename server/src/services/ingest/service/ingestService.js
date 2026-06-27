import logger from "../../../shared/config/logger.js";
import AppError from "../../../shared/utils/AppError.js";
import { v4 as uuidv4 } from "uuid";

export class IngestService {
    constructor({ eventProducer }) {
        if (!eventProducer) throw new error("Event producer is required");
        this.eventProducer = eventProducer;
    }

    /**
     * Ingests an API hit by validating the hit data and publishing an event to RabbitMQ.
     * @param {Object} hitData - The API hit data to be ingested.
     * @returns {Promise<Object>} - The result of the ingestion, including the event ID and status.
     */
    async ingestApiHit(hitData) {
        try {
            this.validateHitData(hitData);

            const event = {
                eventId: uuidv4(),
                timestamp: new Date(),
                serviceName: hitData.serviceName,
                endpoint: hitData.endpoint,
                method: hitData.method.toUpperCase(),
                statusCode: parseInt(hitData.statusCode, 10),
                latencyMs: parseFloat(hitData.latencyMs),
                clientId: hitData.clientId,
                apiKeyId: hitData.apiKeyId,
                ip: hitData.ip || "unknown",
                userAgent: hitData.userAgent || "",
            };

            const published = await this.eventProducer.publishApiHit(event);
            if (!published) {
                // Circuit breaker rejected the request
                logger.warn("API hit rejected by circuit breaker", {
                    eventId: event.eventId,
                    endpoint: event.endpoint,
                    method: event.method,
                    clientId: event.clientId,
                });

                return {
                    eventId: event.eventId,
                    status: "rejected",
                    reason: "service_unavailable",
                    timestamp: event.timestamp,
                };
            }
            logger.info("API hit ingested", {
                eventId: event.eventId,
                endpoint: event.endpoint,
                method: event.method,
                clientId: event.clientId,
            });

            return {
                eventId: event.eventId,
                status: "queued",
                timestamp: event.timestamp,
            };
        } catch (error) {
            logger.error("Error ingesting API hit:", error);
            throw error;
        }
    }

    /**
     * Validates the API hit data to ensure all required fields are present and valid.
     * @param {Object} hitData - The API hit data to be validated.
     * @throws {AppError} - If any required fields are missing or invalid.
     */
    validateHitData(hitData) {
        const requiredFields = [
            "serviceName",
            "endpoint",
            "method",
            "statusCode",
            "latencyMs",
            "clientId",
        ];
        const missingFields = requiredFields.filter((field) => hitData[field] === undefined || hitData[field] === null);

        if (missingFields.length > 0) {
            throw new AppError(
                `Missing required fields: ${missingFields.join(",")}`,
                400,
            );
        }

        const validMethods = ["GET", "POST", "PUT", "DELETE", "PATCH"];
        if (!validMethods.includes(hitData.method.toUpperCase())) {
            throw new AppError(`Invalid HTTP methods: ${hitData.method} `, 400);
        }

        const statusCode = parseInt(hitData.statusCode, 10);
        if (isNaN(statusCode) || statusCode < 100 || statusCode > 599) {
            throw new AppError(
                `Invalid Status code : ${hitData.statusCode} `,
                400,
            );
        }

        const latency = parseFloat(hitData.latencyMs);
        if (isNaN(latency) || latency < 0) {
            throw new AppError(`Invalid latency : ${hitData.latencyMs} `, 400);
        }
    }
}
