import Hero from '@/components/home/hero';
import Introduction from '@/components/home/introduction';
import FeaturedRooms from '@/components/home/featured-rooms';
import AmenitiesPreview from '@/components/home/amenities-preview';
import GalleryPreview from '@/components/home/gallery-preview';
import Testimonials from '@/components/home/testimonials';
import Attractions from '@/components/home/attractions';
import CtaSection from '@/components/home/cta-section';
import LocationMap from '@/components/home/location-map';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col w-full">
      <Hero />
      <Introduction />
      <FeaturedRooms />
      <AmenitiesPreview />
      <GalleryPreview />
      <Testimonials />
      <Attractions />
      <LocationMap />
      <CtaSection />
    </main>
  );
}
