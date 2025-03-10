import { Timestamp } from 'firebase/firestore';

export interface GiftIdea {
  id: string;
  title: string;
  description: string;
  priceEstimate?: number;
  url?: string;
  recipientId: string;
  recipientName: string;
  isPurchased: boolean;
  isArchived: boolean;
  createdAt: any; // Firestore Timestamp
  updatedAt: any; // Firestore Timestamp
}

export interface Recipient {
  id: string;
  name: string;
  createdAt: Timestamp;
}