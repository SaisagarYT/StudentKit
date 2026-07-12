import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(value: number, decimals = 2): string {
  return Number(value.toFixed(decimals)).toString();
}

export function formatPercentage(value: number, decimals = 1): string {
  return `${Number(value.toFixed(decimals))}%`;
}
