import { Nav } from "@/components/landing/Nav";
import { Hero } from "@/components/landing/Hero";
import { SessionWalk } from "@/components/landing/SessionWalk";
import { Footer, Method, Pilot, Pricing, Results, TeachingPath, Trust, WhoFor, WhySoftware, WorksWith } from "@/components/landing/Sections";

export default function Landing() {
  return (
    <div>
      <Nav />
      <Hero />
      <WhySoftware />
      <SessionWalk />
      <Method />
      <Results />
      <WorksWith />
      <TeachingPath />
      <WhoFor />
      <Pricing />
      <Trust />
      <Pilot />
      <Footer />
    </div>
  );
}
