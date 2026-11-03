import { describe, expect, it } from "vitest";
import { causes } from "../../mocks/p3/fixtures";
import { filterCauses } from "./filter";

describe("fundraiser discovery", () => {
  it("searches titles, organizers and stories without case or surrounding spaces", () => {
    expect(filterCauses(causes, "  PANTRY ", "").map(c => c.id)).toEqual(["c_pantry"]);
    expect(filterCauses(causes, "priya", "").map(c => c.id)).toEqual(["c_library"]);
    expect(filterCauses(causes, "recycling", "").map(c => c.id)).toEqual(["c_park"]);
  });
  it("combines city and search, and restores all results when cleared", () => {
    expect(filterCauses(causes, "library", "Austin")).toEqual([]);
    expect(filterCauses(causes, "", "Austin")).toHaveLength(2);
    expect(filterCauses(causes, "", "")).toEqual(causes);
  });
});
