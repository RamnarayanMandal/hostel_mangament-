import { Document } from 'mongoose';
import { USER_ROLE, USER_STATUS, USER_GENDER } from './enum';

export interface IUser extends Document {
  _id: string;
  firstName: string;
  lastName?: string;
  email: string;
  role: USER_ROLE;
  status: USER_STATUS;
  gender: USER_GENDER;
  password?: string;
  phoneNumber?: string;
  address?: string;
  pincode?: string;
  state?: string;
  city?: string;
  country: string;
  dateOfBirth?: Date;
  profilePicture?: string;
  googleId?: string;
  firebaseUid?: string;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  emailVerificationToken?: string;
  emailVerificationExpires?: Date;
  phoneVerificationOTP?: string;
  phoneVerificationExpires?: Date;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  loginAttempts: number;
  lockUntil?: Date;
  createdAt: Date;
  updatedAt: Date;
}
