import { SignUpDto } from 'src/auth/dto/signUp.dto';
import { UserRepository } from '../repo/user/users.repository';
import * as bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async createUser(userData: SignUpDto) {
    const { email, name, password } = userData;
    const hashedPassword = bcrypt.hashSync(password, 10);
    return this.userRepository.createUser({
      email,
      name,
      password: hashedPassword,
    });
  }
  async findUserByEmail(email: string) {
    return this.userRepository.findUserByEmail(email);
  }
}
