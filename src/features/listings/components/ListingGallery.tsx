import { ImageOff } from "lucide-react";
import { fallbackPropertyImages } from "../../../config/media";
import type { Listing, ListingMedia } from "../../../types/domain";

interface ListingGalleryProps {
  listing: Listing;
  media: ListingMedia[];
  isLoading?: boolean;
  hasError?: boolean;
}

export const ListingGallery = ({ listing, media, isLoading = false, hasError = false }: ListingGalleryProps) => {
  const sortedMedia = [...media].sort((left, right) => (left.sortOrder ?? 0) - (right.sortOrder ?? 0));
  const backendImages = sortedMedia.map((item) => ({ id: item.id, url: item.url, alt: item.alt || listing.title }));
  const fallbackImages = [listing.imageUrl, ...fallbackPropertyImages]
    .filter((url): url is string => Boolean(url))
    .map((url, index) => ({ id: `fallback-${index}`, url, alt: listing.title }));
  const images = backendImages.length ? backendImages : fallbackImages;
  const sideImages = images.length > 1 ? images.slice(1, 3) : fallbackImages.slice(1, 3);

  return (
    <section className="grid gap-3" aria-label="Property images">
      {hasError ? (
        <div className="flex items-center gap-2 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm font-medium text-amber-900">
          <ImageOff className="h-4 w-4 shrink-0" aria-hidden="true" />
          Property images could not be loaded, so placeholder images are shown.
        </div>
      ) : null}

      <div className="grid gap-3 lg:grid-cols-[1.4fr_0.6fr]">
        <div className="aspect-[16/10] overflow-hidden rounded-md bg-stone-100">
          {isLoading ? (
            <div className="h-full w-full animate-pulse bg-stone-200" aria-label="Loading property image" />
          ) : (
            <img className="h-full w-full object-cover" src={images[0].url} alt={images[0].alt} />
          )}
        </div>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-1">
          {sideImages.map((image, index) => (
            <div className="aspect-[16/10] overflow-hidden rounded-md bg-stone-100" key={image.id}>
              {isLoading ? (
                <div className="h-full w-full animate-pulse bg-stone-200" aria-label={`Loading property image ${index + 2}`} />
              ) : (
                <img className="h-full w-full object-cover" src={image.url} alt={image.alt} />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
