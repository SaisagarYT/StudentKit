'use client';

import * as React from 'react';
import { Check, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SelectContextType {
  open: boolean;
  setOpen: (open: boolean | ((prev: boolean) => boolean)) => void;
  value: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
  selectedLabel: React.ReactNode;
  registerItem: (val: string, label: React.ReactNode) => void;
  unregisterItem: (val: string) => void;
  contentId: string;
}

const SelectContext = React.createContext<SelectContextType | null>(null);

export interface SelectProps {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
  children: React.ReactNode;
}

export function Select({
  value: controlledValue,
  defaultValue = '',
  onValueChange,
  disabled = false,
  children,
}: SelectProps) {
  const [uncontrolledValue, setUncontrolledValue] = React.useState(defaultValue);
  const [open, setOpen] = React.useState(false);
  const [itemLabels, setItemLabels] = React.useState<Map<string, React.ReactNode>>(new Map());
  const containerRef = React.useRef<HTMLDivElement>(null);
  const contentId = React.useId();

  const isControlled = controlledValue !== undefined;
  const currentValue = isControlled ? controlledValue : uncontrolledValue;

  const handleValueChange = React.useCallback(
    (newValue: string) => {
      if (!isControlled) {
        setUncontrolledValue(newValue);
      }
      onValueChange?.(newValue);
    },
    [isControlled, onValueChange]
  );

  const registerItem = React.useCallback((val: string, label: React.ReactNode) => {
    setItemLabels((prev) => {
      const next = new Map(prev);
      next.set(val, label);
      return next;
    });
  }, []);

  const unregisterItem = React.useCallback((val: string) => {
    setItemLabels((prev) => {
      const next = new Map(prev);
      next.delete(val);
      return next;
    });
  }, []);

  // Close when clicking outside or pressing Escape
  React.useEffect(() => {
    if (!open) return;

    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open]);

  const selectedLabel = itemLabels.get(currentValue) || null;

  return (
    <SelectContext.Provider
      value={{
        open,
        setOpen,
        value: currentValue,
        onValueChange: handleValueChange,
        disabled,
        selectedLabel,
        registerItem,
        unregisterItem,
        contentId,
      }}
    >
      <div ref={containerRef} className="relative inline-block w-full">
        {children}
      </div>
    </SelectContext.Provider>
  );
}

export interface SelectTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  children?: React.ReactNode;
}

export const SelectTrigger = React.forwardRef<HTMLButtonElement, SelectTriggerProps>(
  ({ className, children, ...props }, ref) => {
    const context = React.useContext(SelectContext);
    if (!context) throw new Error('SelectTrigger must be used within a Select');

    const { open, setOpen, disabled, contentId } = context;

    return (
      <button
        ref={ref}
        type="button"
        role="combobox"
        aria-controls={contentId}
        aria-expanded={open}
        disabled={disabled || props.disabled}
        onClick={() => setOpen((prev) => !prev)}
        className={cn(
          'flex h-9 w-full items-center justify-between gap-2 rounded-sm border border-[var(--border-default)] bg-[var(--bg-surface)] px-3 py-1.5 text-xs text-[var(--text-primary)] shadow-2xs transition-all',
          'hover:border-[var(--border-strong)] hover:bg-[var(--bg-subtle)]/30',
          'focus:outline-none focus:ring-1 focus:ring-[var(--accent-dark)] focus:border-[var(--accent-dark)]',
          'disabled:cursor-not-allowed disabled:opacity-50',
          className
        )}
        {...props}
      >
        <div className="flex items-center gap-2 truncate text-left w-full">{children}</div>
        <ChevronDown
          className={cn(
            'w-3.5 h-3.5 shrink-0 text-[var(--text-subtle)] transition-transform duration-200',
            open && 'rotate-180 text-[var(--text-primary)]'
          )}
        />
      </button>
    );
  }
);
SelectTrigger.displayName = 'SelectTrigger';

export interface SelectValueProps {
  placeholder?: string;
  className?: string;
}

export function SelectValue({ placeholder = 'Select an option...', className }: SelectValueProps) {
  const context = React.useContext(SelectContext);
  if (!context) throw new Error('SelectValue must be used within a Select');

  const { value, selectedLabel } = context;

  if (value && selectedLabel !== null && selectedLabel !== undefined) {
    return <span className={cn('truncate text-xs font-medium', className)}>{selectedLabel}</span>;
  }

  return (
    <span className={cn('truncate text-xs text-[var(--text-subtle)] select-none', className)}>
      {placeholder}
    </span>
  );
}

export interface SelectContentProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  children: React.ReactNode;
}

export function SelectContent({ className, children, ...props }: SelectContentProps) {
  const context = React.useContext(SelectContext);
  if (!context) throw new Error('SelectContent must be used within a Select');

  if (!context.open) return null;

  return (
    <div
      id={context.contentId}
      role="listbox"
      className={cn(
        'absolute left-0 right-0 z-50 mt-1 min-w-[8rem] overflow-hidden rounded-sm border border-[var(--border-soft)] bg-[var(--bg-surface)] p-1 text-[var(--text-primary)] shadow-lg animate-in fade-in-0 zoom-in-95',
        'max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-[var(--border-default)] scrollbar-track-transparent',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export interface SelectItemProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
  disabled?: boolean;
  className?: string;
  children: React.ReactNode;
}

export function SelectItem({ value, disabled = false, className, children, ...props }: SelectItemProps) {
  const context = React.useContext(SelectContext);
  if (!context) throw new Error('SelectItem must be used within a Select');

  const { value: selectedValue, onValueChange, setOpen, registerItem, unregisterItem } = context;
  const isSelected = selectedValue === value;

  React.useEffect(() => {
    registerItem(value, children);
    return () => unregisterItem(value);
  }, [value, children, registerItem, unregisterItem]);

  return (
    <div
      role="option"
      aria-selected={isSelected}
      data-disabled={disabled ? '' : undefined}
      onClick={() => {
        if (disabled) return;
        onValueChange?.(value);
        setOpen(false);
      }}
      className={cn(
        'relative flex w-full cursor-pointer select-none items-center rounded-xs py-1.5 pl-7 pr-2 text-xs outline-none transition-colors',
        'hover:bg-[var(--bg-subtle)] hover:text-[var(--text-primary)]',
        isSelected && 'bg-[var(--bg-subtle)]/70 font-semibold text-[var(--text-primary)]',
        disabled && 'pointer-events-none opacity-40 cursor-not-allowed',
        className
      )}
      {...props}
    >
      {isSelected && (
        <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
          <Check className="w-3.5 h-3.5 text-[var(--accent-dark)]" />
        </span>
      )}
      <span className="truncate">{children}</span>
    </div>
  );
}

export interface SelectLabelProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  children: React.ReactNode;
}

export function SelectLabel({ className, children, ...props }: SelectLabelProps) {
  return (
    <div
      className={cn('py-1 pl-7 pr-2 text-[10px] font-bold uppercase tracking-wider text-[var(--text-subtle)]', className)}
      {...props}
    >
      {children}
    </div>
  );
}

export interface SelectSeparatorProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export function SelectSeparator({ className, ...props }: SelectSeparatorProps) {
  return <div className={cn('-mx-1 my-1 h-px bg-[var(--border-soft)]', className)} {...props} />;
}

export interface SelectGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  children: React.ReactNode;
}

export function SelectGroup({ className, children, ...props }: SelectGroupProps) {
  return (
    <div className={cn('p-0.5', className)} {...props}>
      {children}
    </div>
  );
}

/**
 * Convenient Drop-in Dropdown Component
 */
export interface CustomSelectOption {
  value: string;
  label: React.ReactNode;
  disabled?: boolean;
}

export interface CustomSelectProps {
  value?: string;
  defaultValue?: string;
  onValueChange?: (val: string) => void;
  options: CustomSelectOption[];
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  triggerClassName?: string;
  contentClassName?: string;
}

export function CustomSelect({
  value,
  defaultValue,
  onValueChange,
  options,
  placeholder = 'Select...',
  disabled = false,
  className,
  triggerClassName,
  contentClassName,
}: CustomSelectProps) {
  return (
    <div className={cn('w-full', className)}>
      <Select value={value} defaultValue={defaultValue} onValueChange={onValueChange} disabled={disabled}>
        <SelectTrigger className={triggerClassName}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent className={contentClassName}>
          {options.map((opt) => (
            <SelectItem key={opt.value} value={opt.value} disabled={opt.disabled}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

