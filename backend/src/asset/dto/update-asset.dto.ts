import { PartialType } from '@nestjs/mapped-types';
import { CreateAssetDto } from './create-asset.dto';
import { IsEnum, IsOptional } from 'class-validator';
import { AssetStatus } from 'generated/prisma';

export class UpdateAssetDto extends PartialType(CreateAssetDto) {
  @IsEnum(AssetStatus)
  @IsOptional()
  status?: AssetStatus;
}
