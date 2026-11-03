import type { Cause } from "@/lib/contract";

export function filterCauses(causes: Cause[], query: string, city: string) {
  const search = query.trim().toLocaleLowerCase();
  return causes.filter((cause) =>
    (!city || cause.city === city) &&
    [cause.title, cause.description, cause.ownerName, cause.city].some((text) => text.toLocaleLowerCase().includes(search)),
  );
}
