"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="relative w-full border-b border-white/10">
      <div className="flex h-16 w-full items-center px-6 sm:h-20 sm:px-12">
        <div className="flex h-full items-center gap-3 pr-6 mr-6 border-r border-white/10">
          <Link href="/" aria-label="Blockchain Center home" className="flex items-center">
            <Image
              src="/blockchain-center-logo.svg"
              alt="Blockchain Center"
              width={120}
              height={28}
              priority
            />
          </Link>
        </div>

        <nav className="hidden md:flex items-center justify-center gap-16 text-xs flex-1 uppercase">
          <Link href="/about" className="text-gray-300 hover:text-white transition-colors">About</Link>
          <div className="relative group">
            <Link href="#" className="text-gray-300 hover:text-white transition-colors">Partnerships</Link>
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-3 py-1 bg-black/90 border border-white/20 rounded-lg text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap backdrop-blur">
              Coming Soon
              <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-black/90 border-l border-t border-white/20 rotate-45"></div>
            </div>
          </div>
          <Link href="/academy" className="text-gray-300 hover:text-white transition-colors">Academy</Link>
			<Link href="/news" className="text-gray-300 hover:text-white transition-colors">News</Link>
			<Link href="/events" className="text-gray-300 hover:text-white transition-colors">Events</Link>
			<div className="relative group">
				<Link href="#" className="text-gray-300 hover:text-white transition-colors">the network</Link>
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-3 py-1 bg-black/90 border border-white/20 rounded-lg text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap backdrop-blur">
              Coming Soon
              <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-black/90 border-l border-t border-white/20 rotate-45"></div>
            </div>
          </div>
			<Link href="/contact" className="text-gray-300 hover:text-white transition-colors">Contact</Link>
        </nav>

        <div className="ml-auto flex h-full items-center gap-2 pl-6 border-l border-white/10">
          <Link
            href="#"
            className="hidden md:inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm text-white hover:border-white/20 hover:bg-white/5 transition-colors"
          >
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-white/10 text-xs font-medium">BC</span>
            <span>Account</span>
          </Link>

          <button
            type="button"
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((v) => !v)}
            className="inline-flex items-center justify-center rounded-md p-2 text-gray-300 hover:text-white hover:bg-white/5 transition-colors md:hidden"
          >
            {mobileOpen ? (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden absolute left-0 right-0 top-full z-50 border-t border-white/10 bg-black/90 backdrop-blur">
          <div className="px-6 py-4">
            <nav className="flex flex-col gap-2 text-sm uppercase">
              <Link href="/about" className="block rounded-md px-2 py-2 text-gray-200 hover:bg-white/5">About</Link>
              <Link href="#" className="block rounded-md px-2 py-2 text-gray-200 hover:bg-white/5">Model</Link>
              <div className="relative group">
                <Link href="#" className="block rounded-md px-2 py-2 text-gray-200 hover:bg-white/5">Partnerships</Link>
                <div className="absolute left-full top-1/2 transform -translate-y-1/2 ml-2 px-3 py-1 bg-black/90 border border-white/20 rounded-lg text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap backdrop-blur">
                  Coming Soon
                  <div className="absolute -left-1 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-black/90 border-b border-l border-white/20 rotate-45"></div>
                </div>
              </div>
              <Link href="/academy" className="block rounded-md px-2 py-2 text-gray-200 hover:bg-white/5">Academy</Link>
				<Link href="/news" className="block rounded-md px-2 py-2 text-gray-200 hover:bg-white/5">News</Link>
				<Link href="/events" className="block rounded-md px-2 py-2 text-gray-200 hover:bg-white/5">Events</Link>
				<div className="relative group">
					<Link href="#" className="block rounded-md px-2 py-2 text-gray-200 hover:bg-white/5">the network</Link>
					<div className="absolute left-full top-1/2 transform -translate-y-1/2 ml-2 px-3 py-1 bg-black/90 border border-white/20 rounded-lg text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap backdrop-blur">
						Coming Soon
						<div className="absolute -left-1 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-black/90 border-b border-l border-white/20 rotate-45"></div>
					</div>
				</div>
				<Link href="/contact" className="block rounded-md px-2 py-2 text-gray-200 hover:bg-white/5">Contact</Link>
            </nav>
            <div className="mt-4 border-t border-white/10 pt-4">
              <Link
                href="#"
                className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm text-white hover:border-white/20 hover:bg-white/5"
              >
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-white/10 text-xs font-medium">BC</span>
                <span>Account</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}


