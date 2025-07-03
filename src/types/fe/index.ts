export interface Plan {
  id: string;
  name: string;
  price: number;
  maxGigs: number;
  maxBids: number;
  description: string;
  features: string[];
}
