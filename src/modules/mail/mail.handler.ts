import path from 'path';
import fs from 'fs';
import { Resend } from 'resend';
import { Logger } from '../../shared/logger'
import { Mail } from './mail.interface';
import { env } from '../../config/env';
import { MailError } from '../../shared/error';

const resend = new Resend(env.RESEND_API_KEY);

export class MailHandler {
  private static readonly logger = new Logger();

  private static getTemplateContent(templateName: string): string {
    const templatePath = path.resolve(__dirname, `./templates/${templateName}.html`);
    return fs.readFileSync(templatePath, 'utf8');
  }

private static compileTemplate(template: string, data: Record<string, string | number>): string {
    return template.replace(/{{(\w+)}}/g, (match, key) => {
        const value = data[key];
        return typeof value === 'string' || typeof value === 'number' ? String(value) : match;
    });
}

  public static async sendTemplateMail(mail: Mail, templateName: string, data: Record<string, string | number>): Promise<void> {
    try {
      const templateContent = MailHandler.getTemplateContent(templateName);
      const compiledTemplate = MailHandler.compileTemplate(templateContent, data);

      await resend.emails.send({
        from: env.EMAIL_FROM,
        to: mail.to,
        subject: mail.subject,
        html: compiledTemplate,
      });
    } catch (error) {
      MailHandler.logger.error(`Failed to send mail: ${error}`);
      throw new MailError(error)
    }
  }
}