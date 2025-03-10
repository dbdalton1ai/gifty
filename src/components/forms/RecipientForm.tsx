import { useState } from 'react';
import { addRecipient } from '@/services/recipientService';
import Button from '../ui/Button';

interface RecipientFormProps {
  onSuccess?: () => void;
}

export default function RecipientForm({ onSuccess }: RecipientFormProps) {
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await addRecipient({ name });
      setName('');
      onSuccess?.();
    } catch (error) {
      console.error('Error adding recipient:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-gray-800 p-6 rounded-lg">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-200">
          Recipient Name
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 text-white shadow-sm focus:border-purple-500 focus:ring-purple-500"
          required
        />
      </div>
      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? 'Adding...' : 'Add Recipient'}
      </Button>
    </form>
  );
}