import juice from 'juice';

import { transporter, fromEmail } from './config';
import { emailLayout } from '@/lib/email/templates/emailLayout';

type SendEmailParams = {
  to: string;
  subject: string;
  html: string;
  extraStyles?: string;
};

export const sendEmail = async ({
  to,
  subject,
  html,
  extraStyles = '',
}: SendEmailParams) => {
  try {
    const htmlWithLayout = emailLayout(html, extraStyles);
    const inlinedHtml = juice(htmlWithLayout);

    await transporter.sendMail({
      from: fromEmail,
      to,
      subject,
      html: inlinedHtml,
    });

    return { success: true };
  } catch (error) {
    return { success: false, error };
  }
};
