import EventHandlerInterface from "../../../@shared/event/event-handler.interface";
import CustomerNewRegistersEvent from "../customer-new-registers.event";

export default class SendEmailCustomerWhenNewRegistersHandler
  implements EventHandlerInterface<CustomerNewRegistersEvent> {
  handle(_event: CustomerNewRegistersEvent): void {
    // eslint-disable-next-line no-console
    console.info(`Sending email to customer ${_event.eventData.id}, ${_event.eventData.name}`);
  }
}
