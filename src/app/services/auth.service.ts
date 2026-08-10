import { Injectable, computed, signal } from '@angular/core';
import { ProfileUpdate, SignupData, User } from '../models/user.model';

interface StoredAccount {
  user: User;
  passwordHash: string;
}

interface ResetRequest {
  email: string;
  expiresAt: number;
}

const USERS_KEY = 'vacation-store-users';
const SESSION_KEY = 'vacation-store-session';
const RESET_TOKENS_KEY = 'vacation-store-reset-tokens';
const RESET_TOKEN_TTL_MS = 30 * 60 * 1000;

export class AuthError extends Error {}

async function hashPassword(password: string): Promise<string> {
  const bytes = new TextEncoder().encode(password);
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson(key: string, value: unknown): void {
  localStorage.setItem(key, JSON.stringify(value));
}

/**
 * Client-only mock of a user backend — accounts, sessions and reset tokens all
 * live in localStorage. Swap the bodies of these methods for real HTTP calls
 * once a server exists; the signatures are the intended API surface.
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly currentUserSig = signal<User | null>(this.restoreSession());
  readonly currentUser = this.currentUserSig.asReadonly();
  readonly isAuthenticated = computed(() => this.currentUserSig() !== null);

  async signup(data: SignupData): Promise<User> {
    const email = data.email.trim().toLowerCase();
    const accounts = this.readAccounts();
    if (accounts[email]) {
      throw new AuthError('An account with this email already exists.');
    }

    const user: User = {
      id: crypto.randomUUID(),
      email,
      firstName: data.firstName.trim(),
      lastName: data.lastName.trim(),
      pictureUrl: data.pictureUrl,
    };

    accounts[email] = { user, passwordHash: await hashPassword(data.password) };
    this.writeAccounts(accounts);
    this.startSession(user);
    return user;
  }

  async login(email: string, password: string): Promise<User> {
    const account = this.readAccounts()[email.trim().toLowerCase()];
    if (!account || account.passwordHash !== (await hashPassword(password))) {
      throw new AuthError('Incorrect email or password.');
    }

    this.startSession(account.user);
    return account.user;
  }

  logout(): void {
    localStorage.removeItem(SESSION_KEY);
    this.currentUserSig.set(null);
  }

  updateProfile(updates: ProfileUpdate): User {
    const user = this.currentUserSig();
    if (!user) throw new AuthError('You must be signed in to update your profile.');

    const accounts = this.readAccounts();
    const account = accounts[user.email];
    if (!account) throw new AuthError('Your account could not be found.');

    const updatedUser: User = {
      ...user,
      firstName: updates.firstName.trim(),
      lastName: updates.lastName.trim(),
      pictureUrl: updates.pictureUrl,
    };

    account.user = updatedUser;
    this.writeAccounts(accounts);
    this.currentUserSig.set(updatedUser);
    return updatedUser;
  }

  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    const user = this.currentUserSig();
    if (!user) throw new AuthError('You must be signed in to change your password.');

    const accounts = this.readAccounts();
    const account = accounts[user.email];
    if (!account || account.passwordHash !== (await hashPassword(currentPassword))) {
      throw new AuthError('Current password is incorrect.');
    }

    account.passwordHash = await hashPassword(newPassword);
    this.writeAccounts(accounts);
  }

  /** Simulates issuing a password-reset email. Returns the token directly since no mail server exists. */
  async requestPasswordReset(email: string): Promise<string | null> {
    const normalized = email.trim().toLowerCase();
    if (!this.readAccounts()[normalized]) return null;

    const token = crypto.randomUUID();
    const tokens = this.readResetTokens();
    tokens[token] = { email: normalized, expiresAt: Date.now() + RESET_TOKEN_TTL_MS };
    this.writeResetTokens(tokens);
    return token;
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    const tokens = this.readResetTokens();
    const request = tokens[token];
    if (!request || request.expiresAt < Date.now()) {
      throw new AuthError('This reset link is invalid or has expired.');
    }

    const accounts = this.readAccounts();
    const account = accounts[request.email];
    if (!account) throw new AuthError('This reset link is invalid or has expired.');

    account.passwordHash = await hashPassword(newPassword);
    this.writeAccounts(accounts);

    delete tokens[token];
    this.writeResetTokens(tokens);
  }

  private startSession(user: User): void {
    localStorage.setItem(SESSION_KEY, user.email);
    this.currentUserSig.set(user);
  }

  private restoreSession(): User | null {
    const email = localStorage.getItem(SESSION_KEY);
    if (!email) return null;
    return this.readAccounts()[email]?.user ?? null;
  }

  private readAccounts(): Record<string, StoredAccount> {
    return readJson(USERS_KEY, {});
  }

  private writeAccounts(accounts: Record<string, StoredAccount>): void {
    writeJson(USERS_KEY, accounts);
  }

  private readResetTokens(): Record<string, ResetRequest> {
    return readJson(RESET_TOKENS_KEY, {});
  }

  private writeResetTokens(tokens: Record<string, ResetRequest>): void {
    writeJson(RESET_TOKENS_KEY, tokens);
  }
}
