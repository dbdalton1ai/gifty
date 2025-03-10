import { render, screen, act } from '@testing-library/react';
import { useContext } from 'react';
import { AuthContext, AuthProvider } from '../AuthContext';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';

jest.mock('firebase/auth', () => ({
  getAuth: jest.fn(),
  onAuthStateChanged: jest.fn(),
}));

// Test component to access context
const TestComponent = () => {
  const { user, loading } = useContext(AuthContext);
  return (
    <div>
      {loading ? (
        'Loading...'
      ) : (
        <div>
          {user ? `Logged in as ${user.email}` : 'Not logged in'}
        </div>
      )}
    </div>
  );
};

describe('AuthContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('provides initial loading state', () => {
    (getAuth as jest.Mock).mockReturnValue({});
    (onAuthStateChanged as jest.Mock).mockImplementation(() => () => {});

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('updates state when user logs in', async () => {
    const mockUser = { email: 'test@example.com' };
    (getAuth as jest.Mock).mockReturnValue({});
    (onAuthStateChanged as jest.Mock).mockImplementation((auth, callback) => {
      callback(mockUser);
      return () => {};
    });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(await screen.findByText('Logged in as test@example.com')).toBeInTheDocument();
  });

  it('updates state when user is not logged in', async () => {
    (getAuth as jest.Mock).mockReturnValue({});
    (onAuthStateChanged as jest.Mock).mockImplementation((auth, callback) => {
      callback(null);
      return () => {};
    });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(await screen.findByText('Not logged in')).toBeInTheDocument();
  });

  it('handles auth state change', async () => {
    const mockUser: User = {
      email: 'test@example.com',
      emailVerified: false,
      isAnonymous: false,
      metadata: {},
      providerData: [],
      refreshToken: '',
      tenantId: null,
      delete: () => Promise.resolve(),
      getIdToken: () => Promise.resolve(''),
      getIdTokenResult: () => Promise.resolve({
        token: '',
        signInProvider: null,
        claims: {},
        authTime: '',
        issuedAtTime: '',
        expirationTime: '',
        signInSecondFactor: null,
      }),
      reload: () => Promise.resolve(),
      toJSON: () => ({}),
      displayName: null,
      phoneNumber: null,
      photoURL: null,
      providerId: 'firebase',
      uid: 'test-uid'
    };

    let authCallback: (user: User | null) => void;
    
    (getAuth as jest.Mock).mockReturnValue({});
    (onAuthStateChanged as jest.Mock).mockImplementation((auth, callback) => {
      authCallback = callback;
      return () => {};
    });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(screen.getByText('Loading...')).toBeInTheDocument();

    // Simulate auth state change
    await act(async () => {
      authCallback(mockUser);
    });

    expect(screen.getByText('Logged in as test@example.com')).toBeInTheDocument();

    // Simulate logout
    await act(async () => {
      authCallback(null);
    });

    expect(screen.getByText('Not logged in')).toBeInTheDocument();
  });

  it('cleans up auth listener on unmount', () => {
    const unsubscribeMock = jest.fn();
    (getAuth as jest.Mock).mockReturnValue({});
    (onAuthStateChanged as jest.Mock).mockImplementation(() => unsubscribeMock);

    const { unmount } = render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    unmount();

    expect(unsubscribeMock).toHaveBeenCalled();
  });
});