import { serverEnv } from './../config/serverEnv';
import axios from 'axios';

// Base PayPal client for v1 APIs (subscriptions, plans)
export const paypalClient = axios.create({
  baseURL: serverEnv.PAYPAL_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// PayPal client for v2 APIs (orders)
export const paypalV2Client = axios.create({
  baseURL: serverEnv.PAYPAL_BASE_URL_V2,
  headers: {
    'Content-Type': 'application/json'
  }
});
