import React from 'react';

const Footer = () => {
  return (
    <footer className="flex justify-between items-center py-5 px-8 bg-black text-white shadow-md">

      <div className="flex items-center">

        <div className="mr-4">

          <img
            src="/src/assets/HOME TRACK LOGO1.png"
            alt="Home Track Logo"
            width="100"
            height="100"
          />

        </div>
      </div>

      {/* Information Section */}
      <div className="mb-6 md:mb-0">
        <h2 className="text-lg font-medium mb-4">INFORMATION</h2>
        <ul>
          <li className="mb-2">
            <a href="/about" className="hover:text-gray-300 transition duration-300">ABOUT US</a>
          </li>
          <li>
            <a href="/privacy" className="hover:text-gray-300 transition duration-300">PRIVACY POLICY</a>
          </li>
        </ul>
      </div>

      {/* Contact Section */}
      <div>
        <h2 className="text-lg font-medium mb-4">CONTACT US</h2>
        <div className="flex space-x-4">
          {/* Facebook */}
          <a href="https://facebook.com" aria-label="Facebook" className="hover:opacity-80 transition duration-300">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18.48 4H5.52A1.52 1.52 0 0 0 4 5.52v12.96A1.52 1.52 0 0 0 5.52 20h6.96v-5.63h-1.9v-2.2h1.9V10.3c0-1.9 1.16-2.93 2.86-2.93.82 0 1.5.06 1.7.08v1.98h-1.15c-.91 0-1.1.43-1.1 1.07v1.4h2.17l-.28 2.2h-1.9V20h3.7a1.52 1.52 0 0 0 1.52-1.52V5.52A1.52 1.52 0 0 0 18.48 4z" />
            </svg>
          </a>
          {/* X/Twitter */}
          <a href="https://twitter.com" aria-label="Twitter" className="hover:opacity-80 transition duration-300">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
            </svg>
          </a>
          {/* Instagram */}
          <a href="https://instagram.com" aria-label="Instagram" className="hover:opacity-80 transition duration-300">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 4.622c2.403 0 2.688.009 3.637.052.877.04 1.354.187 1.67.31.42.163.72.358 1.036.673.315.315.51.615.673 1.035.123.317.27.794.31 1.671.043.95.052 1.234.052 3.637s-.009 2.688-.052 3.637c-.04.877-.187 1.354-.31 1.671-.163.42-.358.72-.673 1.035-.315.315-.615.51-1.035.673-.317.123-.794.27-1.671.31-.95.043-1.234.052-3.637.052s-2.688-.009-3.637-.052c-.877-.04-1.354-.187-1.67-.31-.42-.163-.72-.358-1.036-.673-.315-.315-.51-.615-.673-1.035-.123-.317-.27-.794-.31-1.671-.043-.95-.052-1.234-.052-3.637s.009-2.688.052-3.637c.04-.877.187-1.354.31-1.67.163-.42.358-.72.673-1.036.315-.315.615-.51 1.035-.673.317-.123.794-.27 1.671-.31.95-.043 1.234-.052 3.637-.052m0-1.622c-2.442 0-2.75.01-3.71.054-.958.044-1.612.196-2.187.419-.592.23-1.094.537-1.594 1.038-.5.5-.807 1.002-1.038 1.594-.223.576-.375 1.23-.418 2.186-.044.96-.055 1.268-.055 3.71s.01 2.75.054 3.71c.044.959.196 1.612.419 2.187.23.592.537 1.094 1.038 1.594.5.5 1.002.807 1.594 1.038.576.223 1.23.375 2.186.418.96.044 1.268.055 3.71.055s2.75-.01 3.71-.055c.958-.043 1.612-.195 2.187-.418.592-.23 1.094-.537 1.594-1.038.5-.5.807-1.002 1.038-1.594.223-.575.375-1.229.418-2.187.044-.96.055-1.268.055-3.71s-.01-2.75-.055-3.71c-.043-.958-.195-1.612-.418-2.186-.23-.592-.537-1.094-1.038-1.594-.5-.5-1.002-.807-1.594-1.038-.575-.223-1.229-.375-2.187-.419-.96-.044-1.268-.054-3.71-.054z" />
              <path d="M12 7.378c-2.552 0-4.622 2.07-4.622 4.622s2.07 4.622 4.622 4.622 4.622-2.07 4.622-4.622S14.552 7.378 12 7.378zm0 7.622c-1.657 0-3-1.343-3-3s1.343-3 3-3 3 1.343 3 3-1.343 3-3 3z" />
              <circle cx="16.804" cy="7.196" r="1.075" />
            </svg>
          </a>
          {/* LinkedIn */}
          <a href="https://linkedin.com" aria-label="LinkedIn" className="hover:opacity-80 transition duration-300">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
            </svg>
          </a>
          {/* YouTube */}
          <a href="https://youtube.com" aria-label="YouTube" className="hover:opacity-80 transition duration-300">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0C.488 3.45.029 5.804 0 12c.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0C23.512 20.55 23.971 18.196 24 12c-.029-6.185-.484-8.549-4.385-8.816zM9 16V8l8 3.993L9 16z" />
            </svg>
          </a>
        </div>
      </div>
    </footer >
  );
};

export default Footer;