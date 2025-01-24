import { Module, Global } from '@nestjs/common';
import { MailService } from './services/mail.service';
import { ViaCEPService } from './services/viacep.service';

@Global()
@Module({
  providers: [MailService, ViaCEPService],
  exports: [MailService, ViaCEPService],
})
export class SharedModule {} 