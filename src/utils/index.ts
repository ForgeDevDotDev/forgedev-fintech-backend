// Utility functions

export function paginate<T>(items: T[], page: number, limit: number): T[] {
  const start = (page - 1) * limit;
  return items.slice(start, start + limit);
}

export function formatError(message: string, code?: string) {
  return { error: message, code: code || 'UNKNOWN' };
}

// FIXME: This validation is too basic
export function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 15);
}

// Convert cents to euros for display
export function centsToEuros(cents: number): number {
  return cents / 100;
}

// Convert euros to cents for storage
export function eurosToCents(euros: number): number {
  return Math.round(euros * 100);
}

// Format cents as a Spanish euro string
export function formatCents(cents: number): string {
  const euros = centsToEuros(cents);
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
  }).format(euros);
}

// Validate that an amount is a positive integer (cents)
export function validateAmount(amount: number): boolean {
  return Number.isInteger(amount) && amount > 0;
}

// Generate a fake IBAN for testing
// TODO: Use a proper IBAN checksum
export function generateIban(): string {
  const part = () => Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `ES${Math.floor(Math.random() * 90 + 10)} 2100 0418 4021 ${part()} ${part()} ${part()}`;
}
