import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HomeSection from "@/components/home/HomeSection";
import GiftListSection from "@/components/gift-list/GiftListSection";
import RsvpSection from "@/components/rsvp/RsvpSection";
import GallerySection from "@/components/gallery/GallerySection";

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <HomeSection />
        <RsvpSection />
        <GiftListSection />
        <GallerySection />
      </main>
      <Footer />
    </>
  );
}
