import logger from "../../../shared/config/logger.js";

export class ProcessorService {
    constructor({ apiHitRepository, metricsRepository }) {
        if (!apiHitRepository || !metricsRepository)
            throw new Error(
                "ProcessorService requires apiHitRepository and metricsRepository",
            );
        this.apiHitRepository = apiHitRepository;
        this.metricsRepository = metricsRepository;
    }

    /**
     * Calculates the time bucket for a given timestamp and interval.
     * @param {number} timestamp
     * @param {string} interval
     * @returns {Date}
     */
    getTimeBucket(timestamp, interval = "hour") {
        const date = new Date(timestamp);
        switch (interval) {
            case "hour":
                date.setMinutes(0, 0, 0);
                break;
            case "day":
                date.setHours(0, 0, 0, 0);
                break;
            case "minute":
                date.setSeconds(0, 0);
                break;
            default:
                date.setMinutes(0, 0, 0);
        }
        return date;
    }

    /**
     * Processes an API event and updates metrics.
     * @param {object} eventData
     */
    async processEvent(eventData) {
        let rawEventSaved = false;

        try {
            logger.info("Processing event data:", {
                eventId: eventData.eventId,
                clientId: eventData.clientId,
                serviceName: eventData.serviceName,
                endpoint: eventData.endpoint,
                method: eventData.method,
            });

            //step-1 save raw event data to MongoDB
            await this.apiHitRepository.save(eventData);
            rawEventSaved = true;
            logger.info("Raw event saved to MongoD:", {
                eventId: eventData.eventId,
            });

            //step-2 upsert data in PostgreSQL for metrics
            await this._updateMetricsWithFallback(eventData);

            logger.info("Event processed successfully:", {
                eventId: eventData.eventId,
            });
        } catch (error) {
            if (!rawEventSaved) {
                logger.error("Critical: Failed to save raw event to MongoDB:", {
                    error: error.message,
                    eventId: eventData.eventId,
                });
                throw error;
            }
            logger.error(
                "Non-critical: Raw event saved but metrics update failed:",
                {
                    error: error.message,
                    eventId: eventData.eventId,
                },
            );
        }
    }

    /**
     * Updates metrics in PostgreSQL with a fallback mechanism.
     * @param {object} eventData
     */
    async _updateMetricsWithFallback(eventData) {
        try {
            // Calculate time bucket
            const timeBucket = this.getTimeBucket(eventData.timestamp, "hour");

            // Prepare metrics data for upsert
            const metricsData = {
                clientId: eventData.clientId.toString(),
                serviceName: eventData.serviceName,
                endpoint: eventData.endpoint,
                method: eventData.method,
                totalHits: 1,
                errorHits: eventData.statusCode >= 400 ? 1 : 0,
                avgLatency: eventData.latencyMs,
                minLatency: eventData.latencyMs,
                maxLatency: eventData.latencyMs,
                timeBucket,
            };
            await this.metricsRepository.upsertEndpointMetrics(metricsData);

            logger.info("Metrics updated successfully", {
                eventId: eventData.eventId,
            });
        } catch (error) {
            logger.error("Error updating metrics, but raw event is saved:", {
                error: error.message,
                eventId: eventData.eventId,
            });
            throw error;
        }
    }

    /**
     *  Deletes API hit records older than the specified number of days.
     * @param {*} daysToKeeep
     * @returns {number} count of deleted records
     */
    async cleanupOldEvents(daysToKeeep = 30) {
        try {
            let cutoffDate = new Date();
            cutoffDate.setDate(cutoffDate.getDate() - daysToKeeep);

            const deletedCount =
                await this.apiHitRepository.deleteOldHits(cutoffDate);
            return deletedCount;
        } catch (error) {
            logger.error("Error during cleanup:", error);
            throw error;
        }
    }
}
