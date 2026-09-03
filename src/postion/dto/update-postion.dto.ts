import { PartialType } from '@nestjs/mapped-types';
import { CreatePostionDto } from './create-postion.dto';

export class UpdatePostionDto extends PartialType(CreatePostionDto) {}
