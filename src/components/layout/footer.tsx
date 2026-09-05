import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-green-900 glass-section text-stone-300 pt-16 pb-8">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* Column 1 */}
          <div>
            <h3 className="font-playfair text-2xl font-bold text-white mb-4">Resort Arranyak</h3>
            <p className="mb-4 text-stone-400 text-sm leading-relaxed">
              Experience the untamed beauty of nature with luxury comforts. Your perfect forest getaway awaits.
            </p>
            <address className="not-italic text-sm text-stone-400 leading-relaxed">
              Near Burudih Dam,<br />
              Ghatsila, Jharkhand, India
            </address>
          </div>
          
          {/* Column 2 */}
          <div>
            <h4 className="text-white font-semibold mb-4 uppercase tracking-wider text-sm">Quick Links</h4>
            <ul className="space-y-3">
              {['Home', 'Rooms', 'Gallery', 'About', 'Contact'].map((item) => (
                <li key={item}>
                  <Link 
                    href={item === 'Home' ? '/' : `/${item.toLowerCase()}`}
                    className="text-stone-400 hover:text-white transition-colors text-sm"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Column 3 */}
          <div>
            <h4 className="text-white font-semibold mb-4 uppercase tracking-wider text-sm">Policies</h4>
            <ul className="space-y-3">
              {['Privacy Policy', 'Terms of Service', 'Cancellation Policy'].map((item) => (
                <li key={item}>
                  <Link 
                    href={`/${item.toLowerCase().replace(/\s+/g, '-')}`}
                    className="text-stone-400 hover:text-white transition-colors text-sm"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Column 4 */}
          <div>
            <h4 className="text-white font-semibold mb-4 uppercase tracking-wider text-sm">Contact Info</h4>
            <ul className="space-y-3">
              <li>
                <a href="tel:+91XXXXXXXXXX" className="text-stone-400 hover:text-white transition-colors text-sm flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-2.896-1.596-5.48-4.18-7.076-7.076l1.293-.97c.362-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                  </svg>
                  +91 XXXXX XXXXX
                </a>
              </li>
              <li>
                <a href="mailto:info@resortarranyak.com" className="text-stone-400 hover:text-white transition-colors text-sm flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                  </svg>
                  info@resortarranyak.com
                </a>
              </li>
              <li>
                <a href="https://wa.me/91XXXXXXXXXX" target="_blank" rel="noopener noreferrer" className="text-stone-400 hover:text-white transition-colors text-sm flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z"/>
                  </svg>
                  Chat on WhatsApp
                </a>
              </li>
            </ul>
          </div>
          
        </div>
        
        <div className="border-t border-stone-800 pt-8 mt-8 text-center md:text-left text-stone-500 text-sm flex flex-col md:flex-row justify-between items-center">
          <p>&copy; {currentYear} Resort Arranyak. All rights reserved.</p>
          <p className="mt-2 md:mt-0">Designed & Developed by You</p>
        </div>
      </div>
    </footer>
  );
}
