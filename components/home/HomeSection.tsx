import Hero from "./Hero";
import OurStory from "./OurStory";

export default function HomeSection() {
  return (
    <section id="home" className="scroll-mt-24">
      <Hero />
      <OurStory />
    </section>
  );
}
