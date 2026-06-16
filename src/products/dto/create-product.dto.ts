export class CreateProductDto {
  categoryId: string;
  name: string;
  price: number;
  stock_qty: number;
  imageUrl?: string;
  description?: string;
}

export class QueryProductDto {
  category?: string;
  search?: string;
  page?: number;
  limit?: number;
}
