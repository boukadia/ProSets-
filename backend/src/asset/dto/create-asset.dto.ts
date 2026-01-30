import { IsString, IsNumber, IsEnum, IsOptional, IsArray, IsUrl, Min } from 'class-validator';
import { AssetCategory } from 'generated/prisma';

export class CreateAssetDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsEnum(AssetCategory)
  category: AssetCategory;

  @IsUrl()
  previewUrl: string;

  @IsArray()
  @IsUrl({}, { each: true })
  @IsOptional()
  previewImages?: string[];

  @IsString()
  privateFileKey: string;

  @IsNumber()
  @IsOptional()
  fileSize?: number;
}
