import { IsString, IsNotEmpty, MaxLength } from "class-validator";
// import { Type } from 'class-transformer'
// import { LocalizedTextDto } from "../../common/localized-name.type";


export class CreateDepartmentDto {

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name: string
}
