import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HomeSection from "@/components/home/HomeSection";
import GiftListSection from "@/components/gift-list/GiftListSection";
import RsvpSection from "@/components/rsvp/RsvpSection";
import GallerySection from "@/components/gallery/GallerySection";
import PartySection from "@/components/party/PartySection";

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <HomeSection />
        <RsvpSection />
        <GiftListSection />
        <GallerySection />
        <PartySection />
      </main>
      <Footer />
    </>
  );
}
