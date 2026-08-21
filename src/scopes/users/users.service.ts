import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { Account } from "./entities/account.entity";
import { User } from "./entities/user.entity";
import { UserRole } from "./entities/user_roles.entity";
import { UpdateAccountDto } from "./dto/update_account.dto";

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(UserRole.name) private userRoleModel: Model<UserRole>,
    @InjectModel(Account.name) private accountModel: Model<Account>,
  ) { }

  async findAll(role: string): Promise<User[]> {
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
        { $match: { "role.name": role } },
        {
          $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "_id",
            as: "user",
          },
        },
        { $unwind: "$user" },
        {
          $lookup: {
            from: "accounts",
            localField: "userId",
            foreignField: "userId",
            as: "account",
          },
        },
        {
          $unwind: {
            path: "$account",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $replaceRoot: {
            newRoot: {
              $mergeObjects: [
                "$user",
                { accountVerified: "$account.verified" },
              ],
            },
          },
        },
      ])
      .project({
        id: { $toString: "$_id" },
        username: 1,
        email: 1,
        accountStatus: { $ifNull: ["$accountVerified", false] },
      })
      .exec();
  }

  async findAccount(userId: string) {
    const doc = await this.accountModel.findOne({ userId }).exec();
    if (!doc) throw new NotFoundException(`userId #${userId} not found`);
    return doc;
  }

  async updateAccount(userId: string, body: UpdateAccountDto) {
    const result = await this.accountModel.findOneAndUpdate(
      { userId },
      { $set: { verified: body.verified } },
      { returnDocument: "after" },
    );
    if (!result) {
      throw new NotFoundException(`No account found for user ${userId}`);
    }
    return result;
  }
}
