import EventHandlerInterface from "../../../@shared/event/event-handler.interface";
import CustomerNewRegistersEvent from "../customer-new-registers.event";

export default class SendEmailToBusinessWhenNewCustomerRegistersHandler
  implements EventHandlerInterface<CustomerNewRegistersEvent> {
  handle(_event: CustomerNewRegistersEvent): void {
    // eslint-disable-next-line no-console
    console.info(`New customer ${_event.eventData.id}, ${_event.eventData.name}`);
  }
}
