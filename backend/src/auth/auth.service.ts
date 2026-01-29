import { Injectable, UnauthorizedException } from '@nestjs/common';
import { createRemoteJWKSet, jwtVerify } from 'jose';
import { config } from '../configue/configue';

@Injectable()
export class AuthService {
  private jwks;

  constructor() {
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

  extractTokenFromHeader(authHeader: string): string | null {
    if (!authHeader) {
      return null;
    }

    const [type, token] = authHeader.split(' ');
    return type === 'Bearer' ? token : null;
  }
}
