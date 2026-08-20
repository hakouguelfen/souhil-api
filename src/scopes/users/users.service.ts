import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { Account } from "./entities/account.entity";
import { User } from "./entities/user.entity";
import { UserRole } from "./entities/user_roles.entity";

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(UserRole.name) private userRoleModel: Model<UserRole>,
    @InjectModel(Account.name) private accountModel: Model<Account>,
  ) { }

  async findAll(): Promise<User[]> {
    return await this.userRoleModel
      .aggregate([
        {
          $lookup: {
            from: "roles",
            localField: "roleId",
            foreignField: "_id",
            as: "role",
          },
        },
        { $unwind: "$role" },
        { $match: { "role.name": "user" } },
        {
          $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "_id",
            as: "user",
          },
        },
        { $unwind: "$user" },
        { $replaceRoot: { newRoot: "$user" } },
      ])
      .exec();
  }

  async updateAccount(userId: string) {
    const result = await this.accountModel.findOneAndUpdate(
      { userId },
      { $set: { verified: true } },
      { returnDocument: "after" },
    );
    if (!result) {
      throw new NotFoundException(`No account found for user ${userId}`);
    }
    return result;
  }
}
