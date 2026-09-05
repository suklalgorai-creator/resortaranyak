export default function CallButton() {
  return (
    <a
      href="tel:+91XXXXXXXXXX"
      className="fixed bottom-24 md:bottom-28 right-4 md:right-6 z-50 flex items-center justify-center w-12 h-12 md:w-14 md:h-14 bg-green-700 text-white rounded-full shadow-lg hover:bg-green-800 hover:scale-110 transition-all duration-300 group"
      aria-label="Call us"
    >
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-7 h-7">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-2.896-1.596-5.48-4.18-7.076-7.076l1.293-.97c.362-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
      </svg>
      
      {/* Tooltip */}
      <span className="absolute right-full mr-4 bg-gray-800 text-white text-xs px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-md pointer-events-none">
        Call us
        <span className="absolute top-1/2 -right-1 w-2 h-2 bg-gray-800 transform -translate-y-1/2 rotate-45"></span>
      </span>
    </a>
  );
}
