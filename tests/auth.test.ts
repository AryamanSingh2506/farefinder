import { describe, it, expect } from 'vitest';
import { userProfileSchema, emailPasswordAuthSchema } from '@/types/auth';

describe('Authentication & Profile Validation Suite', () => {
  describe('userProfileSchema', () => {
    it('successfully validates a complete and correct user profile with all mandatory fields', () => {
      const validProfile = {
        firstName: 'Rahul',
        middleName: 'Kumar',
        lastName: 'Sharma',
        mobileNumber: '9876543210',
        dateOfBirth: '1998-05-24',
        gender: 'male',
      };

      const result = userProfileSchema.safeParse(validProfile);
      expect(result.success).toBe(true);
    });

    it('accepts optional empty middle name', () => {
      const validProfile = {
        firstName: 'Ananya',
        middleName: '',
        lastName: 'Iyer',
        mobileNumber: '+919876543210',
        dateOfBirth: '2001-10-12',
        gender: 'female',
      };

      const result = userProfileSchema.safeParse(validProfile);
      expect(result.success).toBe(true);
    });

    it('rejects missing or empty first name (*)', () => {
      const invalidProfile = {
        firstName: '',
        lastName: 'Patel',
        mobileNumber: '9876543210',
        dateOfBirth: '1995-02-14',
        gender: 'male',
      };

      const result = userProfileSchema.safeParse(invalidProfile);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.path).toContain('firstName');
      }
    });

    it('rejects missing or empty last name (*)', () => {
      const invalidProfile = {
        firstName: 'Vikram',
        lastName: '   ',
        mobileNumber: '9876543210',
        dateOfBirth: '1992-07-20',
        gender: 'male',
      };

      const result = userProfileSchema.safeParse(invalidProfile);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.path).toContain('lastName');
      }
    });

    it('enforces valid 10-digit Indian mobile number format (*)', () => {
      // Valid Indian numbers
      expect(
        userProfileSchema.safeParse({
          firstName: 'Amit',
          lastName: 'Verma',
          mobileNumber: '9876543210',
          dateOfBirth: '1990-01-01',
          gender: 'male',
        }).success
      ).toBe(true);

      expect(
        userProfileSchema.safeParse({
          firstName: 'Amit',
          lastName: 'Verma',
          mobileNumber: '+918876543210',
          dateOfBirth: '1990-01-01',
          gender: 'male',
        }).success
      ).toBe(true);

      // Invalid: too short, starts with 1, letters
      expect(
        userProfileSchema.safeParse({
          firstName: 'Amit',
          lastName: 'Verma',
          mobileNumber: '12345',
          dateOfBirth: '1990-01-01',
          gender: 'male',
        }).success
      ).toBe(false);

      expect(
        userProfileSchema.safeParse({
          firstName: 'Amit',
          lastName: 'Verma',
          mobileNumber: '1876543210',
          dateOfBirth: '1990-01-01',
          gender: 'male',
        }).success
      ).toBe(false);
    });

    it('validates date of birth and rejects future or invalid dates (*)', () => {
      // Future date
      const futureDate = new Date(Date.now() + 1000 * 60 * 60 * 24 * 365)
        .toISOString()
        .split('T')[0];

      expect(
        userProfileSchema.safeParse({
          firstName: 'Pooja',
          lastName: 'Mehta',
          mobileNumber: '9876543210',
          dateOfBirth: futureDate,
          gender: 'female',
        }).success
      ).toBe(false);

      // Invalid gibberish date
      expect(
        userProfileSchema.safeParse({
          firstName: 'Pooja',
          lastName: 'Mehta',
          mobileNumber: '9876543210',
          dateOfBirth: 'not-a-date',
          gender: 'female',
        }).success
      ).toBe(false);
    });

    it('enforces gender dropdown options: male, female, or other (*)', () => {
      const base = {
        firstName: 'Sam',
        lastName: 'Dsouza',
        mobileNumber: '9876543210',
        dateOfBirth: '1996-08-15',
      };

      expect(userProfileSchema.safeParse({ ...base, gender: 'male' }).success).toBe(true);
      expect(userProfileSchema.safeParse({ ...base, gender: 'female' }).success).toBe(true);
      expect(userProfileSchema.safeParse({ ...base, gender: 'other' }).success).toBe(true);
      expect(userProfileSchema.safeParse({ ...base, gender: 'unknown' }).success).toBe(false);
    });
  });

  describe('emailPasswordAuthSchema', () => {
    it('validates standard email and minimum 6-character password', () => {
      expect(
        emailPasswordAuthSchema.safeParse({
          email: 'traveler@farefinder.in',
          password: 'securepassword123',
        }).success
      ).toBe(true);

      // Short password
      expect(
        emailPasswordAuthSchema.safeParse({
          email: 'traveler@farefinder.in',
          password: '123',
        }).success
      ).toBe(false);

      // Invalid email
      expect(
        emailPasswordAuthSchema.safeParse({
          email: 'not-an-email',
          password: 'securepassword123',
        }).success
      ).toBe(false);
    });
  });
});
