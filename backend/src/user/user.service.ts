import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    return this.prisma.user.create({
      data: createUserDto,
    });
  }

  async findAll(): Promise<User[]> {
    return this.prisma.user.findMany();
  }

  async findOne(id: number): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  async findByAuth0Id(auth0Id: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { auth0Id },
    });
  }

 

  async findOrCreateByAuth0(
    auth0Id: string,
    email: string,
    name?: string,
    avatar?: string,
  ): Promise<User> {
    let user = await this.findByAuth0Id(auth0Id);
    
    if (!user) {
      user = await this.create({
        auth0Id,
        email,
        name,
        avatar,
      });
    }
    
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    return this.prisma.user.update({
      where: { id },
      data: updateUserDto,
    });
  }

 
}
