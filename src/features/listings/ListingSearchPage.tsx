import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { Alert } from "../../components/ui/Alert";
import { Button } from "../../components/ui/Button";
import { Spinner } from "../../components/ui/Spinner";
import { EmptyState } from "../../components/EmptyState";
import type { ListingSearchFilters } from "../../types/domain";
import { getErrorMessage } from "../../api/errors";
import { FilterPanel } from "./components/FilterPanel";
import { PropertyCard } from "./components/PropertyCard";
import { filtersFromSearchParams, filtersToSearchParams } from "./filter-url";
import { searchListings } from "./api";

export const ListingSearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const filters = useMemo(() => filtersFromSearchParams(searchParams), [searchParams]);

  const listingsQuery = useQuery({
    queryKey: ["listings", filters],
    queryFn: () => searchListings(filters),
  });

  const applyFilters = (nextFilters: ListingSearchFilters) => {
    setSearchParams(filtersToSearchParams(nextFilters));
  };

  const changePage = (page: number) => {
    applyFilters({ ...filters, page });
  };

  const items = listingsQuery.data?.items ?? [];
  const totalPages = listingsQuery.data?.totalPages;
  const canGoNext = totalPages ? filters.page < totalPages : items.length >= filters.pageSize;

  return (
    <div className="mx-auto grid w-full max-w-7xl gap-6 px-4 py-8">
      <section className="grid gap-2">
        <p className="text-sm font-semibold uppercase text-emerald-700">Property marketplace</p>
        <div className="flex flex-col justify-between gap-3 md:flex-row md:items-end">
          <div>
            <h1 className="text-3xl font-bold text-stone-950 md:text-4xl">Browse available properties</h1>
            <p className="mt-2 max-w-2xl text-stone-600">Search real listings by location, price, bedrooms, and property type.</p>
          </div>
          <div className="rounded-md bg-amber-100 px-3 py-2 text-sm font-semibold text-amber-900">
            Page {filters.page}
            {totalPages ? ` of ${totalPages}` : ""}
          </div>
        </div>
      </section>

      <FilterPanel filters={filters} onApply={applyFilters} />

      {listingsQuery.isLoading ? <Spinner className="min-h-56 rounded-md border border-stone-200 bg-white" label="Loading properties" /> : null}

      {listingsQuery.isError ? <Alert tone="error" message={getErrorMessage(listingsQuery.error)} /> : null}

      {!listingsQuery.isLoading && !listingsQuery.isError && items.length === 0 ? (
        <EmptyState title="No properties found" message="Try adjusting the city, price, bedroom count, or keyword filters." />
      ) : null}

      {items.length ? (
        <>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {items.map((listing) => (
              <PropertyCard key={listing.id} listing={listing} />
            ))}
          </div>

          <div className="flex items-center justify-between rounded-md border border-stone-200 bg-white p-3">
            <Button variant="secondary" disabled={filters.page <= 1} onClick={() => changePage(filters.page - 1)}>
              <ChevronLeft className="h-4 w-4" aria-hidden="true" />
              Previous
            </Button>
            <span className="text-sm font-medium text-stone-600">{items.length} listings shown</span>
            <Button variant="secondary" disabled={!canGoNext} onClick={() => changePage(filters.page + 1)}>
              Next
              <ChevronRight className="h-4 w-4" aria-hidden="true" />
            </Button>
          </div>
        </>
      ) : null}
    </div>
  );
};
