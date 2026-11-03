"use client";

import { useId, useState, type ReactNode } from "react";
import type { Cause } from "@/lib/contract";
import { filterCauses } from "./filter";

export function Directory({ causes, children }: { causes: Cause[]; children: (cause: Cause) => ReactNode }) {
  const id = useId();
  const [query, setQuery] = useState("");
  const [city, setCity] = useState("");
  const filtered = filterCauses(causes, query, city);
  const cities = [...new Set(causes.map(cause => cause.city))].sort();

  return <>
    <div className="directory-filters">
      <div className="search-field">
        <label htmlFor={`${id}-search`}>Search fundraisers</label>
        <input id={`${id}-search`} type="search" placeholder="Search by cause or organizer" value={query} onChange={e => setQuery(e.target.value)} />
      </div>
      <div>
        <label htmlFor={`${id}-city`}>City</label>
        <select id={`${id}-city`} value={city} onChange={e => setCity(e.target.value)}>
          <option value="">All cities</option>
          {cities.map(value => <option key={value}>{value}</option>)}
        </select>
      </div>
      {(query || city) && <button className="text-link" onClick={() => { setQuery(""); setCity(""); }}>Clear filters</button>}
    </div>
    <p className="result-count" role="status">{filtered.length} {filtered.length === 1 ? "fundraiser" : "fundraisers"}</p>
    {filtered.length ? <ul className="fundraiser-grid">{filtered.map(children)}</ul> :
      <div className="directory-empty"><h2>No fundraisers found</h2><p>Try a different search or city.</p></div>}
  </>;
}
