'use client';

import { useAuth } from '@/context/AuthContext';
import Button from '@/components/ui/Button';

export default function NavBar() {
  const { user, signOut } = useAuth();

  return (
    <nav className="bg-gray-800 border-b border-gray-700">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <a href="/" className="text-2xl font-bold text-purple-500">
            Gifty
          </a>
          <div className="flex items-center gap-6">
            {user && (
              <>
                <a href="/gifts" className="text-gray-300 hover:text-white">
                  Gift Ideas
                </a>
                <Button variant="secondary" size="sm" onClick={signOut}>
                  Logout
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}