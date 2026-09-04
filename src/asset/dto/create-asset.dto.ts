import { IsInt, isNotEmpty, IsString, IsNotEmpty, MaxLength } from "class-validator";

export class CreateAssetDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;

  @IsInt()
  @IsNotEmpty()
  assetTypeId: number;
}
