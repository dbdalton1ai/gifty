import { useEffect, useState } from 'react';
import { GiftIdea } from '@/types/gift';
import { getGiftIdeas, deleteGiftIdea, updateGiftIdea } from '@/services/giftService';
import Button from './Button';
import { Timestamp } from 'firebase/firestore';

interface GiftListProps {
  recipientId?: string;
  onDelete?: () => void;
  showArchived?: boolean;
}

export default function GiftList({ recipientId, onDelete, showArchived = false }: GiftListProps) {
  const [gifts, setGifts] = useState<GiftIdea[]>([]);

  useEffect(() => {
    loadGifts();
  }, [recipientId, showArchived]);

  const loadGifts = async () => {
    try {
      const giftIdeas = await getGiftIdeas(recipientId);
      const filteredGifts = giftIdeas
        .filter(gift => gift.isArchived === showArchived)
        .sort((a, b) => b.createdAt.seconds - a.createdAt.seconds);
      setGifts(filteredGifts);
    } catch (error) {
      console.error('Error loading gifts:', error);
    }
  };

  const handleArchive = async (id: string) => {
    try {
      await updateGiftIdea(id, { isArchived: true });
      await loadGifts();
      onDelete?.();
    } catch (error) {
      console.error('Error archiving gift:', error);
    }
  };

  const handleRestore = async (id: string) => {
    try {
      await updateGiftIdea(id, { isArchived: false });
      await loadGifts();
      onDelete?.();
    } catch (error) {
      console.error('Error restoring gift:', error);
    }
  };

  const handlePurchased = async (id: string) => {
    try {
      await updateGiftIdea(id, { isPurchased: true });
      await loadGifts();
    } catch (error) {
      console.error('Error marking gift as purchased:', error);
    }
  };

  const formatDate = (timestamp: Timestamp) => {
    if (!timestamp) return 'Date not available';
    return timestamp.toDate().toLocaleDateString();
  };

  if (gifts.length === 0) {
    return (
      <div className="text-center text-gray-400 py-8">
        {showArchived ? 'No archived gift ideas.' : 'No gift ideas yet. Start adding some!'}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {gifts.map((gift) => (
        <div
          key={gift.id}
          className={`bg-gray-800 rounded-lg p-4 shadow-lg hover:shadow-xl transition-shadow ${
            gift.isPurchased ? 'border-2 border-green-500' : ''
          }`}
        >
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-semibold text-white">{gift.title}</h3>
              <p className="text-gray-400 mt-1">{gift.description}</p>
              {gift.priceEstimate && (
                <p className="text-purple-400 mt-2">
                  Estimated Price: ${gift.priceEstimate.toFixed(2)}
                </p>
              )}
              <p className="text-gray-500 mt-2 text-sm">Added on: {formatDate(gift.createdAt)}</p>
              {gift.url && (
                <a
                  href={gift.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-500 hover:text-purple-400 mt-2 inline-block"
                >
                  View Link
                </a>
              )}
            </div>
            <div className="flex flex-col gap-2">
              {!gift.isPurchased && !showArchived && (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => handlePurchased(gift.id)}
                  className="ml-4"
                >
                  Mark Purchased
                </Button>
              )}
              {showArchived ? (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handleRestore(gift.id)}
                  className="ml-4"
                >
                  Restore
                </Button>
              ) : (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handleArchive(gift.id)}
                  className="ml-4"
                >
                  Archive
                </Button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}