import { IsBoolean, IsInt, IsNotEmpty, IsOptional, IsPositive, IsString, MaxLength } from "class-validator";

export class CreatePostionDto {

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name: string 



  @IsInt()
  @IsPositive()
  department_id: number


  @IsOptional()
  @IsBoolean()
  is_active?: boolean


}
