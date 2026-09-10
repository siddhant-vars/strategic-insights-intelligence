import { X } from "lucide-react";
import { useFilterOptions } from "@/api/queries";
import { useFilters } from "@/hooks/useFilters";
import { MultiSelect } from "./MultiSelect";
import { FilterKey } from "@/types/insight";

const FILTER_DEFS: { key: FilterKey; label: string }[] = [
  { key: "end_year", label: "End Year" },
  { key: "topic", label: "Topic" },
  { key: "sector", label: "Sector" },
  { key: "region", label: "Region" },
  { key: "pestle", label: "PESTLE" },
  { key: "source", label: "Source" },
  { key: "country", label: "Country" },
  { key: "city", label: "City" },
  { key: "swot", label: "SWOT" },
];

function optionsFor(key: FilterKey, data?: ReturnType<typeof useFilterOptions>["data"]): string[] {
  if (!data) return [];
  switch (key) {
    case "end_year":
      return data.endYears.map(String);
    case "topic":
      return data.topics;
    case "sector":
      return data.sectors;
    case "region":
      return data.regions;
    case "pestle":
      return data.pestles;
    case "source":
      return data.sources;
    case "country":
      return data.countries;
    case "city":
      return data.cities;
    case "swot":
      return data.swots;
    default:
      return [];
  }
}

interface FilterBarProps {
  layout?: "row" | "stack";
}

export function FilterBar({ layout = "row" }: FilterBarProps) {
  const { data: filterOptions, isLoading } = useFilterOptions();
  const { filters, setFilter } = useFilters();

  return (
    <div className={layout === "row" ? "flex flex-wrap items-center gap-2" : "flex flex-col gap-3"}>
      {FILTER_DEFS.map(({ key, label }) => {
        const isSpecial = key === "city" || key === "swot";
        const dataUnavailable =
          isSpecial && filterOptions ? (key === "city" ? !filterOptions.meta.cityAvailable : !filterOptions.meta.swotAvailable) : false;

        const options = optionsFor(key, filterOptions);
        const selected = filters[key] ? filters[key]!.split(",") : [];

        return (
          <div key={key} className={layout === "stack" ? "w-full" : "min-w-[140px]"}>
            {layout === "stack" && <label className="mb-1 block text-xs font-medium text-slate-500 dark:text-slate-400">{label}</label>}
            <MultiSelect
              label={label}
              options={options}
              selected={selected}
              onChange={(vals) => setFilter(key, vals)}
              disabled={isLoading || dataUnavailable}
              disabledReason={
                dataUnavailable
                  ? `No ${label} data available in the source dataset.`
                  : undefined
              }
            />
            {isSpecial && dataUnavailable && layout === "stack" && (
              <p className="mt-1 text-[11px] text-slate-400 dark:text-slate-500">Not present in source data.</p>
            )}
          </div>
        );
      })}
    </div>
  );
}

export function ActiveFilterChips() {
  const { filters, setFilter } = useFilters();

  const chips = FILTER_DEFS.flatMap(({ key, label }) => {
    const value = filters[key];
    if (!value) return [];
    return value.split(",").map((v) => ({ key, label, value: v }));
  });

  if (chips.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {chips.map((chip, i) => (
        <span
          key={`${chip.key}-${chip.value}-${i}`}
          className="inline-flex items-center gap-1 rounded-full bg-brand-50 py-1 pl-2.5 pr-1.5 text-xs font-medium text-brand-700 ring-1 ring-inset ring-brand-600/20 dark:bg-brand-500/10 dark:text-brand-300"
        >
          <span className="text-brand-400 dark:text-brand-500">{chip.label}:</span> {chip.value}
          <button
            onClick={() => {
              const current = filters[chip.key]!.split(",").filter((v) => v !== chip.value);
              setFilter(chip.key, current);
            }}
            className="focus-ring rounded-full p-0.5 hover:bg-brand-100 dark:hover:bg-brand-500/20"
            aria-label={`Remove ${chip.label} ${chip.value}`}
          >
            <X size={11} strokeWidth={2.5} />
          </button>
        </span>
      ))}
    </div>
  );
}
