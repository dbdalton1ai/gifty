import { useState, useEffect, useCallback } from 'react';
import { GiftIdea } from '@/types/gift';
import { getGiftIdeas, updateGiftIdea, deleteGiftIdea } from '@/services/giftService';
import { getRecipients } from '@/services/recipientService';
import { Recipient } from '@/types/recipient';
import Button from './Button';

interface GiftListProps {
  recipientId?: string;
  onDelete?: () => void;
  showArchived?: boolean;
}

export default function GiftList({ recipientId, onDelete, showArchived = false }: GiftListProps) {
  const [gifts, setGifts] = useState<GiftIdea[]>([]);
  const [editingGift, setEditingGift] = useState<GiftIdea | null>(null);
  const [recipients, setRecipients] = useState<Recipient[]>([]);

  const loadRecipients = useCallback(async () => {
    try {
      const loaded = await getRecipients();
      setRecipients(loaded);
    } catch (error) {
      console.error('Error loading recipients:', error);
    }
  }, []);

  const loadGifts = useCallback(async () => {
    try {
      const giftIdeas = await getGiftIdeas(recipientId);
      const filteredGifts = giftIdeas
        .filter(gift => gift.isArchived === showArchived)
        .sort((a, b) => b.createdAt.seconds - a.createdAt.seconds);
      setGifts(filteredGifts);
    } catch (error) {
      console.error('Error loading gifts:', error);
    }
  }, [recipientId, showArchived]);

  useEffect(() => {
    loadGifts();
    loadRecipients();
  }, [loadGifts, loadRecipients]);

  // Add refresh event listener
  useEffect(() => {
    const giftListElem = document.querySelector('#giftList');
    const handleRefresh = () => {
      loadGifts();
    };
    
    const handleRecipientRefresh = () => {
      loadRecipients();
    };

    if (giftListElem) {
      giftListElem.addEventListener('refresh', handleRefresh);
    }
    document.addEventListener('recipientListRefresh', handleRecipientRefresh);

    return () => {
      if (giftListElem) {
        giftListElem.removeEventListener('refresh', handleRefresh);
      }
      document.removeEventListener('recipientListRefresh', handleRecipientRefresh);
    };
  }, [loadGifts, loadRecipients]);

  const handleArchive = async (id: string) => {
    try {
      await updateGiftIdea(id, { isArchived: true });
      await loadGifts();
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

  const handleEdit = async (id: string, updates: Partial<GiftIdea>) => {
    try {
      await updateGiftIdea(id, updates);
      setEditingGift(null);
      await loadGifts();
    } catch (error) {
      console.error('Error updating gift:', error);
    }
  };

  const formatDate = (timestamp: any) => {
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
    <div id="giftList" className="space-y-4">
      {gifts.map((gift) => (
        <div
          key={gift.id}
          className={`bg-gray-800 rounded-lg p-4 shadow-lg hover:shadow-xl transition-shadow ${
            gift.isPurchased ? 'border-2 border-green-500' : ''
          }`}
        >
          {editingGift?.id === gift.id ? (
            <div className="space-y-2">
              <input
                type="text"
                value={editingGift.title}
                onChange={(e) => setEditingGift({ ...editingGift, title: e.target.value })}
                className="bg-gray-700 text-white rounded px-2 py-1 w-full"
              />
              <textarea
                value={editingGift.description}
                onChange={(e) => setEditingGift({ ...editingGift, description: e.target.value })}
                className="bg-gray-700 text-white rounded px-2 py-1 w-full"
                rows={3}
              />
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  value={editingGift.priceEstimate || ''}
                  onChange={(e) => setEditingGift({ ...editingGift, priceEstimate: parseFloat(e.target.value) || 0 })}
                  className="bg-gray-700 text-white rounded px-2 py-1"
                  placeholder="Price estimate"
                  step="0.01"
                />
                <select
                  value={editingGift.recipientId}
                  onChange={(e) => {
                    const recipient = recipients.find(r => r.id === e.target.value);
                    setEditingGift({ 
                      ...editingGift, 
                      recipientId: e.target.value,
                      recipientName: recipient?.name || ''
                    });
                  }}
                  className="bg-gray-700 text-white rounded px-2 py-1"
                >
                  {recipients.map((recipient) => (
                    <option key={recipient.id} value={recipient.id}>
                      {recipient.name}
                    </option>
                  ))}
                </select>
              </div>
              <input
                type="url"
                value={editingGift.url || ''}
                onChange={(e) => setEditingGift({ ...editingGift, url: e.target.value })}
                className="bg-gray-700 text-white rounded px-2 py-1 w-full"
                placeholder="URL (optional)"
              />
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={() => handleEdit(gift.id, editingGift)}
                >
                  Save
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => setEditingGift(null)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold text-white">{gift.title}</h3>
                  <p className="text-gray-400 mt-1">{gift.description}</p>
                  {gift.priceEstimate && (
                    <p className="text-purple-400 mt-2">Estimated Price: ${gift.priceEstimate.toFixed(2)}</p>
                  )}
                  <p className="text-gray-500 mt-2 text-sm">Added on: {formatDate(gift.createdAt)}</p>
                  <p className="text-gray-500 text-sm">For: {gift.recipientName}</p>
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
                  {!editingGift && !gift.isPurchased && !showArchived && (
                    <>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handlePurchased(gift.id)}
                        className="ml-4"
                      >
                        Mark Purchased
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => setEditingGift(gift)}
                        className="ml-4"
                      >
                        Edit
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleArchive(gift.id)}
                        className="ml-4"
                      >
                        Archive
                      </Button>
                    </>
                  )}
                  {showArchived && !editingGift && (
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleRestore(gift.id)}
                      className="ml-4"
                    >
                      Restore
                    </Button>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
}