import { render, screen, fireEvent } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import { AuthContext } from '@/context/AuthContext';
import NavBar from '../NavBar';
import { signOut } from 'firebase/auth';
import { User } from 'firebase/auth';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('firebase/auth', () => ({
  signOut: jest.fn(),
  getAuth: jest.fn(),
}));

describe('NavBar', () => {
  const mockRouter = {
    push: jest.fn(),
  };

  const mockUser: Partial<User> = {
    email: 'test@example.com',
    emailVerified: false,
    isAnonymous: false,
    metadata: {},
    providerData: [],
    refreshToken: '',
    tenantId: null,
    delete: jest.fn(),
    getIdToken: jest.fn(),
    getIdTokenResult: jest.fn(),
    reload: jest.fn(),
    toJSON: jest.fn(),
    displayName: null,
    phoneNumber: null,
    photoURL: null,
    providerId: 'password',
    uid: 'test-uid'
  };

  const mockAuthContext = {
    user: null,
    loading: false,
    signIn: jest.fn(),
    signOut: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
  });

  it('displays loading state', () => {
    render(
      <AuthContext.Provider value={{ ...mockAuthContext, loading: true }}>
        <NavBar />
      </AuthContext.Provider>
    );
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('shows login button when user is not authenticated', () => {
    render(
      <AuthContext.Provider value={mockAuthContext}>
        <NavBar />
      </AuthContext.Provider>
    );
    
    const loginButton = screen.getByRole('button', { name: /login/i });
    expect(loginButton).toBeInTheDocument();
    
    fireEvent.click(loginButton);
    expect(mockRouter.push).toHaveBeenCalledWith('/login');
  });

  it('shows logout button when user is authenticated', () => {
    render(
      <AuthContext.Provider value={{ ...mockAuthContext, user: mockUser as User }}>
        <NavBar />
      </AuthContext.Provider>
    );
    
    const logoutButton = screen.getByRole('button', { name: /logout/i });
    expect(logoutButton).toBeInTheDocument();
    expect(screen.getByText('test@example.com')).toBeInTheDocument();
  });

  it('handles logout correctly', async () => {
    const mockSignOut = mockAuthContext.signOut.mockResolvedValueOnce(undefined);
    
    render(
      <AuthContext.Provider value={{ ...mockAuthContext, user: mockUser as User }}>
        <NavBar />
      </AuthContext.Provider>
    );
    
    const logoutButton = screen.getByRole('button', { name: /logout/i });
    fireEvent.click(logoutButton);
    
    expect(mockSignOut).toHaveBeenCalled();
    expect(mockRouter.push).toHaveBeenCalledWith('/login');
  });

  it('handles logout error gracefully', async () => {
    const mockError = new Error('Failed to logout');
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    mockAuthContext.signOut.mockRejectedValueOnce(mockError);
    
    render(
      <AuthContext.Provider value={{ ...mockAuthContext, user: mockUser as User }}>
        <NavBar />
      </AuthContext.Provider>
    );
    
    const logoutButton = screen.getByRole('button', { name: /logout/i });
    fireEvent.click(logoutButton);
    
    expect(consoleSpy).toHaveBeenCalledWith('Error signing out:', mockError);
    
    consoleSpy.mockRestore();
  });

  it('navigates to gifts page when logged in', () => {
    render(
      <AuthContext.Provider value={{ ...mockAuthContext, user: mockUser as User }}>
        <NavBar />
      </AuthContext.Provider>
    );
    
    const giftsLink = screen.getByRole('link', { name: /my gifts/i });
    expect(giftsLink).toBeInTheDocument();
    
    fireEvent.click(giftsLink);
    expect(mockRouter.push).toHaveBeenCalledWith('/gifts');
  });

  it('displays correct navigation items based on auth state', () => {
    const { rerender } = render(
      <AuthContext.Provider value={mockAuthContext}>
        <NavBar />
      </AuthContext.Provider>
    );
    
    // When not logged in
    expect(screen.queryByText(/my gifts/i)).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
    
    // When logged in
    rerender(
      <AuthContext.Provider value={{ ...mockAuthContext, user: mockUser as User }}>
        <NavBar />
      </AuthContext.Provider>
    );
    
    expect(screen.getByText(/my gifts/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /logout/i })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /login/i })).not.toBeInTheDocument();
  });
});