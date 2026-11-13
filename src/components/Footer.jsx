import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#05060f] py-12 text-sm text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex flex-col items-center sm:items-start gap-1.5">
          <div className="flex items-center gap-2">
            <i className="ri-pulse-line text-cyan-400 text-lg" />
            <span className="font-heading font-bold text-white tracking-wider">
              SAVESPEECH
            </span>
          </div>
          <p className="text-xs text-slate-400 text-center sm:text-left">
            Project Final Keamanan Informasi — Defensive AI
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-medium">
          <a href="#beranda" className="hover:text-cyan-400 transition-colors">
            Beranda
          </a>
          <a href="#cara-kerja" className="hover:text-cyan-400 transition-colors">
            Cara Kerja
          </a>
          <a href="#fitur" className="hover:text-cyan-400 transition-colors">
            Fitur
          </a>
          <a href="#keamanan" className="hover:text-cyan-400 transition-colors">
            Keamanan
          </a>
          <Link to="/analisis" className="hover:text-cyan-400 transition-colors">
            Ruang Analisis
          </Link>
        </div>
      </div>
    </footer>
  );
}