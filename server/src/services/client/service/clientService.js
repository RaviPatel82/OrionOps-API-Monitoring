import AppError from "../../../shared/utils/AppError.js";
import logger from "../../../shared/config/logger.js";
import {
    APPLICATION_ROLES,
    isValidClientRole,
} from "../../../shared/constants/roles.js";
import { v4 as uudiv4 } from "uuid";
import crypto from "crypto";

export class ClientService {
    constructor(dependencies) {
        if (!dependencies) {
            throw new Error("dependencies are required");
        }
        if (!dependencies.clientRepository) {
            throw new Error("clientRepository is required");
        }
        if (!dependencies.apiKeyRepository) {
            throw new Error("apiKeyRepository is required");
        }
        if (!dependencies.userRepository) {
            throw new Error("userRepository is required");
        }
        this.clientRepository = dependencies.clientRepository;
        this.apiKeyRepository = dependencies.apiKeyRepository;
        this.userRepository = dependencies.userRepository;
    }

    formatClientForResponse(user) {
        const userObj = user.toObject ? user.toObject() : { ...user };
        delete userObj.password;
        return userObj;
    }

    generateSlug(name) {
        return name
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, "")
            .replace(/\s+/g, "-")
            .replace(/-+/g, "-")
            .trim();
    }

    async createClient(clientData, adminUser) {
        try {
            const { name, email, discription, website } = clientData;
            const slug = this.generateSlug(name);

            const exisitingClient =
                await this.clientRepository.findBySlug(slug);
            if (exisitingClient) {
                throw new AppError(
                    `Client with slug ${slug} already exists`,
                    400,
                );
            }

            const client = await this.clientRepository.create({
                name,
                slug,
                email,
                discription,
                website,
                createdBy: adminUser.userId,
            });
            return client;
        } catch (error) {
            logger.error("Error creating client:", error);
            throw error;
        }
    }

    canUserAccessClient(user, clientId) {
        if (user.role === APPLICATION_ROLES.SUPER_ADMIN) {
            return true;
        }
        return (
            user.clientId && user.clientId.toString() === clientId.toString()
        );
    }

    async createClientUser(clientId, userData, adminUser) {
        try {
            const client = await this.clientRepository.findById(clientId);
            if (!client) {
                throw new AppError("Client not found", 404);
            }
            if (!this.canUserAccessClient(adminUser, clientId)) {
                throw new AppError("Access denied", 403);
            }
            const {
                username,
                email,
                password,
                role = APPLICATION_ROLES.CLIENT_VIEWER,
            } = userData;

            if (!isValidClientRole(role)) {
                throw new AppError("Invalid role for client user", 400);
            }

            let permissions = {
                canCreateApiKeys: false,
                canManageUsers: false,
                canViewAnalytics: true,
                canExportData: false,
            };
            if (role === APPLICATION_ROLES.CLIENT_ADMIN) {
                permissions = {
                    canCreateApiKeys: true,
                    canManageUsers: true,
                    canViewAnalytics: true,
                    canExportData: true,
                };
            }

            const user = await this.userRepository.create({
                username,
                email,
                password,
                role,
                clientId,
                permissions,
            });

            logger.info("Client user created", {
                clientId,
                userId: user._id,
                role,
            });
            return this.formatClientForResponse(user);
        } catch (error) {
            logger.error("Error creating client user:", error);
            throw error;
        }
    }

    generateApiKey() {
        const prefix = "apim";
        const randomBytes = crypto.randomBytes(20).toString("hex");
        return `${prefix}_${randomBytes}`;
    }

    async createApiKey(clientId, keyData, user) {
        try {
            const client = await this.clientRepository.findById(clientId);
            if (!client) {
                throw new AppError("Client not found", 404);
            }
            if (!this.canUserAccessClient(user, clientId)) {
                throw new AppError("Access denied", 403);
            }
            if (
                !(
                    user.role === APPLICATION_ROLES.SUPER_ADMIN ||
                    user.role === APPLICATION_ROLES.CLIENT_ADMIN
                )
            ) {
                throw new AppError(
                    "Access denied - Only Super Admin and Client Admin can create API keys",
                    403,
                );
            }

            const { name, description, environment = "production" } = keyData;
            const keyId = uudiv4();
            const keyValue = this.generateApiKey();

            const apiKey = await this.apiKeyRepository.create({
                keyId,
                keyValue,
                clientId,
                name,
                description,
                environment,
                createdBy: user.userId,
            });
            return apiKey;
        } catch (error) {
            logger.error("Error creating API key:", error);
            throw error;
        }
    }

    async getClientApiKeys(clientId, user) {
        try {
            if (!this.canUserAccessClient(user, clientId)) {
                throw new AppError("Access denied to this client", 403);
            }

            const apiKeys =
                await this.apiKeyRepository.findByClientId(clientId);

            const formattedResponse = apiKeys.map((key) => {
                const keyObj = key.toObject ? key.toObject() : key;
                delete keyObj.keyValue;
                return keyObj;
            });

            return formattedResponse;
        } catch (error) {
            logger.error("Error getting client API keys:", error);
            throw error;
        }
    }

    async getClientByApiKey(apiKey) {
        try {
            const key = await this.apiKeyRepository.findByKeyValue(apiKey);

            if (!key) {
                return null;
            }

            if (key.isExpired()) {
                return null;
            }

            // Get the populated client from the key
            const client = key.clientId;

            return {
                client,
                apiKey: key,
            };
        } catch (error) {
            logger.error("Error finding client by API key:", error);
            throw error;
        }
    }

    async deleteApiKey(clientId, keyId, user) {
        try {
            const client = await this.clientRepository.findById(clientId);
            if (!client) {
                throw new AppError("Client not found", 404);
            }
            if (!this.canUserAccessClient(user, clientId)) {
                throw new AppError("Access denied", 403);
            }
            if (
                !(
                    user.role === APPLICATION_ROLES.SUPER_ADMIN ||
                    user.role === APPLICATION_ROLES.CLIENT_ADMIN
                )
            ) {
                throw new AppError(
                    "Access denied - Only Super Admin and Client Admin can delete API keys",
                    403,
                );
            }

            const apiKeys =
                await this.apiKeyRepository.findByClientId(clientId);
            const keyBelongsToClient = apiKeys.some(
                (key) => key.keyId === keyId,
            );
            if (!keyBelongsToClient) {
                throw new AppError(
                    "API key not found for this client",
                    404,
                );
            }

            const deletedKey =
                await this.apiKeyRepository.deleteByKeyId(keyId);

            logger.info("API key deleted", {
                clientId,
                keyId,
                deletedBy: user.userId,
            });
            return deletedKey;
        } catch (error) {
            logger.error("Error deleting API key:", error);
            throw error;
        }
    }

    async getClientUsers(clientId, user) {
        try {
            const client = await this.clientRepository.findById(clientId);
            if (!client) {
                throw new AppError("Client not found", 404);
            }
            if (!this.canUserAccessClient(user, clientId)) {
                throw new AppError("Access denied to this client", 403);
            }

            const users =
                await this.userRepository.findByClientId(clientId);
            return users;
        } catch (error) {
            logger.error("Error getting client users:", error);
            throw error;
        }
    }

    async deactiveClientUser(clientId, userId, requestingUser) {
        try {
            const client = await this.clientRepository.findById(clientId);
            if (!client) {
                throw new AppError("Client not found", 404);
            }
            if (!this.canUserAccessClient(requestingUser, clientId)) {
                throw new AppError("Access denied", 403);
            }
            if (
                !(
                    requestingUser.role === APPLICATION_ROLES.SUPER_ADMIN ||
                    requestingUser.role === APPLICATION_ROLES.CLIENT_ADMIN
                )
            ) {
                throw new AppError(
                    "Access denied - Only Super Admin and Client Admin can deactivate users",
                    403,
                );
            }

            // Users cannot deactivate themselves
            if (requestingUser.userId.toString() === userId.toString()) {
                throw new AppError("You cannot deactivate your own account", 400);
            }

            // Verify the target user belongs to this client
            const targetUser = await this.userRepository.findById(userId);
            if (!targetUser || !targetUser.isActive) {
                throw new AppError("User not found", 404);
            }
            if (
                !targetUser.clientId ||
                targetUser.clientId.toString() !== clientId.toString()
            ) {
                throw new AppError(
                    "User does not belong to this client",
                    404,
                );
            }

            const deactivatedUser =
                await this.userRepository.deactiveUserById(userId);

            logger.info("Client user deactivated", {
                clientId,
                userId,
                deactivatedBy: requestingUser.userId,
            });
            return deactivatedUser;
        } catch (error) {
            logger.error("Error deactivating client user:", error);
            throw error;
        }
    }
}
