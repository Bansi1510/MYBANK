import React from "react";
import Navbar from "../shared/Navbar";
import Hero from "../Home/Hero";
import Features from "../Home/Features";
import Services from "../Home/Services";
import Stats from "../Home/Stats";
import Footer from "../shared/Footer";


const Home: React.FC = () => {

   return <>
      <Navbar />
      <Hero />
      <Features />
      <Services />
      <Stats />
      <Footer />
   </>
};

export default Home;