export function formatCurrency(
  cents: number,
  currency = "USD",
  locale = "en-US",
): string {
  return new Intl.NumberFormat(locale, {
    currency,
    style: "currency",
  }).format(cents / 100);
}
