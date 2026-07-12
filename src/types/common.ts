export interface CalculationResult<T> {
  success: true;
  data: T;
}

export interface CalculationError {
  success: false;
  error: string;
}

export type CalculationOutput<T> = CalculationResult<T> | CalculationError;

export interface FAQItem {
  question: string;
  answer: string;
}

export interface BreadcrumbItem {
  label: string;
  href?: string;
}
