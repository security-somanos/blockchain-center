"use client";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="w-full border-t border-white/10 bg-[#090909]">
      {/* Desktop Layout */}
      <div className="hidden md:block">
        {/* First Row */}
        <div className="flex border-b border-white/10">
          {/* Left spacer */}
          <div className="flex-1 border-r border-white/10"></div>
          
          {/* LinkedIn */}
          <div className="flex items-center justify-center px-6 py-4 border-r border-white/10 min-w-[80px]">
            <a 
              href="#" 
              className="text-white font-bold text-lg hover:text-white/70 transition-colors"
              aria-label="LinkedIn"
            >
              in
            </a>
          </div>
          
          {/* YouTube */}
          <div className="flex items-center justify-center px-6 py-4 border-r border-white/10 min-w-[80px]">
            <a 
              href="#" 
              className="text-white hover:text-white/70 transition-colors"
              aria-label="YouTube"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
            </a>
          </div>
          
          {/* Aesthetic textured box */}
          <div className="flex-1 border-r border-white/10 relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <Image
                src="/images/noise.png"
                alt=""
                fill
                className="object-cover"
              />
            </div>
          </div>
          
          {/* Compliance */}
          <div className="flex items-center justify-center px-6 py-4 border-r border-white/10 min-w-[120px]">
            <a href="#" className="text-white hover:text-white/70 transition-colors text-sm">
              Compliance
            </a>
          </div>
          
          {/* Press */}
          <div className="flex items-center justify-center px-6 py-4 border-r border-white/10 min-w-[100px]">
            <a href="#" className="text-white hover:text-white/70 transition-colors text-sm">
              Press
            </a>
          </div>
          
          {/* R&D */}
          <div className="flex items-center justify-center px-6 py-4 border-r border-white/10 min-w-[100px]">
            <a href="#" className="text-white hover:text-white/70 transition-colors text-sm">
              R&D
            </a>
          </div>
          
          {/* Right spacer */}
          <div className="flex-1"></div>
        </div>

        {/* Second Row */}
        <div className="flex border-b border-white/10">
          {/* Left spacer */}
          <div className="flex-1 border-r border-white/10"></div>
          
          {/* Whistleblower */}
          <div className="flex items-center justify-center px-6 py-4 border-r border-white/10 min-w-[140px]">
            <a href="#" className="text-white hover:text-white/70 transition-colors text-sm">
              Whistleblower
            </a>
          </div>
          
          {/* Legal Notice */}
          <div className="flex items-center justify-center px-6 py-4 border-r border-white/10 min-w-[140px]">
            <a href="#" className="text-white hover:text-white/70 transition-colors text-sm">
              Legal Notice
            </a>
          </div>
          
          {/* General Terms */}
          <div className="flex items-center justify-center px-6 py-4 border-r border-white/10 min-w-[140px]">
            <a href="#" className="text-white hover:text-white/70 transition-colors text-sm">
              General Terms
            </a>
          </div>
          
          {/* Certifications */}
          <div className="flex items-center justify-center px-6 py-4 border-r border-white/10 min-w-[140px]">
            <a href="#" className="text-white hover:text-white/70 transition-colors text-sm">
              Certifications
            </a>
          </div>
          
          {/* Right spacer */}
          <div className="flex-1"></div>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="md:hidden">
        {/* Social Media Row */}
        <div className="flex border-b border-white/10">
          <div className="flex items-center justify-center px-4 py-3 border-r border-white/10 flex-1">
            <a 
              href="#" 
              className="text-white font-bold text-lg hover:text-white/70 transition-colors"
              aria-label="LinkedIn"
            >
              in
            </a>
          </div>
          <div className="flex items-center justify-center px-4 py-3 flex-1">
            <a 
              href="#" 
              className="text-white hover:text-white/70 transition-colors"
              aria-label="YouTube"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
            </a>
          </div>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-2 border-b border-white/10">
          <div className="flex items-center justify-center px-4 py-3 border-r border-b border-white/10">
            <a href="#" className="text-white hover:text-white/70 transition-colors text-sm">
              Compliance
            </a>
          </div>
          <div className="flex items-center justify-center px-4 py-3 border-b border-white/10">
            <a href="#" className="text-white hover:text-white/70 transition-colors text-sm">
              Press
            </a>
          </div>
          <div className="flex items-center justify-center px-4 py-3 border-r border-b border-white/10">
            <a href="#" className="text-white hover:text-white/70 transition-colors text-sm">
              R&D
            </a>
          </div>
          <div className="flex items-center justify-center px-4 py-3 border-b border-white/10">
            <a href="#" className="text-white hover:text-white/70 transition-colors text-sm">
              Whistleblower
            </a>
          </div>
          <div className="flex items-center justify-center px-4 py-3 border-r border-white/10">
            <a href="#" className="text-white hover:text-white/70 transition-colors text-sm">
              Legal Notice
            </a>
          </div>
          <div className="flex items-center justify-center px-4 py-3">
            <a href="#" className="text-white hover:text-white/70 transition-colors text-sm">
              General Terms
            </a>
          </div>
        </div>
      </div>

      {/* Copyright Section */}
      <div className="px-6 py-4 text-center md:text-right">
        <div className="text-white text-sm">
          <div>Blockchain Center ©2025 All rights reserved</div>
          <div className="text-white/60 text-xs mt-1">Tailor-made by Blockchain Center</div>
        </div>
      </div>
    </footer>
  );
}
