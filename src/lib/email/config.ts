import sgMail from '@sendgrid/mail';
import { serverEnv } from '@/lib/config/serverEnv';

sgMail.setApiKey(serverEnv.SENDGRID_API_KEY!);

export const fromEmail = serverEnv.FROM_EMAIL!;
export { sgMail };
