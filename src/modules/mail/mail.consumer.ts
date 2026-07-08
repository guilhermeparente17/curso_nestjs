import { MailerService } from '@nestjs-modules/mailer';
import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { SEND_PASSWORD_RESET } from 'src/consts';

@Controller()
export class MailConsumer {
  constructor(private mailer: MailerService) {}

  @EventPattern(SEND_PASSWORD_RESET)
  async handlePasswordReset(@Payload() data: { email: string; url: string }) {
    console.log('CHEGOU NO CONSUMER');
    console.log(data);
    await this.mailer.sendMail({
      to: data.email,
      subject: 'Redefinição de senha',
      template: 'forgot-password.hbs',
      context: { url: data.url },
    });
  }
}
