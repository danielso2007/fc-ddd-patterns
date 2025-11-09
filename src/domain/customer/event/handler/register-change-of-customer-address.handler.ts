import EventHandlerInterface from "../../../@shared/event/event-handler.interface";
import CustomerAddressChangedEvent from "../customer-address.changed.event";

export default class RegisterChangeOfCustomerAddressHandler
  implements EventHandlerInterface<CustomerAddressChangedEvent> {
  handle(_event: CustomerAddressChangedEvent): void {
    // eslint-disable-next-line no-console
    console.info(`Endereço do cliente: ${_event.eventData.id}, ${_event.eventData.name} alterado para: ${_event.eventData.address.street}`);
  }
}
