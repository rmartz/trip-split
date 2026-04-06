import { describe, expect, it } from "vitest";

import { formatCurrency } from "./format";

describe("formatCurrency", () => {
  it("formats cents as USD by default", () => {
    expect(formatCurrency(1050)).toBe("$10.50");
  });

  it("formats zero cents", () => {
    expect(formatCurrency(0)).toBe("$0.00");
  });

  it("formats large amounts", () => {
    expect(formatCurrency(123456)).toBe("$1,234.56");
  });

  it("formats single cent", () => {
    expect(formatCurrency(1)).toBe("$0.01");
  });

  it("accepts a different currency", () => {
    expect(formatCurrency(1000, "EUR", "de-DE")).toBe("10,00\u00a0€");
  });
});
