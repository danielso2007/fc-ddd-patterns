import EventHandlerInterface from "../../../@shared/event/event-handler.interface";
import ProductCreatedEvent from "../product-created.event";

export default class SendEmailWhenProductIsCreatedHandler
  implements EventHandlerInterface<ProductCreatedEvent> {
  handle(_event: ProductCreatedEvent): void {
    // eslint-disable-next-line no-console
    console.info(`Sending email to .....`);
  }
}
