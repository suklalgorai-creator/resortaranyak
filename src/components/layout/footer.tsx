import Link from 'next/link';
import { siteConfig } from '@/config/site';
import { Phone, Mail, MessageCircle, MapPin } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-[#0a1f15] text-stone-300 pt-16 pb-8 relative overflow-hidden">
      {/* Subtle nature pattern overlay */}
      <div className="absolute inset-0 nature-bg pointer-events-none opacity-30" />
      
      <div className="relative z-10 container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* Column 1: Brand */}
          <div>
            <h3 className="font-serif text-2xl font-bold text-white mb-4">Resort Arranyak</h3>
            <p className="mb-4 text-stone-400 text-sm leading-relaxed">
              Experience the untamed beauty of nature with luxury comforts. Your perfect forest getaway awaits in the heart of Jharkhand.
            </p>
            <address className="not-italic text-sm text-stone-400 leading-relaxed flex items-start gap-2">
              <MapPin className="w-4 h-4 mt-0.5 text-gold flex-shrink-0" />
              <span>{siteConfig.address}</span>
            </address>
          </div>
          
          {/* Column 2: Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4 uppercase tracking-wider text-sm">Quick Links</h4>
            <ul className="space-y-3">
              {[
                { label: 'Home', href: '/' },
                { label: 'Rooms', href: '/rooms' },
                { label: 'Gallery', href: '/gallery' },
                { label: 'Amenities', href: '/amenities' },
                { label: 'About', href: '/about' },
                { label: 'Contact', href: '/contact' },
              ].map((item) => (
                <li key={item.label}>
                  <Link 
                    href={item.href}
                    className="text-stone-400 hover:text-gold transition-colors text-sm"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Column 3: Policies */}
          <div>
            <h4 className="text-white font-semibold mb-4 uppercase tracking-wider text-sm">Policies</h4>
            <ul className="space-y-3">
              {[
                { label: 'Privacy Policy', href: '/privacy-policy' },
                { label: 'Terms of Service', href: '/terms' },
                { label: 'Cancellation Policy', href: '/cancellation-policy' },
              ].map((item) => (
                <li key={item.label}>
                  <Link 
                    href={item.href}
                    className="text-stone-400 hover:text-gold transition-colors text-sm"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Column 4: Contact Info */}
          <div>
            <h4 className="text-white font-semibold mb-4 uppercase tracking-wider text-sm">Contact Info</h4>
            <ul className="space-y-4">
              <li>
                <a 
                  href={`tel:${siteConfig.links.phone.split(',')[0].replace(/[^0-9+]/g, '')}`} 
                  className="text-stone-400 hover:text-gold transition-colors text-sm flex items-center gap-3"
                >
                  <Phone className="w-4 h-4 text-gold flex-shrink-0" />
                  {siteConfig.links.phone}
                </a>
              </li>
              <li>
                <a 
                  href={`mailto:${siteConfig.links.email}`} 
                  className="text-stone-400 hover:text-gold transition-colors text-sm flex items-center gap-3"
                >
                  <Mail className="w-4 h-4 text-gold flex-shrink-0" />
                  {siteConfig.links.email}
                </a>
              </li>
              <li>
                <a 
                  href={siteConfig.links.whatsapp} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-stone-400 hover:text-gold transition-colors text-sm flex items-center gap-3"
                >
                  <MessageCircle className="w-4 h-4 text-gold flex-shrink-0" />
                  Chat on WhatsApp
                </a>
              </li>
            </ul>
          </div>
          
        </div>
        
        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-8 mt-8 text-center md:text-left text-stone-500 text-sm flex flex-col md:flex-row justify-between items-center">
          <p>&copy; {currentYear} Resort Arranyak. All rights reserved.</p>
          <p className="mt-2 md:mt-0 text-stone-500">
            Crafted with care for nature lovers
          </p>
        </div>
      </div>
    </footer>
  );
}
