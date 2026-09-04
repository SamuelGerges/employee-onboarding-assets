import { IsNotEmpty, IsString, MaxLength } from "class-validator";

export class CreateAssetTypeDto {


  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;

}
