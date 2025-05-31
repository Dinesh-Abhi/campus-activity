import React from "react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-r from-orange-50 to-white border-t border-orange-200 text-center text-sm text-gray-600 py-4 sticky bottom-0 z-20 shadow-inner">
      <p className="flex items-center justify-center gap-1">
        <span className="text-orange-500"></span>
        <span>
          © {currentYear} <span className="font-semibold">Teleparadigm Networks Pvt. Ltd</span>. All rights reserved.
        </span>
      </p>
    </footer>
  );
};

export default Footer;
