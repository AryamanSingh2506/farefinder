import { z } from 'zod';

export type Gender = 'male' | 'female' | 'other';

export interface UserProfile {
  uid: string;
  email: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  mobileNumber: string;
  dateOfBirth: string; // Stored as YYYY-MM-DD or DD/MM/YYYY
  gender: Gender;
  photoURL?: string;
  isProfileComplete: boolean;
  createdAt: string;
  updatedAt: string;
}

export type AuthModalMode = 'signin' | 'signup' | 'onboarding' | 'forgot_password';

// Validation schema for profile onboarding & editing
export const userProfileSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(1, 'First name is required')
    .max(50, 'First name must be under 50 characters')
    .regex(/^[a-zA-Z\s'-]+$/, 'First name should only contain letters'),
  middleName: z
    .string()
    .trim()
    .max(50, 'Middle name must be under 50 characters')
    .optional()
    .or(z.literal('')),
  lastName: z
    .string()
    .trim()
    .min(1, 'Last name is required')
    .max(50, 'Last name must be under 50 characters')
    .regex(/^[a-zA-Z\s'-]+$/, 'Last name should only contain letters'),
  mobileNumber: z
    .string()
    .trim()
    .min(1, 'Mobile number is required')
    .regex(
      /^(?:\+91|91)?[6-9]\d{9}$/,
      'Please enter a valid 10-digit Indian mobile number starting with 6-9'
    ),
  dateOfBirth: z
    .string()
    .trim()
    .min(1, 'Date of birth is required')
    .refine((dob) => {
      // Validate date format (YYYY-MM-DD or DD/MM/YYYY)
      const date = new Date(dob.includes('/') ? dob.split('/').reverse().join('-') : dob);
      if (isNaN(date.getTime())) return false;
      const ageInMs = Date.now() - date.getTime();
      const ageInYears = ageInMs / (1000 * 60 * 60 * 24 * 365.25);
      return ageInYears >= 0 && ageInYears <= 120;
    }, 'Please enter a valid date of birth'),
  gender: z.enum(['male', 'female', 'other'], {
    error: 'Please select a gender',
  }),
});

export type UserProfileFormData = z.infer<typeof userProfileSchema>;

export const emailPasswordAuthSchema = z.object({
  email: z.string().trim().email('Please enter a valid email address'),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters long')
    .max(100, 'Password is too long'),
});
