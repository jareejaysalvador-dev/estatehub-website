import { ArrowsOutSimple, Bathtub, Bed } from "@phosphor-icons/react/dist/ssr";
import { formatPhp, type UnitType } from "@/sanity/types";

// Only the unit name is guaranteed - every other cell renders "—" rather
// than a blank, matching the schema's name-required/rest-optional design
// (a price sheet with 20+ floor plans gets filled in incrementally).
export function UnitTypes({ unitTypes }: { unitTypes: UnitType[] }) {
  if (unitTypes.length === 0) return null;

  return (
    <div className="mt-8">
      <h2 className="text-lg font-semibold text-ink">Unit types &amp; floor plans</h2>

      <div className="mt-4 hidden overflow-x-auto md:block">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-hairline text-xs font-medium uppercase tracking-wide text-slate">
              <th scope="col" className="py-2 pr-4">
                Name
              </th>
              <th scope="col" className="py-2 pr-4">
                Beds
              </th>
              <th scope="col" className="py-2 pr-4">
                Baths
              </th>
              <th scope="col" className="py-2 pr-4">
                Floor area
              </th>
              <th scope="col" className="py-2 pr-4">
                Price
              </th>
              <th scope="col" className="py-2">
                Floor plan
              </th>
            </tr>
          </thead>
          <tbody>
            {unitTypes.map((unit) => (
              <tr key={unit.key} className="border-b border-hairline last:border-0">
                <td className="py-3 pr-4 font-medium text-ink">{unit.name}</td>
                <td className="tnum py-3 pr-4 text-ink/85">{unit.beds ?? "—"}</td>
                <td className="tnum py-3 pr-4 text-ink/85">{unit.baths ?? "—"}</td>
                <td className="tnum py-3 pr-4 text-ink/85">
                  {unit.floorAreaSqm !== null ? `${unit.floorAreaSqm} sqm` : "—"}
                </td>
                <td className="tnum py-3 pr-4 text-ink/85">
                  {unit.price !== null ? formatPhp(unit.price) : "—"}
                </td>
                <td className="py-3">
                  {unit.floorPlan ? (
                    <a
                      href={unit.floorPlan.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-deep underline underline-offset-4 hover:text-ink"
                    >
                      View
                      <span className="sr-only"> floor plan for {unit.name} (opens in new tab)</span>
                    </a>
                  ) : (
                    "—"
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ul className="mt-4 flex flex-col gap-3 md:hidden">
        {unitTypes.map((unit) => (
          <li key={unit.key} className="rounded-xl border border-hairline p-4">
            <p className="font-medium text-ink">{unit.name}</p>
            <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-slate">
              {unit.beds !== null && (
                <span className="tnum flex items-center gap-1.5">
                  <Bed size={16} weight="light" aria-hidden="true" />
                  {unit.beds}
                  <span className="sr-only">bedrooms</span>
                </span>
              )}
              {unit.baths !== null && (
                <span className="tnum flex items-center gap-1.5">
                  <Bathtub size={16} weight="light" aria-hidden="true" />
                  {unit.baths}
                  <span className="sr-only">bathrooms</span>
                </span>
              )}
              {unit.floorAreaSqm !== null && (
                <span className="tnum flex items-center gap-1.5">
                  <ArrowsOutSimple size={16} weight="light" aria-hidden="true" />
                  {unit.floorAreaSqm} sqm
                </span>
              )}
            </div>
            {unit.price !== null && (
              <p className="tnum mt-2 text-base font-semibold text-ink">{formatPhp(unit.price)}</p>
            )}
            {unit.floorPlan && (
              <a
                href={unit.floorPlan.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-block text-sm text-emerald-deep underline underline-offset-4 hover:text-ink"
              >
                View floor plan
                <span className="sr-only"> for {unit.name} (opens in new tab)</span>
              </a>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
