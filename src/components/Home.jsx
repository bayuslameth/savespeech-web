import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Hero from "../components/Hero";
import HowItWorks from "../components/HowItWorks";
import Features from "../components/Features";
import SecurityNote from "../components/SecurityNote";
import Footer from "../components/Footer";

export default function Home() {
  const { hash } = useLocation();

  // Mendukung perpindahan anchor dari halaman "/analisis" kembali ke section tertentu di "/"
  useEffect(() => {
    if (hash) {
      const id = hash.replace("#", "");
      const element = document.getElementById(id);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth" });
        }, 80);
      }
    }
  }, [hash]);

  return (
    <div className="min-h-screen flex flex-col bg-[#05060f] text-slate-100">
      <main className="flex-grow">
        <Hero />
        <HowItWorks />
        <Features />
        <SecurityNote />
      </main>
      <Footer />
    </div>
  );
}