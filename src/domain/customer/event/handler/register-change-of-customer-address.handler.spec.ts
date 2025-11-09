import EventDispatcher from "../../../@shared/event/event-dispatcher";
import CustomerNewRegistersEvent from "../customer-new-registers.event";
import Customer from "../../entity/customer";
import Address from "../../value-object/address";
import RegisterChangeOfCustomerAddressHandler from "./register-change-of-customer-address.handler";
import CustomerAddressChangedEvent from "../customer-address.changed.event";

describe("RegisterChangeOfCustomerAddressHandler", () => {

  let registerChangeOfCustomerAddressHandler: RegisterChangeOfCustomerAddressHandler;

  beforeEach(() => {
    registerChangeOfCustomerAddressHandler = new RegisterChangeOfCustomerAddressHandler();
    jest.spyOn(console, "info").mockImplementation(() => { });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should log info when handling a new customer registration event", () => {
    const customer = new Customer("C1", "Customer 1");
    customer.changeAddress(new Address("Street Novo", 1, "Zip", "City"));
    const event = new CustomerAddressChangedEvent(customer);

    registerChangeOfCustomerAddressHandler.handle(event);

    const eventDispatcher = new EventDispatcher();
    eventDispatcher.register("CustomerAddressChangedEvent", registerChangeOfCustomerAddressHandler);

    const handlers = eventDispatcher.getEventHandlers["CustomerAddressChangedEvent"];
    expect(Array.isArray(handlers)).toBeTruthy();
    expect(handlers.length).toBeGreaterThan(0);
    expect(handlers[0]).toBe(registerChangeOfCustomerAddressHandler);

    eventDispatcher.notify(event);

    expect(console.info).toHaveBeenCalledWith(expect.stringContaining(customer.id));
    expect(console.info).toHaveBeenCalledWith(expect.stringContaining(customer.name));
    expect(console.info).toHaveBeenCalledWith(expect.stringContaining("Endereço do cliente: C1, Customer 1 alterado para: Street Novo"));
  });

});


