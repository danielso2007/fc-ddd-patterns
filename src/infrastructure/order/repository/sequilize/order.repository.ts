import Order from "../../../../domain/checkout/entity/order";
import OrderModel from "./order.model";
import OrderItemModel from "./order-item.model";
import OrderMapper from "../mapper/order-mapper";

export default class OrderRepository {
  async create(entity: Order): Promise<void> {
    await OrderModel.create(
      OrderMapper.toPersistence(entity),
      {
        include: [{ model: OrderItemModel }],
      }
    );
  }

  async update(entity: Order): Promise<void> {
    await OrderModel.update(
      OrderMapper.toPersistence(entity),
      {
        where: {
          id: entity.id
        },
      }
    );
  }

  async find(id: string): Promise<Order> {
    const orderModel = await OrderModel.findByPk(id, {
      include: [{ model: OrderItemModel, as: "items" }],
    });
    if (!orderModel) throw new Error(`Order ${id} not found`);
    return OrderMapper.toDomain(orderModel);
  }

  async findAll(): Promise<Order[]> {
    const orderModels = await OrderModel.findAll({
      include: [{ model: OrderItemModel, as: "items" }],
    });
    return OrderMapper.toDomainList(orderModels);
  }

}
