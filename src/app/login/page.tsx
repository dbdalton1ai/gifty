import { Button } from '@/components/ui/Button';
import LoginForm from '@/components/forms/LoginForm';

export default function LoginPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto bg-gray-800 p-8 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-center mb-6">Login</h1>
        <LoginForm />
      </div>
    </div>
  );
}