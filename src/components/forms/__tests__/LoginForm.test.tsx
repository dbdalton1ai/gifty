import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LoginForm from '../LoginForm';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'next/navigation';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('firebase/auth', () => ({
  signInWithEmailAndPassword: jest.fn(),
  getAuth: jest.fn(),
}));

describe('LoginForm', () => {
  const mockRouter = {
    push: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
  });

  it('renders login form correctly', () => {
    render(<LoginForm />);
    
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  it('handles successful login', async () => {
    (signInWithEmailAndPassword as jest.Mock).mockResolvedValueOnce({});

    render(<LoginForm />);

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'password123' },
    });

    fireEvent.submit(screen.getByRole('form'));

    await waitFor(() => {
      expect(signInWithEmailAndPassword).toHaveBeenCalledWith(
        expect.anything(),
        'test@example.com',
        'password123'
      );
      expect(mockRouter.push).toHaveBeenCalledWith('/gifts');
    });
  });

  it('handles login error', async () => {
    const mockError = new Error('Invalid credentials');
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    (signInWithEmailAndPassword as jest.Mock).mockRejectedValueOnce(mockError);

    render(<LoginForm />);

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'wrongpassword' },
    });

    fireEvent.submit(screen.getByRole('form'));

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('Error signing in:', mockError);
      expect(mockRouter.push).not.toHaveBeenCalled();
    });

    consoleSpy.mockRestore();
  });

  it('requires email and password fields', async () => {
    render(<LoginForm />);

    fireEvent.submit(screen.getByRole('form'));

    // Check that signInWithEmailAndPassword was not called
    expect(signInWithEmailAndPassword).not.toHaveBeenCalled();
  });

  it('validates email format', async () => {
    render(<LoginForm />);

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'invalid-email' },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'password123' },
    });

    fireEvent.submit(screen.getByRole('form'));

    // Email validation is handled by the browser's built-in validation
    expect(signInWithEmailAndPassword).not.toHaveBeenCalled();
  });
});