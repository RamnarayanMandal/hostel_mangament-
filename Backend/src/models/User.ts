import mongoose from 'mongoose';
import { USER_ROLE, USER_STATUS, USER_GENDER } from '../types/enum';
import { IUser } from '../types/user';

const userSchema = new mongoose.Schema({

  firstName:{
    type:String,
    required:true,
  },
  lastName:{
    type:String,
   
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  role:{
    type:String,
    required:true,
    enum:USER_ROLE,
    default:USER_ROLE.STUDENT,
  },
  status:{
    type:String,
    required:true,
    enum:USER_STATUS,
    default:USER_STATUS.ACTIVE,
  },
  gender:{
    type:String,
    required:true,
    enum:USER_GENDER,
    default:USER_GENDER.MALE,
  },
  password:{
    type:String,
    required:false, // Optional for Google OAuth users
  },
  phoneNumber:{
    type:String,
    
  },
  address:{
    type:String,
  },
  pincode:{
    type:String,
    
  },
  state:{
    type:String,
  },
  city:{
    type:String,
    
  },
  country:{
    type:String,
    default:"India",
  },

  dateOfBirth:{
    type:Date,
  },
 
  profilePicture:{
    type:String,
  },
 
  googleId: String,
  firebaseUid: String,
  isEmailVerified: { type: Boolean, default: false },
  isPhoneVerified: { type: Boolean, default: false },
  emailVerificationToken: String,
  emailVerificationExpires: Date,
  phoneVerificationOTP: String,
  phoneVerificationExpires: Date,
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  loginAttempts: { type: Number, default: 0 },
  lockUntil: Date,

},
{
  timestamps:true,
}
);

// Index for better query performance
userSchema.index({ email: 1 });
userSchema.index({ googleId: 1 });
userSchema.index({ firebaseUid: 1 });
userSchema.index({ phoneNumber: 1 });

export const User = mongoose.model<IUser>('User', userSchema);
