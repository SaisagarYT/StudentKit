import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { LoginForm } from './login-form';

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

// Mock user-auth hook
const mockSignInWithGoogle = vi.fn();
const mockSignInWithEmail = vi.fn();
const mockSignUpWithEmail = vi.fn();

vi.mock('@/lib/firebase/user-auth', () => ({
  useUserAuth: () => ({
    user: null,
    signInWithGoogle: mockSignInWithGoogle,
    signInWithEmail: mockSignInWithEmail,
    signUpWithEmail: mockSignUpWithEmail,
  }),
}));

// Mock firebase client & auth
vi.mock('@/lib/firebase/client', () => ({
  getFirebaseAuth: vi.fn(() => ({})),
}));

vi.mock('firebase/auth', () => ({
  sendPasswordResetEmail: vi.fn(() => Promise.resolve()),
}));

vi.mock('@/lib/firebase/user-progress-sync', () => ({
  syncProgressOnLogin: vi.fn(() => Promise.resolve()),
}));

describe('LoginForm Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders default sign in view correctly', () => {
    render(<LoginForm />);

    expect(screen.getByRole('heading', { name: /welcome back/i })).toBeInTheDocument();
    expect(screen.getByText(/continue with google/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/student@university\.edu/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText('••••••••')).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: /^sign in$/i })[0]).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /forgot password\?/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign up/i })).toBeInTheDocument();
  });

  it('switches to create account mode', () => {
    render(<LoginForm />);

    const signUpToggle = screen.getByRole('button', { name: /sign up/i });
    fireEvent.click(signUpToggle);

    expect(screen.getByRole('heading', { name: /create your account/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/ada lovelace/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /create account/i })).toBeInTheDocument();
  });

  it('switches to forgot password mode and back', () => {
    render(<LoginForm />);

    const forgotBtn = screen.getByRole('button', { name: /forgot password\?/i });
    fireEvent.click(forgotBtn);

    expect(screen.getByRole('heading', { name: /reset your password/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /send reset link/i })).toBeInTheDocument();
    expect(screen.queryByPlaceholderText('••••••••')).not.toBeInTheDocument();

    const backBtn = screen.getByRole('button', { name: /back to sign in/i });
    fireEvent.click(backBtn);

    expect(screen.getByRole('heading', { name: /welcome back/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText('••••••••')).toBeInTheDocument();
  });

  it('toggles password visibility', () => {
    render(<LoginForm />);

    const passwordInput = screen.getByPlaceholderText('••••••••');
    expect(passwordInput).toHaveAttribute('type', 'password');

    const toggleBtn = screen.getByRole('button', { name: /show password/i });
    fireEvent.click(toggleBtn);

    expect(passwordInput).toHaveAttribute('type', 'text');

    const hideBtn = screen.getByRole('button', { name: /hide password/i });
    fireEvent.click(hideBtn);

    expect(passwordInput).toHaveAttribute('type', 'password');
  });
});

