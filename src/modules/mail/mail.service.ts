import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { User } from 'entities/user.entity';

@Injectable()
export class MailService {
    constructor(private mailerService: MailerService) { }

    async sendUserConfirmation(user: User, token: string) {
        const url = `${process.env.HOST_FRONTEND}/auth/confirm?token=${token}`;

        await this.mailerService.sendMail({
            to: user.email,
            // from: '"Support Team" <support@example.com>', // override default from
            subject: '¡Bienvenido a RestHub! Confirma tu correo',
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px; background-color: #ffffff;">
            <div style="text-align: center; margin-bottom: 30px;">
                <h2 style="color: #333; margin: 0;">¡Bienvenido a RestHub!</h2>
            </div>
            
            <p style="color: #555; font-size: 16px; line-height: 1.6;">Hola <strong>${user.name}</strong>,</p>
            
            <p style="color: #555; font-size: 16px; line-height: 1.6;">
                ¡Gracias por registrarte en RestHub! Estamos emocionados de tenerte a bordo. 
                Por favor, verifica tu dirección de correo electrónico para activar tu cuenta y comenzar a gestionar tu negocio.
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
                <a href="${url}" style="background-color: #0070f3; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-size: 16px; font-weight: bold; display: inline-block;">
                    Verificar Correo
                </a>
            </div>
            
            <p style="color: #888; font-size: 14px; text-align: center;">
                Si no creaste una cuenta en RestHub, puedes ignorar este correo.
            </p>
            
            <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
            
            <div style="text-align: center; color: #aaa; font-size: 12px;">
                <p>&copy; ${new Date().getFullYear()} RestHub. Todos los derechos reservados.</p>
            </div>
        </div>
      `,
        });
    }

    async sendPasswordReset(user: User, token: string) {
        const url = `${process.env.HOST_FRONTEND}/auth/reset-password?token=${token}`;

        await this.mailerService.sendMail({
            to: user.email,
            subject: 'Restablecimiento de contraseña',
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px; background-color: #ffffff;">
            <div style="text-align: center; margin-bottom: 30px;">
                <h2 style="color: #333; margin: 0;">Restablecer Contraseña</h2>
            </div>
            
            <p style="color: #555; font-size: 16px; line-height: 1.6;">Hola <strong>${user.name}</strong>,</p>
            
            <p style="color: #555; font-size: 16px; line-height: 1.6;">
                Has solicitado restablecer tu contraseña. Haz clic en el siguiente enlace para crear una nueva contraseña:
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
                <a href="${url}" style="background-color: #0070f3; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-size: 16px; font-weight: bold; display: inline-block;">
                    Restablecer Contraseña
                </a>
            </div>
            
            <p style="color: #555; font-size: 16px; line-height: 1.6;">
                Este enlace expirará en 1 hora.
            </p>

            <p style="color: #888; font-size: 14px; text-align: center;">
                Si no solicitaste restablecer tu contraseña, puedes ignorar este correo.
            </p>
            
            <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
            
            <div style="text-align: center; color: #aaa; font-size: 12px;">
                <p>&copy; ${new Date().getFullYear()} RestHub. Todos los derechos reservados.</p>
            </div>
        </div>
      `,
        });
    }
}
