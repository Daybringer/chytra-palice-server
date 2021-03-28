import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { OAuth2Client } from 'google-auth-library';
import { Repository } from 'typeorm';
import { AdminEntity } from './entities/admin.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(AdminEntity)
    private readonly adminRepository: Repository<AdminEntity>,
    private jwtService: JwtService,
  ) {}
  /**
   *
   * @param authCode
   */
  async googleLogin(id_token: string) {
    const payload = await this.validateGoogleID(id_token);
    const { email, name, hd, sub } = payload;
    if (hd !== 'gjk.cz') throw new UnauthorizedException('Unauthorized domain');

    const isAdmin = Boolean(this.adminRepository.findOne({ where: { email } }));
    const userPayload = { email, name, isAdmin, sub };
    return await this.jwtService.signAsync(userPayload);
  }

  /**
   *
   * @param id_token
   * @returns
   */
  async validateGoogleID(id_token: string) {
    const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
    const ticket = await client.verifyIdToken({
      idToken: id_token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    return payload;
  }
}
