import { Timestamp } from 'firebase/firestore';

export interface GiftIdea {
  id: string;
  title: string;
  description: string;
  priceEstimate?: number;
  url?: string;
  recipientId: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  isPurchased?: boolean;
  isArchived?: boolean;
}

export interface Recipient {
  id: string;
  name: string;
  createdAt: Timestamp;
}