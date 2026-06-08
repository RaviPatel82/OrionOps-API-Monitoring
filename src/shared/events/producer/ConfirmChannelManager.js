import { EventEmitter } from "node:events";

export class ConfirmChannelManager extends EventEmitter {
    constructor({ rabbitmq, logger }) {
        super();
        if (!rabbitmq) {
            throw new Error(
                "Confirm Channel Manager requires rabbitmq connection manager",
            );
        }
        this._rabbitmq = rabbitmq;
        this._logger = logger ?? console;
        this._channel = null;
        this._connecting = false;
        this._connectWaiters = [];
    }

    /**
     * Gets the confirm channel, creating it if necessary.
     * @returns {Promise<Channel>} A promise resolving to the confirm channel.
     */
    async getChannel() {
        if (this._channel) {
            return this._channel;
        }
        if (this._connecting) {
            return new Promise((resolve, reject) => {
                this._connectWaiters.push({ resolve, reject });
            });
        }
        return this._connect();
    }

    /**
     * Establishes a new RabbitMQ confirm channel. If a channel is already being established, it waits for that process to complete.
     * If the channel is successfully established, it resolves any pending promises waiting for the channel. If an error occurs during channel creation, it rejects any pending promises and throws the error.
     * @returns {Promise<any>} A promise that resolves to a RabbitMQ confirm channel.
     * @throws Will throw an error if the channel cannot be established.
     */
    async _connect() {
        this._connecting = true;

        try {
            let connection;
            if (this._rabbitmq.connection) {
                connection = this._rabbitmq.connection;
            } else {
                await this._rabbitmq.connect();
                if (!this._rabbitmq.connection) {
                    throw new Error("Failed to obtain RabbitMQ connection");
                }
                connection = this._rabbitmq.connection;
            }

            // Create a confirm channel
            const confirmChannel = await connection.createConfirmChannel();

            // Listen for 'drain' event to handle back-pressure
            confirmChannel.on("drain", () => this.emit("drain"));

            confirmChannel.on("error", (err) => {
                this._logger.error("[ChannelManager] confirm channel error", {
                    error: err.message,
                    stack: err.stack,
                    code: err.code,
                });
                this._channel = null;
                this.emit("error", err);
            });

            this._channel = confirmChannel;
            this._logger.info("[ChannelManager] confirm channel ready");

            for (const w of this._connectWaiters) w.resolve(confirmChannel);
            this._connectWaiters = [];

            return confirmChannel;
        } catch (error) {
            for (const w of this._connectWaiters) w.reject(error);
            this._connectWaiters = [];
            throw error;
        } finally {
            this._connecting = false;
        }
    }
}
