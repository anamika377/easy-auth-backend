import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { UserRepository } from 'src/users/users.repository';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { removeSensitiveFields } from '../utils/user-utils';

@Injectable()
export class AuthService {
  constructor(
    private userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  // Sign-Up method
  async signUp(email: string, name: string, password: string) {
    // Validate password before hashing
    const passwordRegex =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;
    const isValidPassword = passwordRegex.test(password);

    if (!isValidPassword) {
      throw new BadRequestException(
        'Password must be at least 8 characters long, contain at least one letter, one number, and one special character.',
      );
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user with the hashed password
    const user = await this.userRepository.createUser({
      email,
      name,
      password: hashedPassword,
    });

    // Remove password field from the user object before returning it
    //const { password: _, ...userWithoutPassword } = user.toObject(); // Destructure and exclude password
    const userWithoutPassword = removeSensitiveFields(user);

    return {
      message: 'Signup  successful!',
      data: userWithoutPassword,
    };
  }

  // Sign-In method
  async signIn(email: string, password: string) {
    const user = await this.userRepository.findUserByEmail(email);
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
