import { FormEvent, useEffect, useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import { Select } from "../../../components/ui/Select";
import { bedroomOptions, defaultListingFilters, pageSizeOptions, priceRangePresets, propertyTypeOptions } from "../../../config/filters";
import type { ListingSearchFilters } from "../../../types/domain";

interface FilterPanelProps {
  filters: ListingSearchFilters;
  onApply: (filters: ListingSearchFilters) => void;
}

export const FilterPanel = ({ filters, onApply }: FilterPanelProps) => {
  const [draft, setDraft] = useState(filters);
  const [pricePreset, setPricePreset] = useState("");

  useEffect(() => {
    setDraft(filters);
  }, [filters]);

  const update = <Key extends keyof ListingSearchFilters>(key: Key, value: ListingSearchFilters[Key]) => {
    setDraft((current) => ({ ...current, [key]: value }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onApply({ ...draft, page: 1 });
  };

  const handleReset = () => {
    setPricePreset("");
    onApply(defaultListingFilters);
  };

  const handlePricePreset = (value: string) => {
    setPricePreset(value);
    const selected = priceRangePresets.find((item) => item.label === value);
    if (selected) {
      setDraft((current) => ({
        ...current,
        minPrice: selected.minPrice,
        maxPrice: selected.maxPrice,
      }));
    }
  };

  return (
    <form className="rounded-md border border-stone-200 bg-white p-4 shadow-sm" onSubmit={handleSubmit}>
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-emerald-700" aria-hidden="true" />
          <h2 className="text-base font-semibold text-stone-950">Search and filters</h2>
        </div>
        <Button type="button" variant="ghost" onClick={handleReset}>
          <X className="h-4 w-4" aria-hidden="true" />
          Reset
        </Button>
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <Input label="Keyword" placeholder="Apartment, garden, transit" value={draft.q} onChange={(event) => update("q", event.target.value)} />
        <Input label="City" placeholder="Colombo" value={draft.city} onChange={(event) => update("city", event.target.value)} />
        <Input label="Country" placeholder="Sri Lanka" value={draft.country} onChange={(event) => update("country", event.target.value)} />
        <Select
          label="Property type"
          value={draft.propertyType}
          onChange={(event) => update("propertyType", event.target.value)}
          options={[{ label: "Any type", value: "" }, ...propertyTypeOptions.map((type) => ({ label: type, value: type }))]}
        />
        <Select
          label="Price range"
          value={pricePreset}
          onChange={(event) => handlePricePreset(event.target.value)}
          options={priceRangePresets.map((preset) => ({ label: preset.label, value: preset.label }))}
        />
        <Input label="Minimum price" inputMode="numeric" value={draft.minPrice} onChange={(event) => update("minPrice", event.target.value)} />
        <Input label="Maximum price" inputMode="numeric" value={draft.maxPrice} onChange={(event) => update("maxPrice", event.target.value)} />
        <Select
          label="Bedrooms"
          value={draft.bedrooms}
          onChange={(event) => update("bedrooms", event.target.value)}
          options={[{ label: "Any bedrooms", value: "" }, ...bedroomOptions.map((bedroom) => ({ label: `${bedroom} bedrooms`, value: bedroom }))]}
        />
      </div>

      <div className="mt-4 flex flex-wrap items-end justify-between gap-3">
        <Select
          label="Results per page"
          value={draft.pageSize}
          onChange={(event) => update("pageSize", Number(event.target.value))}
          options={pageSizeOptions.map((size) => ({ label: `${size} listings`, value: size }))}
          className="w-40"
        />
        <Button type="submit">
          <Search className="h-4 w-4" aria-hidden="true" />
          Search listings
        </Button>
      </div>
    </form>
  );
};
