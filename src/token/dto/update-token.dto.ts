import { PartialType } from '@nestjs/mapped-types';
import { AddTokenDto } from './add-token.dto';

export class UpdateTokenDto extends PartialType(AddTokenDto) {}
