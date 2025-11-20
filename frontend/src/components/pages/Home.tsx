import CallToActionTestimonials from "../Home/CallToActionTestimonials";
import Footer from "../Home/Footer";
import HeroSection from "../Home/HeroSection";
import SecurityTrust from "../Home/SecurityTrust";
import ServicesOverview from "../Home/ServicesOverview";
import Navbar from "../shared/Navbar";

const Home = (): React.JSX.Element => (
   <>
    <Navbar/>
    <HeroSection/>
    <ServicesOverview />
    <SecurityTrust />
    <CallToActionTestimonials />
    <Footer/>
   </>
);


export default Home;