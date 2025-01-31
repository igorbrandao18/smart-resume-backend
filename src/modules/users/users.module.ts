import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { MailService } from '../../shared/services/mail.service';
import { ViaCEPService } from '../../shared/services/viacep.service';
import { CNPJWSService } from '../../shared/services/cnpj-ws.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [UsersService, MailService, ViaCEPService, CNPJWSService],
  exports: [UsersService],
})
export class UsersModule {} 