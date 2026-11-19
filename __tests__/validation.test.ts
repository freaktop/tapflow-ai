import { isValidActionUrl } from "@/lib/validation";

describe("action link url validation", () => {
  it("accepts https url", () => {
    expect(isValidActionUrl("https://example.com/book")).toBe(true);
  });
  it("accepts tel url", () => {
    expect(isValidActionUrl("tel:+15550100")).toBe(true);
  });
  it("accepts mailto url", () => {
    expect(isValidActionUrl("mailto:hello@example.com")).toBe(true);
  });
  it("rejects javascript url", () => {
    expect(isValidActionUrl("javascript:alert(1)")).toBe(false);
  });
  it("rejects invalid url", () => {
    expect(isValidActionUrl("not-a-url")).toBe(false);
  });
});
