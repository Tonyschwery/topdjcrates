import React from 'react';
import Link from 'next/link';
// We are not using the Next.js Image component, so the import is removed.
import { useRouter } from 'next/router';

const Header = () => {
  'use client'; 
  const router = useRouter();

  const activeClass = 'text-white font-bold';
  const inactiveClass = 'text-gray-400 hover:text-white';

  return (
    <header className="bg-background w-full z-20">
      <nav className="container mx-auto flex flex-col md:flex-row justify-between items-center p-4">
        
        <Link href="/" legacyBehavior>
          <a className="flex items-center gap-3 cursor-pointer mb-4 md:mb-0">
            <img 
              src="/LOGO.png" 
              alt="TOP DJ CRATES Logo" 
              style={{ width: '40px', height: '40px' }}
            />
            <span className="text-2xl font-bold text-white">
              TOP DJ CRATES
            </span>
          </a>
        </Link>
        
        <ul className="flex flex-wrap justify-center items-center gap-4 md:gap-6">
          <li>
            <Link href="/" legacyBehavior>
              <a className={`text-md transition-colors duration-300 ${router.pathname === '/' ? activeClass : inactiveClass}`}>Home</a>
            </Link> {/* Corrected Closing Tag */}
          </li>
          <li>
            <Link href="/music" legacyBehavior>
              <a className={`text-md transition-colors duration-300 ${router.pathname === '/music' ? activeClass : inactiveClass}`}>Music</a>
            </Link> {/* Corrected Closing Tag */}
          </li>
          <li>
            <Link href="/about" legacyBehavior>
              <a className={`text-md transition-colors duration-300 ${router.pathname === '/about' ? activeClass : inactiveClass}`}>About</a>
            </Link> {/* Corrected Closing Tag */}
          </li>
          <li>
            <Link href="/custom-mix" legacyBehavior>
              <a className={`text-md transition-colors duration-300 ${router.pathname === '/custom-mix' ? activeClass : inactiveClass}`}>Custom Mix</a>
            </Link> {/* Corrected Closing Tag */}
          </li>
          <li>
            <Link href="/contact" legacyBehavior>
              <a className={`text-md transition-colors duration-300 ${router.pathname === '/contact' ? activeClass : inactiveClass}`}>Contact</a>
            </Link> {/* Corrected Closing Tag */}
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;