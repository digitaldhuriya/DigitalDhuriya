export function formatCurrency(value: number | string, currency = 'INR') {
  const amount = typeof value === 'string' ? Number(value) : value;

  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    maximumFractionDigits: 2,
  }).format(Number.isFinite(amount) ? amount : 0);
}

export function formatDate(date: string | Date | undefined) {
  if (!date) {
    return 'N/A';
  }

  return new Date(date).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  });
}

