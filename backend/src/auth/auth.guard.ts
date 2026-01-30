import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedException('No authorization header');
    }

    const token = this.authService.extractTokenFromHeader(authHeader);
    
    if (!token) {
      throw new UnauthorizedException('Invalid authorization header format');
    }

    try {
      const { user, payload } = await this.authService.validateAndSyncUser(token);
      
      request.user = payload;      // Auth0 payload
      request.currentUser = user;  // Database user
      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
