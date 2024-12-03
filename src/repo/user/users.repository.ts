import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../../users/schema/users.schema';
import { HttpException, HttpStatus } from '@nestjs/common';
import { SignUpDto } from 'src/auth/dto/signUp.dto';

@Injectable()
export class UserRepository {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async createUser(userData: SignUpDto): Promise<User> {
    console.log(userData);
    const createdUser = new this.userModel(userData);
    try {
      return await createdUser.save();
    } catch (error: any) {
      // Catch validation errors (e.g., password validation)
      if (error.name === 'ValidationError') {
        // If password validation fails, extract the error message
        if (error.errors && error.errors.password) {
          const passwordErrorMessage = error.errors.password.message;
          // Throw a custom exception with the validation message
          throw new HttpException(
            { message: passwordErrorMessage },
            HttpStatus.BAD_REQUEST, // Use 400 Bad Request status code
          );
        }

        // Catch other validation errors and send generic message
        throw new HttpException(
          { message: error.message || 'Validation failed' },
          HttpStatus.BAD_REQUEST,
        );
      }

      // Handle duplicate email error (MongoDB error code)
      if (error.code === 11000) {
        throw new HttpException(
          { message: 'Duplicate Email, please use some other email.' },
          HttpStatus.BAD_REQUEST,
        );
      }

      // For other types of errors, just throw them with a 500 status
      throw new HttpException(
        { message: 'Internal server error' },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findUserByEmail(email: string) {
    return this.userModel.findOne({ email });
  }
}
