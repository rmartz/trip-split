import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { NAV_COPY } from "./Navbar.copy";
import { NavbarView } from "./NavbarView";

describe("NavbarView", () => {
  it("renders the app name", () => {
    render(
      <NavbarView
        userEmail={undefined}
        onSignOut={vi.fn()}
        isSigningOut={false}
      />,
    );

    expect(screen.getByText(NAV_COPY.appName)).toBeDefined();
  });

  it("shows sign in and sign up links when signed out", () => {
    render(
      <NavbarView
        userEmail={undefined}
        onSignOut={vi.fn()}
        isSigningOut={false}
      />,
    );

    expect(screen.getByText(NAV_COPY.signIn)).toBeDefined();
    expect(screen.getByText(NAV_COPY.signUp)).toBeDefined();
    expect(screen.queryByText(NAV_COPY.signOut)).toBeNull();
  });

  it("shows user email and sign out button when signed in", () => {
    render(
      <NavbarView
        userEmail="user@example.com"
        onSignOut={vi.fn()}
        isSigningOut={false}
      />,
    );

    expect(screen.getByText("user@example.com")).toBeDefined();
    expect(screen.getByText(NAV_COPY.signOut)).toBeDefined();
    expect(screen.queryByText(NAV_COPY.signIn)).toBeNull();
  });

  it("shows dashboard link when signed in", () => {
    render(
      <NavbarView
        userEmail="user@example.com"
        onSignOut={vi.fn()}
        isSigningOut={false}
      />,
    );

    expect(screen.getByText(NAV_COPY.dashboard)).toBeDefined();
  });

  it("does not show dashboard link when signed out", () => {
    render(
      <NavbarView
        userEmail={undefined}
        onSignOut={vi.fn()}
        isSigningOut={false}
      />,
    );

    expect(screen.queryByText(NAV_COPY.dashboard)).toBeNull();
  });

  it("disables sign out button when signing out", () => {
    render(
      <NavbarView
        userEmail="user@example.com"
        onSignOut={vi.fn()}
        isSigningOut={true}
      />,
    );

    const button = screen.getByText(NAV_COPY.signOut).closest("button");
    expect(button).toBeDefined();
    expect(button!.disabled).toBe(true);
  });
});
