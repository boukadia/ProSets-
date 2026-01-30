import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Req,
  ParseIntPipe,
} from '@nestjs/common';
import { AssetService } from './asset.service';
import { CreateAssetDto } from './dto/create-asset.dto';
import { UpdateAssetDto } from './dto/update-asset.dto';
import { AuthGuard } from '../auth/auth.guard';
import { AssetCategory, AssetStatus } from 'generated/prisma';
import type { Request } from 'express';

@Controller('assets')
export class AssetController {
  constructor(private readonly assetService: AssetService) {}

  @Post()
  @UseGuards(AuthGuard)
  create(@Body() createAssetDto: CreateAssetDto, @Req() req: Request) {
    const userId = req['user'].sub; // Auth0 user ID
    return this.assetService.create(createAssetDto, parseInt(userId));
  }

  @Get()
  findAll(
    @Query('category') category?: AssetCategory,
    @Query('status') status?: AssetStatus,
    @Query('search') search?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.assetService.findAll({
      category,
      status,
      search,
      page: page ? parseInt(page) : undefined,
      limit: limit ? parseInt(limit) : undefined,
    });
  }

  @Get('categories')
  getCategories() {
    return this.assetService.getAssetsByCategory();
  }

  @Get('my-assets')
  @UseGuards(AuthGuard)
  getMyAssets(@Req() req: Request) {
    const userId = req['user'].sub;
    return this.assetService.findByUser(parseInt(userId));
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.assetService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateAssetDto: UpdateAssetDto,
    @Req() req: Request,
  ) {
    const userId = parseInt(req['user'].sub);
    const userRole = req['user']['https://digital-assets-api/role']; // Auth0 custom claim
    return this.assetService.update(id, updateAssetDto, userId, userRole);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  remove(@Param('id', ParseIntPipe) id: number, @Req() req: Request) {
    const userId = parseInt(req['user'].sub);
    const userRole = req['user']['https://digital-assets-api/role'];
    return this.assetService.remove(id, userId, userRole);
  }

  @Post(':id/download')
  @UseGuards(AuthGuard)
  incrementDownload(@Param('id', ParseIntPipe) id: number) {
    return this.assetService.incrementDownloadCount(id);
  }
}
