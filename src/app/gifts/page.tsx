'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import GiftForm from '@/components/forms/GiftForm';
import GiftList from '@/components/ui/GiftList';
import Button from '@/components/ui/Button';

export default function GiftsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [showArchived, setShowArchived] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Gift Ideas</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">
                {showArchived ? 'Archived Gift Ideas' : 'Your Gift Ideas'}
              </h2>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setShowArchived(!showArchived)}
              >
                {showArchived ? 'Show Active' : 'Show Archived'}
              </Button>
            </div>
            <GiftList
              recipientId={user.uid}
              showArchived={showArchived}
            />
          </div>

          {!showArchived && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Add New Gift Idea</h2>
              <GiftForm
                recipientId={user.uid}
                onSuccess={() => {
                  // Force GiftList to refresh by triggering a re-render
                  window.location.reload();
                }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}