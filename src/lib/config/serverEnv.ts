function getEnvVar(key: string): string {
  const value = process.env[key];
  if (!value) throw new Error(`Missing environment variable: ${key}`);
  return value;
}

export const serverEnv = {
  PAYPAL_CLIENT_SECRET: getEnvVar('PAYPAL_CLIENT_SECRET'),
  PAYPAL_BASE_URL: getEnvVar('PAYPAL_API_BASE'),
  PAYPAL_WEBHOOK_ID: getEnvVar('PAYPAL_WEBHOOK_ID'),
  JWT_EMAIL_SECRET: getEnvVar('JWT_EMAIL_SECRET'),
  FROM_EMAIL: getEnvVar('FROM_EMAIL'),
  SENDGRID_API_KEY: getEnvVar('SENDGRID_API_KEY')
};
