'use client';

import { useState } from 'react';
import { trackToolUsage } from '@/lib/analytics';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { attendanceSchema, type AttendanceFormData } from './attendance.schema';
import { calculateAttendance } from './attendance.calculator';
import { type AttendanceResult } from './attendance.types';
import { AttendanceResultDisplay } from './attendance-result';

export function AttendanceForm() {
  const [result, setResult] = useState<AttendanceResult | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<AttendanceFormData>({
    resolver: zodResolver(attendanceSchema),
    defaultValues: {
      totalClasses: undefined,
      attendedClasses: undefined,
      targetPercentage: 75,
    },
  });

  const watchedValues = watch();
  const hasInput =
    watchedValues.totalClasses !== undefined &&
    watchedValues.attendedClasses !== undefined;

  const onSubmit = (data: AttendanceFormData) => {
    const calcResult = calculateAttendance({
      totalClasses: data.totalClasses,
      attendedClasses: data.attendedClasses,
      targetPercentage: data.targetPercentage,
    });
    setResult(calcResult);
    trackToolUsage('attendance-calculator');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Form */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="p-6 md:p-8 border border-[var(--border-soft)] rounded-2xl bg-[var(--bg-surface)]"
      >
        <div className="space-y-5">
          <FormField
            label="Total Classes"
            error={errors.totalClasses?.message}
            hint="Total number of classes held so far"
          >
            <input
              type="number"
              {...register('totalClasses', { valueAsNumber: true })}
              placeholder="e.g. 60"
              className="form-input"
            />
          </FormField>

          <FormField
            label="Classes Attended"
            error={errors.attendedClasses?.message}
            hint="Number of classes you have attended"
          >
            <input
              type="number"
              {...register('attendedClasses', { valueAsNumber: true })}
              placeholder="e.g. 45"
              className="form-input"
            />
          </FormField>

          <FormField
            label="Target Percentage"
            error={errors.targetPercentage?.message}
            hint="Minimum attendance percentage you want to maintain"
          >
            <div className="relative">
              <input
                type="number"
                {...register('targetPercentage', { valueAsNumber: true })}
                placeholder="e.g. 75"
                className="form-input pr-10"
              />
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-sm text-[var(--text-subtle)]">
                %
              </span>
            </div>
          </FormField>
        </div>

        <button
          type="submit"
          disabled={!hasInput}
          className="mt-6 w-full h-12 flex items-center justify-center gap-2 text-sm font-semibold bg-[var(--accent-dark)] text-[var(--text-inverse)] rounded-xl hover:bg-[var(--accent-dark)]/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        >
          Calculate Attendance
        </button>
      </form>

      {/* Results */}
      <AttendanceResultDisplay result={result} />
    </div>
  );
}

function FormField({
  label,
  error,
  hint,
  children,
}: {
  label: string;
  error?: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-[var(--text-primary)] mb-1.5">
        {label}
      </label>
      {children}
      {error ? (
        <p className="mt-1.5 text-xs text-[var(--color-error)]">{error}</p>
      ) : hint ? (
        <p className="mt-1.5 text-xs text-[var(--text-subtle)]">{hint}</p>
      ) : null}
    </div>
  );
}
