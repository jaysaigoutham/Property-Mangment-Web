import { fallbackPropertyImages } from "../../../config/media";
import type { Listing, ListingMedia } from "../../../types/domain";

interface ListingGalleryProps {
  listing: Listing;
  media: ListingMedia[];
}

export const ListingGallery = ({ listing, media }: ListingGalleryProps) => {
  const images = media.length
    ? media.map((item) => ({ id: item.id, url: item.url, alt: item.alt || listing.title }))
    : [{ id: "fallback", url: listing.imageUrl || fallbackPropertyImages[0], alt: listing.title }];

  return (
    <div className="grid gap-3 lg:grid-cols-[1.4fr_0.6fr]">
      <div className="aspect-[16/10] overflow-hidden rounded-md bg-stone-100">
        <img className="h-full w-full object-cover" src={images[0].url} alt={images[0].alt} />
      </div>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-1">
        {(images.length > 1 ? images.slice(1, 3) : fallbackPropertyImages.slice(1, 3).map((url, index) => ({ id: `fallback-${index}`, url, alt: listing.title }))).map((image) => (
          <div className="aspect-[16/10] overflow-hidden rounded-md bg-stone-100" key={image.id}>
            <img className="h-full w-full object-cover" src={image.url} alt={image.alt} />
          </div>
        ))}
      </div>
    </div>
  );
};
