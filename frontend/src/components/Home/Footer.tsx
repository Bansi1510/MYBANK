import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-6 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
        {/* Brand */}
        <div className="text-white text-lg font-semibold">
          MYBANK &copy; {new Date().getFullYear()}
        </div>

        {/* Navigation Links */}
        <nav className="flex space-x-6 text-gray-400 text-sm">
          <a href="#" className="hover:text-yellow-400 transition">About</a>
          <a href="#" className="hover:text-yellow-400 transition">Support</a>
          <a href="#" className="hover:text-yellow-400 transition">Privacy</a>
          <a href="#" className="hover:text-yellow-400 transition">Terms</a>
        </nav>

        {/* Social Icons */}
        <div className="flex space-x-5 text-gray-400">
          <a href="#" aria-label="Facebook" className="hover:text-yellow-400 transition">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M22 12a10 10 0 10-11.6 9.8v-6.9h-2.1v-2.9h2.1v-2.2c0-2.1 1.2-3.3 3.1-3.3.9 0 1.8.2 1.8.2v1.9h-1c-1 0-1.4.7-1.4 1.4v1.9h2.5l-.4 2.9h-2.1v6.9a10 10 0 006.6-9.8z" /></svg>
          </a>
          <a href="#" aria-label="Twitter" className="hover:text-yellow-400 transition">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 19c7.2 0 11.2-6 11.2-11.2 0-.2 0-.4 0-.6A8 8 0 0022 4.7a8.3 8.3 0 01-2.4.7 4.1 4.1 0 001.8-2.3 8.2 8.2 0 01-2.6 1 4.1 4.1 0 00-7 3.7A11.6 11.6 0 013 4.4a4.1 4.1 0 001.2 5.5 4 4 0 01-1.9-.5v.1a4.1 4.1 0 003.3 4 4 4 0 01-1.8.1 4.1 4.1 0 003.8 2.9A8.2 8.2 0 012 17.5 11.5 11.5 0 008 19z" /></svg>
          </a>
          <a href="#" aria-label="LinkedIn" className="hover:text-yellow-400 transition">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M4.98 3.5a2.5 2.5 0 110 5 2.5 2.5 0 010-5zM3 8.98h4v12H3v-12zM9 8.98h3.6v1.6h.1a4 4 0 013.6-2c3.8 0 4.5 2.5 4.5 5.7v6.7H17v-6.3c0-1.5 0-3.4-2.1-3.4s-2.4 1.6-2.4 3.3v6.4H9v-12z" /></svg>
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
