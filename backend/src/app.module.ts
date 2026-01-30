import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AssetModule } from './asset/asset.module';
import { OrderModule } from './order/order.module';
import { AuthModule } from './auth/auth.module';
import { TestModule } from './test/test.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [PrismaModule, AuthModule, UserModule, AssetModule, OrderModule, TestModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
