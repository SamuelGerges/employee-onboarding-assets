import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

@Injectable()
export class PasswordService {
  constructor(private readonly configService: ConfigService) {}

  async hashPassword(password: string): Promise<string> {
    const saltRounds = Number(this.configService.get('SALT_ROUNDS', 10));

    return bcrypt.hash(password, saltRounds);
  }
}