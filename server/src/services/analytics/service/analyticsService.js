import logger from "../../../shared/config/logger.js";
import AppError from "../../../shared/utils/AppError.js";

export class AnalyticsService {
    constructor(metricsRepo, apiHitRepo) {
        if (!metricsRepo) {
            throw new Error("AnalyticsService requires a metricsRepository");
        }
        if (!apiHitRepo) {
            throw new Error("AnalyticsService requires an apiHitRepository");
        }
        this.metricsRepository = metricsRepo;
        this.apiHitRepository = apiHitRepo;
    }

    async getOverallStats(clientId, filters = {}) {
        try {
            const { startTime, endTime } = this.parseTimeFilters(filters);

            const stats = await this.metricsRepository.getOverallStats(
                clientId,
                startTime,
                endTime,
            );

            const totalHits = parseInt(stats.total_hits) || 0;
            const errorHits = parseInt(stats.error_hits) || 0;
            const errorRate = totalHits > 0 ? (errorHits / totalHits) * 100 : 0;

            return {
                totalHits,
                errorHits,
                successHits: totalHits - errorHits,
                errorRate: parseFloat(errorRate.toFixed(2)),
                avgLatency: parseFloat(stats.avg_latency) || 0,
                uniqueServices: parseInt(stats.unique_services) || 0,
                uniqueEndpoints: parseInt(stats.unique_endpoints) || 0,
                timeRange: {
                    start: startTime,
                    end: endTime,
                },
            };
        } catch (error) {
            logger.error("Error getting overall stats:", error);
            throw error;
        }
    }

    parseTimeFilters(filters = {}) {
        let { startTime, endTime } = filters;
        if (!startTime) {
            startTime = new Date();
            startTime.setHours(startTime.getHours() - 24); // Last 24 hrs
        } else {
            startTime = new Date(startTime);
        }

        if (!endTime) {
            endTime = new Date();
        } else {
            endTime = new Date(endTime);
        }

        return { startTime, endTime };
    }

    async getTopEndpoints(clientId, options = {}) {
        try {
            const { limit = 10, startTime } = options;
            const parsedStartTime = startTime ? new Date(startTime) : null;

            const endpoints = await this.metricsRepository.getTopEndpoints(
                clientId,
                limit,
                parsedStartTime,
            );

            return endpoints.map((endpoint) => ({
                serviceName: endpoint.service_name,
                endpoint: endpoint.endpoint,
                method: endpoint.method,
                totalHits: parseInt(endpoint.total_hits),
                avgLatency: parseFloat(endpoint.avg_latency).toFixed(2),
                errorHits: parseInt(endpoint.error_hits),
                errorRate: endpoint.total_hits > 0
                    ? parseFloat(((parseInt(endpoint.error_hits) / parseInt(endpoint.total_hits)) * 100).toFixed(2))
                    : 0,
            }));
        } catch (error) {
            logger.error("Error getting top endpoints:", error);
            throw error;
        }
    }

    async getTimeSeries(clientId, filters = {}) {
        try {
            const {
                serviceName,
                endpoint,
                startTime,
                endTime,
                limit = 100,
            } = filters;

            const { endTime: end_time, startTime: start_time } =
                this.parseTimeFilters({ startTime, endTime });

            const metrics = await this.metricsRepository.getMetrics({
                clientId,
                serviceName,
                endpoint,
                startTime: start_time,
                endTime: end_time,
                limit,
            });

            return metrics.map((metric) => ({
                serviceName: metric.service_name,
                endpoint: metric.endpoint,
                method: metric.method,
                totalHits: parseInt(metric.total_hits),
                errorHits: parseInt(metric.error_hits),
                avgLatency: parseFloat(metric.avg_latency).toFixed(2),
                minLatency: parseFloat(metric.min_latency).toFixed(2),
                maxLatency: parseFloat(metric.max_latency).toFixed(2),
                timeBucket: metric.time_bucket,
            }));
        } catch (error) {
            logger.error("Error getting time series:", error);
            throw error;
        }
    }

    async getRecentHits(clientId, filters = {}) {
        try {
            const hitsData = await this.apiHitRepository.findHits({
                ...filters,
                clientId,
            });

            const formattedHits = hitsData.hits.map((hit) => {
                const { _id, __v, createdAt, updatedAt, ...rest } = hit;
                return {
                    ...rest,
                    id: _id.toString(),
                };
            });

            return {
                hits: formattedHits,
                total: hitsData.total,
                limit: filters.limit ? parseInt(filters.limit, 10) : 50,
                offset: filters.offset ? parseInt(filters.offset, 10) : 0,
            };
        } catch (error) {
            logger.error("Error getting recent hits:", error);
            throw error;
        }
    }
}
