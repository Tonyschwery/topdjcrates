import React from 'react';
import Link from 'next/link';

const Footer = () => {
  return (
    // Updated background to bg-text to match the header's Dark Charcoal color.
    // Adjusted the top border color for a subtle separation.
    <footer className="bg-text py-8 text-center text-gray-400 border-t border-gray-700">
      <p className="text-md mb-4">&copy; {new Date().getFullYear()} TOP DJ CRATES. All rights reserved.</p>
      <div className="flex justify-center gap-6 mt-2">
        <Link href="/blog" legacyBehavior>
          <a className="text-sm text-gray-400 hover:text-white transition-colors duration-300">Blog</a>
        </Link>
      </div>
    </footer>
  );
};

export default Footer;