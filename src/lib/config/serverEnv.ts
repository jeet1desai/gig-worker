function getEnvVar(key: string): string {
  const value = process.env[key];
  if (!value) throw new Error(`Missing environment variable: ${key}`);
  return value;
}

export const serverEnv = {
  PAYPAL_CLIENT_ID: getEnvVar('PAYPAL_CLIENT_ID'),
  PAYPAL_CLIENT_SECRET: getEnvVar('PAYPAL_CLIENT_SECRET'),
  PAYPAL_BASE_URL: process.env.PAYPAL_API_BASE || 'https://api-m.sandbox.paypal.com',
  JWT_EMAIL_SECRET: getEnvVar('JWT_EMAIL_SECRET'),
  SMTP_HOST: getEnvVar('SMTP_HOST'),
  SMTP_PORT: getEnvVar('SMTP_PORT'),
  SMTP_USER: getEnvVar('SMTP_USER'),
  SMTP_PASS: getEnvVar('SMTP_PASS'),
  FROM_EMAIL: getEnvVar('FROM_EMAIL'),
};
