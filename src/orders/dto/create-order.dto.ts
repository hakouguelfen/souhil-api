export class OrderItemDto {
  productId: string;
  quantity: number;
}

export class CreateOrderDto {
  items: OrderItemDto[];

  deliveryAddress: string;

  notes?: string;
}
