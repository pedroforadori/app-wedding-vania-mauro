import Hero from "./Hero";
import OurStory from "./OurStory";
import StoryPhoto from "./StoryPhoto";

export default function HomeSection() {
  return (
    <section id="home" className="scroll-mt-24">
      <Hero />
      <OurStory />
      <StoryPhoto />
    </section>
  );
}
