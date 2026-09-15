import {
  IsString,
  IsNotEmpty,
  IsEmail,
  MaxLength,
  IsInt,
  IsBoolean,
  IsEnum,
  IsOptional,
} from "class-validator";
import { UserRoleEnum } from "../../common/enums/user-roles.enum";

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  name: string;

  @IsNotEmpty()
  @IsEmail()
  @MaxLength(100)
  email: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  password: string;

  @IsNotEmpty()
  @IsEnum(UserRoleEnum)
  role: UserRoleEnum;

  @IsOptional()
  @IsInt()
  manager_id?: number;

  @IsNotEmpty()
  @IsInt()
  department_id: number;

  @IsNotEmpty()
  @IsInt()
  position_id: number;

  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}