import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { ERROR_BOUNDARY_COPY } from "./ErrorBoundary.copy";
import { ErrorBoundary } from "./ErrorBoundary";

function ThrowingComponent(): never {
  throw new Error("Test error");
}

describe("ErrorBoundary", () => {
  it("renders children when there is no error", () => {
    render(
      <ErrorBoundary>
        <p>child content</p>
      </ErrorBoundary>,
    );

    expect(screen.getByText("child content")).toBeDefined();
  });

  it("renders error UI when a child throws", () => {
    const consoleSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => undefined);

    render(
      <ErrorBoundary>
        <ThrowingComponent />
      </ErrorBoundary>,
    );

    expect(screen.getByText(ERROR_BOUNDARY_COPY.title)).toBeDefined();
    expect(screen.getByText(ERROR_BOUNDARY_COPY.message)).toBeDefined();
    expect(screen.getByText(ERROR_BOUNDARY_COPY.retry)).toBeDefined();

    consoleSpy.mockRestore();
  });
});
