import { z } from 'zod';

export const attendanceSchema = z
  .object({
    totalClasses: z
      .number({ message: 'Total classes is required' })
      .int('Must be a whole number')
      .min(1, 'Must be at least 1')
      .max(1000, 'Maximum 1000 classes'),
    attendedClasses: z
      .number({ message: 'Attended classes is required' })
      .int('Must be a whole number')
      .min(0, 'Cannot be negative'),
    targetPercentage: z
      .number({ message: 'Target percentage is required' })
      .min(1, 'Must be at least 1%')
      .max(100, 'Cannot exceed 100%'),
  })
  .refine((data) => data.attendedClasses <= data.totalClasses, {
    message: 'Attended classes cannot exceed total classes',
    path: ['attendedClasses'],
  });

export type AttendanceFormData = z.infer<typeof attendanceSchema>;
