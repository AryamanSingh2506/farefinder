import { describe, it, expect } from 'vitest';
import { firebaseConfig, app, db, auth, logFirebaseEvent } from '@/lib/firebase/client';

describe('Firebase Integration Suite (cheap-flight-e7d4f)', () => {
  it('loads the correct Firebase project configuration', () => {
    expect(firebaseConfig.projectId).toBe('cheap-flight-e7d4f');
    expect(firebaseConfig.authDomain).toContain('cheap-flight-e7d4f');
    expect(firebaseConfig.storageBucket).toContain('cheap-flight-e7d4f');
    expect(firebaseConfig.appId).toBe('1:205939117683:web:3f3336048b9e36a8726406');
    expect(firebaseConfig.measurementId).toBe('G-PK6QHV23C7');
    expect(firebaseConfig.apiKey).toBeTruthy();
  });

  it('initializes Firebase App, Firestore, and Auth singletons', () => {
    expect(app).toBeDefined();
    expect(app.name).toBe('[DEFAULT]');
    expect(db).toBeDefined();
    expect(auth).toBeDefined();
  });

  it('safely handles client-side event logging in Node/SSR environment without crashing', async () => {
    // In Node (non-browser), logFirebaseEvent should gracefully no-op without error
    await expect(
      logFirebaseEvent('test_event', { key: 'value' })
    ).resolves.not.toThrow();
  });
});
