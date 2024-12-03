import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schema/users.schema';
import { UserRepository } from '../repo/user/users.repository';
import { UserService } from './users.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  providers: [UserRepository, UserService],
  exports: [UserRepository, UserService],
})
export class UsersModule {}
