import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAssetDto } from './dto/create-asset.dto';
import { UpdateAssetDto } from './dto/update-asset.dto';
import { AssetCategory, AssetStatus, Role } from 'generated/prisma';

@Injectable()
export class AssetService {
  constructor(private prisma: PrismaService) {}

  async create(createAssetDto: CreateAssetDto, sellerId: number) {
    return this.prisma.asset.create({
      data: {
        ...createAssetDto,
        sellerId,
      },
      include: {
        seller: {
          select: { id: true, name: true, email: true },
        },
      },
    });
  }

  async findAll(filters?: {
    category?: AssetCategory;
    status?: AssetStatus;
    search?: string;
    page?: number;
    limit?: number;
  }) {
    const {
      category,
      status = AssetStatus.ACTIVE,
      search,
      page = 1,
      limit = 10,
    } = filters || {};

    const skip = (page - 1) * limit;

    const where: any = {
      status,
      ...(category && { category }),
      ...(search && {
        OR: [
          { title: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
        ],
      }),
    };

    const [assets, total] = await Promise.all([
      this.prisma.asset.findMany({
        where,
        skip,
        take: limit,
        include: {
          seller: {
            select: { id: true, name: true },
          },
          orders: {
            select: { id: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.asset.count({ where }),
    ]);

    return {
      assets,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: number) {
    const asset = await this.prisma.asset.findUnique({
      where: { id },
      include: {
        seller: {
          select: { id: true, name: true, email: true },
        },
        orders: {
          select: { id: true, status: true, user: { select: { id: true, email: true } } },
        },
      },
    });

    if (!asset) {
      throw new NotFoundException(`Asset with ID ${id} not found`);
    }

    return asset;
  }

  async findByUser(userId: number) {
    return this.prisma.asset.findMany({
      where: { sellerId: userId },
      include: {
        orders: {
          select: { id: true, status: true, amount: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async update(id: number, updateAssetDto: UpdateAssetDto, userId: number, userRole: Role) {
    const asset = await this.findOne(id);

    // Check permissions
    if (userRole !== Role.ADMIN && asset.sellerId !== userId) {
      throw new ForbiddenException('You can only update your own assets');
    }

    return this.prisma.asset.update({
      where: { id },
      data: updateAssetDto,
      include: {
        seller: {
          select: { id: true, name: true, email: true },
        },
      },
    });
  }

  async remove(id: number, userId: number, userRole: Role) {
    const asset = await this.findOne(id);

    // Check permissions
    if (userRole !== Role.ADMIN && asset.sellerId !== userId) {
      throw new ForbiddenException('You can only delete your own assets');
    }

    return this.prisma.asset.delete({
      where: { id },
    });
  }

  async incrementDownloadCount(id: number) {
    return this.prisma.asset.update({
      where: { id },
      data: {
        downloadCount: {
          increment: 1,
        },
      },
    });
  }

  async getAssetsByCategory() {
    const categories = await this.prisma.asset.groupBy({
      by: ['category'],
      where: {
        status: AssetStatus.ACTIVE,
      },
      _count: {
        id: true,
      },
    });

    return categories.map((cat) => ({
      category: cat.category,
      count: cat._count.id,
    }));
  }
}
