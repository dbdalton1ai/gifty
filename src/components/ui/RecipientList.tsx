import { useState, useEffect } from 'react';
import { getRecipients, deleteRecipient } from '@/services/recipientService';
import { Recipient } from '@/types/recipient';
import Button from './Button';

interface RecipientListProps {
  onSelect?: (recipient: Recipient) => void;
  selectedId?: string;
}

export default function RecipientList({ onSelect, selectedId }: RecipientListProps) {
  const [recipients, setRecipients] = useState<Recipient[]>([]);

  useEffect(() => {
    loadRecipients();
  }, []);

  const loadRecipients = async () => {
    try {
      const loadedRecipients = await getRecipients();
      setRecipients(loadedRecipients);
    } catch (error) {
      console.error('Error loading recipients:', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteRecipient(id);
      await loadRecipients();
    } catch (error) {
      console.error('Error deleting recipient:', error);
    }
  };

  if (recipients.length === 0) {
    return (
      <div className="text-center text-gray-400 py-8">
        No recipients yet. Start by adding some!
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {recipients.map((recipient) => (
        <div
          key={recipient.id}
          className={`bg-gray-800 rounded-lg p-4 shadow-lg hover:shadow-xl transition-shadow ${
            selectedId === recipient.id ? 'border-2 border-purple-500' : ''
          }`}
        >
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-white">{recipient.name}</h3>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant={selectedId === recipient.id ? "secondary" : "primary"}
                onClick={() => onSelect?.(recipient)}
              >
                {selectedId === recipient.id ? 'Selected' : 'Select'}
              </Button>
              <Button
                size="sm"
                variant="danger"
                onClick={() => handleDelete(recipient.id)}
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}