import { serverEnv } from './../config/serverEnv';
import axios from 'axios';

export const paypalClient = axios.create({
  baseURL: serverEnv.PAYPAL_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});
