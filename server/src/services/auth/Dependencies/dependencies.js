import { AuthController } from "../controller/authController.js";
import { AuthService } from "../service/authService.js";
import MongoUserRepository from "../repository/UserRepository.js";

class container {
    static init() {
        const repositories = {
            userRepository: MongoUserRepository,
        };

        // Initialize services with their respective repositories
        const services = {
            authService: new AuthService(repositories.userRepository),
        };

        // Initialize controllers with their respective services
        const controller = {
            authController: new AuthController(services.authService),
        };

        return {
            repositories,
            services,
            controller,
        };
    }
}

const initilized = container.init();
export { container };
export default initilized;
