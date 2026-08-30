import { IsString, IsNotEmpty, MaxLength } from 'class-validator';

export interface LocalizedName {
  ar: string;
  en: string;
}



export class LocalizedTextDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  ar: string

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  en: string
}