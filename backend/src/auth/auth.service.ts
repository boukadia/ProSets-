import { Injectable, UnauthorizedException } from '@nestjs/common';
import { createRemoteJWKSet, jwtVerify } from 'jose';
import { config } from '../configue/configue';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  private jwks;

  constructor(private userService: UserService) {
    console.log('Auth0 Domain:', config.auth0.domain);
    console.log('Auth0 Audience:', config.auth0.audience);
    
    this.jwks = createRemoteJWKSet(
      new URL(`https://${config.auth0.domain}/.well-known/jwks.json`),
    );
  }

  async verifyToken(token: string) {
    try {
      const { payload } = await jwtVerify(token, this.jwks, {
        issuer: `https://${config.auth0.domain}/`,
        audience: config.auth0.audience,
      });
      
      return payload;
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }

  async validateAndSyncUser(token: string) {
    // 1. Verify token
    const payload = await this.verifyToken(token);
    const { sub, email, name, picture } = payload;

    // 2. Check/Create user f database
    const user = await this.userService.findOrCreateByAuth0(
      sub as string,
      email as string,
      name as string | undefined,
      picture as string | undefined,
    );

    return { user, payload };
  }

  extractTokenFromHeader(authHeader: string): string | null {
    if (!authHeader) {
      return null;
    }

    const [type, token] = authHeader.split(' ');
    return type === 'Bearer' ? token : null;
  }
}
