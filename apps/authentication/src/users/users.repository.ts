import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, mongo } from "mongoose";
import { User, UserDocument } from "./schemas/user.schema";

@Injectable()
export class UsersRepository {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(user: Partial<User>): Promise<UserDocument> {
    const newUser = new this.userModel(user);
    return newUser.save();
  }

  async find(): Promise<UserDocument[]> {
    return this.userModel.find().exec();
  }

  async findOne(filterQuery: mongo.Filter<User>): Promise<UserDocument | null> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    return this.userModel.findOne(filterQuery as any).exec();
  }
}
