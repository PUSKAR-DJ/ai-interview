import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import Hero from "../sections/Hero";
import Philosophy from "../sections/Philosophy";
import WhatWeBuild from "../sections/WhatWeBuild";
import Products from "../sections/Products";
import WhyUs from "../sections/WhyUs";
import About from "../sections/About";
import Careers from "../sections/Careers";

export default function Landing() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <Hero />
        <Philosophy />
        <WhatWeBuild />
        <Products />
        <WhyUs />
        <About />
        <Careers />
      </main>
      <Footer />
    </div>
  );
}

