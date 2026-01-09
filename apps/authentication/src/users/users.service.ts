import { Injectable } from '@nestjs/common';
import { CreateUserDto, LoggerService } from '@app/common';
import { UserDocument } from './schemas/user.schema';
import { UsersRepository } from './users.repository';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly logger: LoggerService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UserDocument> {
    this.logger.log('Creating new user...');
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(createUserDto.password, salt);
    return this.usersRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });
  }

  async findAll(): Promise<UserDocument[]> {
    this.logger.log('Fetching all users...');
    return this.usersRepository.find();
  }

  async validateUser(email: string, pass: string): Promise<UserDocument | null> {
    const user = await this.usersRepository.findOne({ email });
    if (user && (await bcrypt.compare(pass, user.password))) {
      return user;
    }
    return null;
  }
}
