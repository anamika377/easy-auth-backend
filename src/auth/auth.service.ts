import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { removeSensitiveFields } from '../utils/user-utils';
import { UserService } from 'src/users/users.service';
import { SignUpDto } from './dto/signUp.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  // Sign-Up method
  async signUp(input: SignUpDto) {
    const { password } = input;
    // Validate password before hashing
    const passwordRegex =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;
    const isValidPassword = passwordRegex.test(password);

    if (!isValidPassword) {
      throw new BadRequestException(
        'Password must be at least 8 characters long, contain at least one letter, one number, and one special character.',
      );
    }
    console.log('input', input);

    // Create the user with the hashed password
    const user = await this.userService.createUser(input);

    // Remove password field from the user object before returning it
    const userWithoutPassword = removeSensitiveFields(user);

    return {
      message: 'Signup  successful!',
      data: userWithoutPassword,
    };
  }

  // Sign-In method
  async signIn(email: string, password: string) {
    const user = await this.userService.findUserByEmail(email);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate JWT token
    const accessToken = this.jwtService.sign({ email: user.email });

    return {
      accessToken,
      user, // user already does not include password
    };
  }
}
