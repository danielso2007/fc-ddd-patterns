import { Sequelize } from "sequelize-typescript";
import Order from "../../../../domain/checkout/entity/order";
import OrderItem from "../../../../domain/checkout/entity/order_item";
import Customer from "../../../../domain/customer/entity/customer";
import Address from "../../../../domain/customer/value-object/address";
import Product from "../../../../domain/product/entity/product";
import CustomerModel from "../../../customer/repository/sequelize/customer.model";
import CustomerRepository from "../../../customer/repository/sequelize/customer.repository";
import ProductModel from "../../../product/repository/sequelize/product.model";
import ProductRepository from "../../../product/repository/sequelize/product.repository";
import OrderItemModel from "./order-item.model";
import OrderModel from "./order.model";
import OrderRepository from "./order.repository";

describe("Order repository test", () => {
  let sequelize: Sequelize;

  const makeCustomer = (id = "C1"): Customer => {
    const c = new Customer(id, `Customer ${id}`);
    c.changeAddress(new Address("Street", 1, "Zip", "City"));
    return c;
  };

  const makeProduct = (id = "P1", price = 10): Product =>
    new Product(id, `Product ${id}`, price);

  const makeItem = (id = "I1", p = makeProduct("P1", 10), qty = 2): OrderItem =>
    new OrderItem(id, p.name, p.price, p.id, qty);

  const makeOrder = (id = "O1", customerId = "C1", items: OrderItem[] = []): Order =>
    new Order(id, customerId, items);

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    await sequelize.addModels([
      CustomerModel,
      OrderModel,
      OrderItemModel,
      ProductModel,
    ]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
    jest.restoreAllMocks();
  });

  it("should create a new order", async () => {
    const customerRepository = new CustomerRepository();
    const productRepository = new ProductRepository();
    const orderRepository = new OrderRepository();

    const customer = makeCustomer("C123");
    await customerRepository.create(customer);

    const product = makeProduct("P123", 10);
    await productRepository.create(product);

    const orderItem = makeItem("I1", product, 2);
    const order = makeOrder("O123", customer.id, [orderItem]);
    await orderRepository.create(order);

    const orderModel = await OrderModel.findOne({
      where: { id: "O123" },
      include: [{ model: OrderItemModel, as: "items" }],
      nest: true
    });

    expect(orderModel.toJSON()).toStrictEqual({
      id: "O123",
      customer_id: "C123",
      total: order.total(),
      items: [
        {
          id: orderItem.id,
          name: orderItem.name,
          price: orderItem.price,
          quantity: orderItem.quantity,
          order_id: "O123",
          product_id: "P123",
        },
      ],
    });
  });

  it("should update a order", async () => {
    const customerRepository = new CustomerRepository();
    const productRepository = new ProductRepository();
    const orderRepository = new OrderRepository();

    const customer = makeCustomer("C99");
    await customerRepository.create(customer);

    const product = makeProduct("P123", 10);
    await productRepository.create(product);

    const orderItem = makeItem("I1", product, 2);
    const order = makeOrder("O144", customer.id, [orderItem]);
    await orderRepository.create(order);

    const orderModel = await OrderModel.findOne({
      where: { id: order.id },
      include: ["items"]
    });

    expect(orderModel.total).toBe(20);

    const orderItem2 = makeItem("I2", product, 5);

    order.addItems(orderItem2);

    await orderRepository.update(order);

    const order2 = await OrderModel.findOne({
      where: { id: order.id },
      include: ["items"],
    });

    expect(order2.id).toBe("O144");
    expect(order2.customer_id).toBe("C99");
    expect(order2.total).toBe(70);
  });

  it("should find a order", async () => {
    const customerRepository = new CustomerRepository();
    const productRepository = new ProductRepository();
    const orderRepository = new OrderRepository();

    const customer = makeCustomer("C99");
    await customerRepository.create(customer);

    const product = makeProduct("P123", 10);
    await productRepository.create(product);

    const orderItem = makeItem("I1", product, 2);
    const order = makeOrder("O255", customer.id, [orderItem]);
    await orderRepository.create(order);

    const orderModel = await OrderModel.findOne({ where: { id: "O255" } });
    const foundOrder = await orderRepository.find("O255");

    expect(orderModel.id).toBe(foundOrder.id);
    expect(orderModel.customer_id).toBe(foundOrder.customerId);
    expect(orderModel.total).toBe(20);
  });

  it("should find all ordes", async () => {
    const customerRepository = new CustomerRepository();
    const productRepository = new ProductRepository();
    const orderRepository = new OrderRepository();

    const customer = makeCustomer("C99");
    await customerRepository.create(customer);

    const product = makeProduct("P123", 10);
    await productRepository.create(product);

    const orderItem = makeItem("I1", product, 2);
    const order = makeOrder("O255", customer.id, [orderItem]);
    await orderRepository.create(order);

    const customer2 = makeCustomer("C8745");
    await customerRepository.create(customer2);

    const product2 = makeProduct("P77458", 10);
    await productRepository.create(product2);

    const orderItem2 = makeItem("I77411", product2, 2);
    const order2 = makeOrder("O81125", customer.id, [orderItem2]);
    await orderRepository.create(order2);

    const foundOrders = await orderRepository.findAll();
    const orders = [order, order2];

    expect(orders).toEqual(foundOrders);
  });

  it("When order ID is not found", async () => {
    const customerRepository = new CustomerRepository();
    const productRepository = new ProductRepository();
    const orderRepository = new OrderRepository();

    const customer = makeCustomer("C99");
    await customerRepository.create(customer);

    const product = makeProduct("P123", 10);
    await productRepository.create(product);

    const orderItem = makeItem("I1", product, 2);
    const order = makeOrder("O255", customer.id, [orderItem]);
    await orderRepository.create(order);

    await expect(orderRepository.find("OXXXX")).rejects.toThrow("Order OXXXX not found");
  });

});
