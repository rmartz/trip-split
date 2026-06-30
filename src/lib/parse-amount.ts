/**
 * Parses a user-entered dollar string (e.g. "12.50") into an integer cent
 * value. Returns undefined when the input does not match the expected format
 * or represents a non-positive amount.
 */
export function parseAmountCents(raw: string): number | undefined {
  const trimmed = raw.trim();
  const amountRegex = /^\d+(\.\d{1,2})?$/;
  if (!amountRegex.test(trimmed)) {
    return undefined;
  }
  const [intStr, fracStr] = trimmed.split(".") as [string, string | undefined];
  const cents =
    parseInt(intStr, 10) * 100 +
    (fracStr !== undefined ? parseInt(fracStr.padEnd(2, "0"), 10) : 0);
  return cents > 0 ? cents : undefined;
}
