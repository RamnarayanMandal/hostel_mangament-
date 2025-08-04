import { USER_GENDER, USER_ROLE } from "../types/enum";

export interface RegisterDto {
    email: string;
    firstName: string;
    lastName: string;
    role: USER_ROLE;
    gender: USER_GENDER;
    phoneNumber: string;
    password: string;
  }


  export interface LoginDto {
    email: string;
    password: string;
  }

  export interface UpdateUserDto {
    firstName: string;
    lastName: string;
    gender: USER_GENDER;
    phoneNumber: string;
  }

  
