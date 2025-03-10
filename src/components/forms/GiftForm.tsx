import { FC, FormEvent, useState } from 'react';
import Button from '../ui/Button';
import { addGiftIdea } from '@/services/giftService';
import { parseGiftText } from '@/services/textParsingService';

interface GiftFormProps {
  recipientId: string;
  onSuccess?: () => void;
}

const GiftForm: FC<GiftFormProps> = ({ recipientId, onSuccess }) => {
  const [giftText, setGiftText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e?: FormEvent) => {
    e?.preventDefault();
    if (!giftText.trim() || isSubmitting) return;
    setIsSubmitting(true);
    
    try {
      const { title, description, priceEstimate, url } = await parseGiftText(giftText);
      await addGiftIdea({
        title,
        description,
        priceEstimate: priceEstimate ? parseFloat(priceEstimate) : undefined,
        url,
        recipientId,
        recipientName: ''
      });
      setGiftText('');
      onSuccess?.();
    } catch (error) {
      console.error('Error adding gift:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-gray-800 p-6 rounded-lg">
      <div>
        <label htmlFor="giftText" className="block text-sm font-medium text-gray-200">
          Add a gift idea
        </label>
        <input
          type="text"
          id="giftText"
          value={giftText}
          onChange={(e) => setGiftText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your gift idea and press Enter..."
          className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 text-white shadow-sm focus:border-purple-500 focus:ring-purple-500"
          disabled={isSubmitting}
          required
        />
      </div>
      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? 'Adding...' : 'Add Gift Idea'}
      </Button>
    </form>
  );
};

export default GiftForm;