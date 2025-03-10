import { collection, addDoc, getDocs, deleteDoc, doc, query, where, Timestamp } from 'firebase/firestore';
import { getFirestore } from 'firebase/firestore';
import { addGiftIdea, getGiftIdeas, deleteGiftIdea } from '../giftService';
import { GiftIdea } from '@/types/gift';

// Mock Firestore
jest.mock('firebase/firestore');

describe('giftService', () => {
  const mockTimestamp = { seconds: 1234567890, nanoseconds: 0 };
  const mockGift: Omit<GiftIdea, 'id'> = {
    title: 'Test Gift',
    description: 'Test Description',
    priceEstimate: 10.99,
    url: 'https://example.com',
    recipientId: 'recipient123',
    isPurchased: false,
    isArchived: false,
    createdAt: mockTimestamp as Timestamp,
    updatedAt: mockTimestamp as Timestamp
  };

  const mockGiftWithId: GiftIdea = {
    id: 'gift123',
    ...mockGift,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (getFirestore as jest.Mock).mockReturnValue({});
  });

  describe('addGiftIdea', () => {
    it('successfully adds a gift idea', async () => {
      (collection as jest.Mock).mockReturnValue('gifts-collection');
      (addDoc as jest.Mock).mockResolvedValue({ id: 'new-gift-id' });

      await addGiftIdea(mockGift);

      expect(collection).toHaveBeenCalledWith(expect.anything(), 'gifts');
      expect(addDoc).toHaveBeenCalledWith('gifts-collection', {
        ...mockGift,
        createdAt: expect.any(Object),
        updatedAt: expect.any(Object)
      });
    });

    it('throws error when adding gift fails', async () => {
      const error = new Error('Failed to add gift');
      (collection as jest.Mock).mockReturnValue('gifts-collection');
      (addDoc as jest.Mock).mockRejectedValue(error);

      await expect(addGiftIdea(mockGift)).rejects.toThrow('Failed to add gift');
    });
  });

  describe('getGiftIdeas', () => {
    it('successfully retrieves gift ideas for a recipient', async () => {
      const mockQuerySnapshot = {
        docs: [
          {
            id: mockGiftWithId.id,
            data: () => ({ ...mockGift }),
          },
        ],
      };

      (collection as jest.Mock).mockReturnValue('gifts-collection');
      (query as jest.Mock).mockReturnValue('filtered-query');
      (where as jest.Mock).mockReturnValue('where-clause');
      (getDocs as jest.Mock).mockResolvedValue(mockQuerySnapshot);

      const result = await getGiftIdeas('recipient123');

      expect(collection).toHaveBeenCalledWith(expect.anything(), 'gifts');
      expect(where).toHaveBeenCalledWith('recipientId', '==', 'recipient123');
      expect(query).toHaveBeenCalledWith('gifts-collection', 'where-clause');
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual(mockGiftWithId);
    });

    it('returns empty array when no gifts found', async () => {
      const mockQuerySnapshot = {
        docs: [],
      };

      (collection as jest.Mock).mockReturnValue('gifts-collection');
      (query as jest.Mock).mockReturnValue('filtered-query');
      (where as jest.Mock).mockReturnValue('where-clause');
      (getDocs as jest.Mock).mockResolvedValue(mockQuerySnapshot);

      const result = await getGiftIdeas('recipient123');

      expect(result).toEqual([]);
    });

    it('throws error when fetching gifts fails', async () => {
      const error = new Error('Failed to fetch gifts');
      (collection as jest.Mock).mockReturnValue('gifts-collection');
      (query as jest.Mock).mockReturnValue('filtered-query');
      (where as jest.Mock).mockReturnValue('where-clause');
      (getDocs as jest.Mock).mockRejectedValue(error);

      await expect(getGiftIdeas('recipient123')).rejects.toThrow('Failed to fetch gifts');
    });
  });

  describe('deleteGiftIdea', () => {
    it('successfully deletes a gift idea', async () => {
      (doc as jest.Mock).mockReturnValue('gift-doc-ref');
      (deleteDoc as jest.Mock).mockResolvedValue(undefined);

      await deleteGiftIdea('gift123');

      expect(doc).toHaveBeenCalledWith(expect.anything(), 'gifts', 'gift123');
      expect(deleteDoc).toHaveBeenCalledWith('gift-doc-ref');
    });

    it('throws error when deleting gift fails', async () => {
      const error = new Error('Failed to delete gift');
      (doc as jest.Mock).mockReturnValue('gift-doc-ref');
      (deleteDoc as jest.Mock).mockRejectedValue(error);

      await expect(deleteGiftIdea('gift123')).rejects.toThrow('Failed to delete gift');
    });

    it('handles non-existent gift deletion', async () => {
      (doc as jest.Mock).mockReturnValue('gift-doc-ref');
      (deleteDoc as jest.Mock).mockRejectedValue(new Error('Document does not exist'));

      await expect(deleteGiftIdea('nonexistent-id')).rejects.toThrow('Document does not exist');
    });
  });
});