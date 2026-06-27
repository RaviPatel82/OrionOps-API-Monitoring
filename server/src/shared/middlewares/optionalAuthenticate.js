import jwt from "jsonwebtoken";
import config from "../config/index.js";
import logger from "../config/logger.js";

const optionalAuthenticate = async (req, res, next) => {
    try {
        let token = null;

        if (req.cookies && req.cookies.authToken) {
            token = req.cookies.authToken;
        }

        if (token) {
            const decoded = jwt.verify(token, config.jwt.secret);
            const { userId, email, username, role, clientId } = decoded;

            req.user = {
                userId,
                email,
                username,
                role,
                clientId,
            };
        }
        next();
    } catch (error) {
        logger.error("Optional authentication parsing failed", {
            error: error.message,
            path: req.path,
        });
        // We do not throw error here to allow anonymous access
        next();
    }
};

export default optionalAuthenticate;
