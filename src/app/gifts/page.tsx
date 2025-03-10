'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import GiftForm from '@/components/forms/GiftForm';
import GiftList from '@/components/ui/GiftList';
import Button from '@/components/ui/Button';
import RecipientForm from '@/components/forms/RecipientForm';
import RecipientList from '@/components/ui/RecipientList';
import { Recipient } from '@/types/recipient';

export default function GiftsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [showArchived, setShowArchived] = useState(false);
  const [selectedRecipient, setSelectedRecipient] = useState<Recipient | null>(null);
  const [showRecipientForm, setShowRecipientForm] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  const handleRecipientSelect = (recipient: Recipient) => {
    setSelectedRecipient(recipient === selectedRecipient ? null : recipient);
  };

  const handleGiftSuccess = () => {
    // Use the refresh event instead of page reload
    const giftList = document.querySelector('#giftList');
    if (giftList) {
      giftList.dispatchEvent(new Event('refresh'));
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return null;
  }

  return (
    <main className="container mx-auto p-4">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-white">Recipients</h2>
            <Button 
              onClick={() => setShowRecipientForm(!showRecipientForm)}
              className="w-full"
            >
              {showRecipientForm ? 'Cancel' : 'Add Recipient'}
            </Button>
            {showRecipientForm && (
              <RecipientForm 
                onSuccess={() => {
                  setShowRecipientForm(false);
                  // Force RecipientList to refresh
                  const event = new Event('recipientListRefresh');
                  document.dispatchEvent(event);
                }} 
              />
            )}
            <RecipientList
              onSelect={handleRecipientSelect}
              selectedId={selectedRecipient?.id}
            />
          </div>
        </div>
        <div className="lg:col-span-8">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">
                {selectedRecipient ? `Gift Ideas for ${selectedRecipient.name}` : 'All Gift Ideas'}
              </h2>
              {selectedRecipient && (
                <Button variant="secondary" size="sm" onClick={() => setSelectedRecipient(null)}>
                  Show All Recipients
                </Button>
              )}
            </div>
            <div className="flex justify-between items-center">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setShowArchived(!showArchived)}
              >
                {showArchived ? 'Show Active' : 'Show Archived'}
              </Button>
            </div>
            {selectedRecipient ? (
              <GiftForm 
                recipientId={selectedRecipient.id}
                onSuccess={handleGiftSuccess}
              />
            ) : null}
            <GiftList 
              recipientId={selectedRecipient?.id}
              showArchived={showArchived}
              onDelete={handleGiftSuccess}
            />
          </div>
        </div>
      </div>
    </main>
  );
}