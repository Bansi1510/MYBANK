import React, { useEffect } from "react";
import Navbar from "../shared/Navbar";
import Hero from "../Home/Hero";
import Features from "../Home/Features";
import Services from "../Home/Services";
import Stats from "../Home/Stats";
import Footer from "../shared/Footer";
import Cookies from "js-cookie";
import { getProfileAPI } from "../services/user.service";
import { useDispatch } from "react-redux";
import { clearAuth, setAuth } from "../redux/slices/authSlice";

const Home: React.FC = () => {
   const token = Cookies.get("access_token");
   console.log(token);
   const dispatch = useDispatch();
   useEffect(() => {
      const fetchData = async () => {
         if (token) {
            const profile = await getProfileAPI();
            if (profile) dispatch(setAuth(profile));
         } else {
            dispatch(clearAuth());
         }
      }
      fetchData();
   }, []);
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