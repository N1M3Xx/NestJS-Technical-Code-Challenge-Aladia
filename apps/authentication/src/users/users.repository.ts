import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto, LoggerService } from '@app/common';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly logger: LoggerService,
  ) {}

  async create(user: Partial<User>): Promise<UserDocument> {
    const newUser = new this.userModel(user);
    return newUser.save();
  }

  async find(): Promise<UserDocument[]> {
    return this.userModel.find().exec();
  }

  async findOne(filterQuery: any): Promise<UserDocument | null> {
    return this.userModel.findOne(filterQuery).exec();
  }
}
