import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({ _id: false })
export class Price {
  @Prop({ required: true, min: 0 })
  costPrice: number;

  @Prop({ required: true, min: 0 })
  unitPrice: number;

  @Prop({ default: 0, min: 0 })
  boxPrice: number;

  @Prop({ required: true, min: 0 })
  unitsPerBox: number;

  @Prop({ required: true })
  sellByUnit: boolean;

  @Prop({ required: true })
  sellByBox: boolean;
}

export const PriceSchema = SchemaFactory.createForClass(Price);
// {
//   name: "Steel Pipe 10mm",
//   prices: {
//     individual: { cost: 10, unitPrice: 15, cargoPrice: 2 },
//     shop:       { cost: 10, unitPrice: 12, cargoPrice: 1 },
//     factory:    { cost: 10, unitPrice: 9,  cargoPrice: 0 },
//     vip:        { cost: 10, unitPrice: 8,  cargoPrice: 0 }
//   }
// }
