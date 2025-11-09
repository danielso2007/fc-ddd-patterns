import EventDispatcher from "../../../@shared/event/event-dispatcher";
import CustomerNewRegistersEvent from "../customer-new-registers.event";
import SendEmailToBusinessWhenNewCustomerRegistersHandler from "./send-email to-business-when-new-customer-registers.handler";
import Customer from "../../../../domain/customer/entity/customer";
import Address from "../../../../domain/customer/value-object/address";
import SendEmailCustomerWhenNewRegistersHandler from "./send-email-customer-when-new-registers.handler";

describe("SendEmailToBusinessWhenNewCustomerRegistersHandler", () => {

    let sendEmailToBusinessWhenNewCustomerRegistersHandler: SendEmailToBusinessWhenNewCustomerRegistersHandler;

    beforeEach(() => {
        sendEmailToBusinessWhenNewCustomerRegistersHandler = new SendEmailToBusinessWhenNewCustomerRegistersHandler();
        jest.spyOn(console, "info").mockImplementation(() => { });
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it("should log info when handling a new customer registration event", () => {
        const customer = new Customer("C1", "Customer 1");
        customer.changeAddress(new Address("Street", 1, "Zip", "City"));
        const event = new CustomerNewRegistersEvent(customer);

        sendEmailToBusinessWhenNewCustomerRegistersHandler.handle(event);

        const eventDispatcher = new EventDispatcher();
        eventDispatcher.register("CustomerNewRegistersEvent", sendEmailToBusinessWhenNewCustomerRegistersHandler);

        const handlers = eventDispatcher.getEventHandlers["CustomerNewRegistersEvent"];
        expect(Array.isArray(handlers)).toBeTruthy();
        expect(handlers.length).toBeGreaterThan(0);
        expect(handlers[0]).toBe(sendEmailToBusinessWhenNewCustomerRegistersHandler);

        eventDispatcher.notify(event);

        expect(console.info).toHaveBeenCalledWith(expect.stringContaining(customer.id));
        expect(console.info).toHaveBeenCalledWith(expect.stringContaining(customer.name));
        expect(console.info).toHaveBeenCalledWith(expect.stringContaining("New customer"));
    });

});


