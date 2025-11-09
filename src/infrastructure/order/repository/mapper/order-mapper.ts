import Order from "../../../../domain/checkout/entity/order";
import OrderItem from "../../../../domain/checkout/entity/order_item";
import OrderModel from "../sequilize/order.model";
import OrderItemMapper from "./order-item-mapper";

export default class OrderMapper {

  static toDomain(orderModel: OrderModel): Order {
    const items: OrderItem[] = (orderModel.items || []).map((itemModel) =>
      OrderItemMapper.toDomain(itemModel)
    );
    return new Order(orderModel.id, orderModel.customer_id, items);
  }

  static toPersistence(order: Order): {
    id: string;
    customer_id: string;
    total: number;
    items: any[];
  } {
    return {
      id: order.id,
      customer_id: order.customerId,
      total: order.total(),
      items: order.items.map((item) => OrderItemMapper.toPersistence(item)),
    };
  }

  static toDomainList(orderModels: OrderModel[]): Order[] {
    return orderModels.map((om) => OrderMapper.toDomain(om));
  }
}
