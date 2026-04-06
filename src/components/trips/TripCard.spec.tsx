import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { TRIP_CARD_COPY } from "./TripCard.copy";
import { TripCard } from "./TripCard";

describe("TripCard", () => {
  it("renders the trip name", () => {
    render(<TripCard id="trip-1" name="Beach Trip" />);

    expect(screen.getByText("Beach Trip")).toBeDefined();
  });

  it("renders the description when provided", () => {
    render(<TripCard id="trip-1" name="Beach Trip" description="Fun times" />);

    expect(screen.getByText("Fun times")).toBeDefined();
  });

  it("does not render description when not provided", () => {
    render(<TripCard id="trip-1" name="Beach Trip" />);

    expect(screen.queryByText("Fun times")).toBeNull();
  });

  it("renders member count when provided", () => {
    render(<TripCard id="trip-1" name="Beach Trip" memberCount={3} />);

    expect(screen.getByText(TRIP_CARD_COPY.memberCount(3))).toBeDefined();
  });

  it("renders singular member count", () => {
    render(<TripCard id="trip-1" name="Beach Trip" memberCount={1} />);

    expect(screen.getByText(TRIP_CARD_COPY.memberCount(1))).toBeDefined();
  });

  it("does not render member count when not provided", () => {
    render(<TripCard id="trip-1" name="Beach Trip" />);

    expect(screen.queryByText(/member/)).toBeNull();
  });

  it("links to the trip detail page", () => {
    render(<TripCard id="trip-1" name="Beach Trip" />);

    const link = screen.getByRole("link");
    expect(link.getAttribute("href")).toBe("/trips/trip-1");
  });
});
