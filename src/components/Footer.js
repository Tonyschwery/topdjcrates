import React from 'react';

const Footer = () => {
  return (
    // Updated background to bg-text to match the header's Dark Charcoal color.
    // Adjusted the top border color for a subtle separation.
    <footer className="bg-text py-8 text-center text-gray-400 border-t border-gray-700">
      <p className="text-md mb-4">&copy; {new Date().getFullYear()} TOP DJ CRATES. All rights reserved.</p>
    </footer>
  );
};

export default Footer;