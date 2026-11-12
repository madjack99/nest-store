import { IsEmail } from 'class-validator';

export class UserDTO {
  @IsEmail()
  username: string;

  password: string;
}
