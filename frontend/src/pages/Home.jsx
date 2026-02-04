import Navbar from "../components/Navbar.jsx";
import Hero from "../components/Hero.jsx";
import Tracks from "../components/Tracks.jsx";
import About from "../components/About.jsx";
import Prizes from "../components/Prizes.jsx";
import SponsorsCommittee from "../components/SponsorsCommittee.jsx";
import AboutCollege from "../components/AboutCollege.jsx";
import Footer from "../components/Footer.jsx";
import EventsSection from "../components/EventsSection";



function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <Tracks />
      <About />
      <Prizes />
      <EventsSection />
      <AboutCollege />
      <SponsorsCommittee />
      <Footer />
    </>
  );
}

export default Home;
