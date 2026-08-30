import { IsDefined, ValidateNested } from "class-validator";
import { Type } from 'class-transformer'
import { LocalizedTextDto } from "../../common/localized-name.type";


export class CreateDepartmentDto {

  @IsDefined()
  @ValidateNested()
  @Type(() => LocalizedTextDto)
  name: LocalizedTextDto
}
