import { z } from 'zod';
import { getAirportByCode } from '@/lib/data/airports';

export const flightSearchSchema = z
  .object({
    origin: z
      .string()
      .trim()
      .length(3, 'Origin airport must be a 3-letter IATA code')
      .toUpperCase()
      .refine((code) => Boolean(getAirportByCode(code)), {
        message: 'Origin must be a recognized Indian airport IATA code (e.g. BLR, BOM, DEL)',
      }),
    destination: z
      .string()
      .trim()
      .length(3, 'Destination airport must be a 3-letter IATA code')
      .toUpperCase()
      .refine((code) => Boolean(getAirportByCode(code)), {
        message: 'Destination must be a recognized Indian airport IATA code (e.g. BLR, BOM, DEL)',
      }),
    departureDate: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, 'Departure date must be in YYYY-MM-DD format')
      .refine(
        (dateStr) => {
          const date = new Date(dateStr + 'T00:00:00.000Z');
          const today = new Date();
          today.setUTCHours(0, 0, 0, 0);
          return date >= today;
        },
        {
          message: 'Departure date cannot be in the past',
        }
      ),
    returnDate: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, 'Return date must be in YYYY-MM-DD format')
      .optional()
      .nullable(),
    adults: z.coerce.number().int().min(1, 'At least 1 adult passenger is required').max(9, 'Maximum 9 adults'),
    children: z.coerce.number().int().min(0).max(8).optional().default(0),
    infants: z.coerce.number().int().min(0).max(4).optional().default(0),
    cabinClass: z.enum(['economy', 'premium_economy', 'business', 'first']).default('economy'),
    isStudent: z.coerce.boolean().optional().default(false),
  })
  .refine((data) => data.origin !== data.destination, {
    message: 'Origin and destination airports cannot be the same',
    path: ['destination'],
  })
  .refine(
    (data) => {
      if (!data.returnDate) return true;
      return data.returnDate >= data.departureDate;
    },
    {
      message: 'Return date must be on or after the departure date',
      path: ['returnDate'],
    }
  )
  .refine(
    (data) => {
      const infants = data.infants || 0;
      return infants <= data.adults;
    },
    {
      message: 'Number of infants cannot exceed number of adult passengers',
      path: ['infants'],
    }
  );

export type ValidatedSearchRequest = z.infer<typeof flightSearchSchema>;

export const priceAlertSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  origin: z.string().length(3).toUpperCase(),
  destination: z.string().length(3).toUpperCase(),
  departureDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  targetPrice: z.coerce.number().positive('Target price must be greater than zero'),
  currency: z.string().default('INR'),
});

export type ValidatedPriceAlert = z.infer<typeof priceAlertSchema>;

export const clickTrackSchema = z.object({
  providerCode: z.string().min(1),
  flightNumber: z.string().min(1),
  displayedPrice: z.coerce.number().positive(),
  currency: z.string().default('INR'),
  bookingUrl: z.string().min(1),
  searchId: z.string().optional(),
});

export type ValidatedClickTrack = z.infer<typeof clickTrackSchema>;
