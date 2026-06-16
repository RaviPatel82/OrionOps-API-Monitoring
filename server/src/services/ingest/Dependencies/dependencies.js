import { createEventProducer } from "../../../shared/events/producer/createEventProducer.js";
import { IngestController } from "../controller/ingestController.js";
import { IngestService } from "../service/ingestService.js";

class Container {
    static init() {
        const eventProducer = createEventProducer();

        const services = {
            ingestService: new IngestService({ eventProducer }),
        };
        const controller = {
            ingestController: new IngestController(services),
        };
        return {
            services,
            controller,
        };
    }
}
const container = Container.init();
export default {
    ingestService: container.services.ingestService,
    ingestController: container.controller.ingestController,
    Container,
};
