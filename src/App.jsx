// boostsmall — homepage composition.
// Sections are composed in the exact order specified by the Phase 1 brief:
//   Nav → Hero → HowItWorks → FeaturedBusinesses → ForOwners →
//   CategoryGrid → Reviews → Manifesto → Footer
// PaperTexture sits fixed behind everything for a subtle grain overlay.

import PaperTexture from "./components/PaperTexture.jsx";
import Nav from "./components/Nav.jsx";
import Hero from "./components/Hero.jsx";
import HowItWorks from "./components/HowItWorks.jsx";
import FeaturedBusinesses from "./components/FeaturedBusinesses.jsx";
import ForOwners from "./components/ForOwners.jsx";
import CategoryGrid from "./components/CategoryGrid.jsx";
import Reviews from "./components/Reviews.jsx";
import Manifesto from "./components/Manifesto.jsx";
import Footer from "./components/Footer.jsx";

export default function App() {
  return (
    <div className="relative bg-cream text-ink min-h-screen">
      <PaperTexture />
      <div className="relative z-10">
        <Nav />
        <main>
          <Hero />
          <HowItWorks />
          <FeaturedBusinesses />
          <ForOwners />
          <CategoryGrid />
          <Reviews />
          <Manifesto />
        </main>
        <Footer />
      </div>
    </div>
  );
}
