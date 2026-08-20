import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import type { Model } from "mongoose";
import { ProductsService } from "src/scopes/products/products.service";
import { CreateClientTypeDto } from "./dto/create-client-type.dto";
import { UpdateClientTypeDto } from "./dto/update-client-type.dto";
import { ClientType } from "./entities/client-type.entity";

@Injectable()
export class ClientTypeService {
  constructor(
    @InjectModel(ClientType.name) private clientTypeModel: Model<ClientType>,
    private productsService: ProductsService,
  ) { }

  async create(dto: CreateClientTypeDto) {
    const exists = await this.clientTypeModel.findOne({
      key: dto.key.toLowerCase(),
    });
    if (exists)
      throw new ConflictException(`Client type "${dto.key}" already exists`);

    return this.clientTypeModel.create(dto);
  }

  update(id: string, dto: UpdateClientTypeDto): Promise<ClientType | null> {
    return this.clientTypeModel
      .findByIdAndUpdate(id, dto, { returnDocument: "after" })
      .exec();
  }

  async findAll(activeOnly = true): Promise<ClientType[]> {
    const filter = activeOnly ? { active: true } : {};

    const counts = await this.productsService.findCounts();
    const countMap = new Map(counts.map((c) => [c._id, c.count]));

    const clientTypes = await this.clientTypeModel
      .find(filter)
      .lean({ virtuals: true });

    return clientTypes.map(({ _id, key, label, active, imageUrl }) => ({
      id: _id.toString(),
      key,
      label,
      active,
      imageUrl: imageUrl,
      productCount: countMap.get(key) ?? 0,
    }));
  }

  async findOne(key: string) {
    const type = await this.clientTypeModel.findOne({ key: key.toLowerCase() });
    if (!type) throw new NotFoundException(`Client type "${key}" not found`);

    return type;
  }

  async deactivate(key: string) {
    const type = await this.clientTypeModel.findOneAndUpdate(
      { key: key.toLowerCase() },
      { active: false },
      { new: true },
    );
    if (!type) throw new NotFoundException(`Client type "${key}" not found`);
    return type;
  }
}
