import OrderItem from "../../../../domain/checkout/entity/order_item";
import OrderItemModel from "../sequilize/order-item.model";

export default class OrderItemMapper {
  static toDomain(orderItemModel: OrderItemModel): OrderItem {
    return new OrderItem(
      orderItemModel.id,
      orderItemModel.name,
      orderItemModel.price,
      orderItemModel.product_id,
      orderItemModel.quantity
    );
  }

  static toPersistence(orderItem: OrderItem): any {
    return {
      id: orderItem.id,
      product_id: orderItem.productId,
      name: orderItem.name,
      price: orderItem.price,
      quantity: orderItem.quantity,
    };
  }
}
