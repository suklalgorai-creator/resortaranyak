import { siteConfig } from "@/config/site";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-green-50/30 dark:bg-[#1E1E1E] text-green-950 dark:text-stone-200">
      <div className="bg-green-900 dark:bg-[#111111] text-white py-20 px-4 text-center">
        <h1 className="text-4xl md:text-6xl font-serif mb-4">Contact Us</h1>
        <p className="text-green-100 max-w-2xl mx-auto text-lg">We&apos;d love to hear from you</p>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-12 mb-16">
          {/* Contact Info */}
          <div>
            <h2 className="text-3xl font-serif text-green-900 dark:text-stone-200 mb-8">Get in Touch</h2>
            
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="w-12 h-12 bg-green-100 dark:bg-stone-800 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                  📍
                </div>
                <div>
                  <h3 className="font-bold text-green-900 dark:text-stone-200 text-lg mb-1">Address</h3>
                  <p className="text-green-800/80 dark:text-stone-300">{siteConfig.address}</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-12 h-12 bg-green-100 dark:bg-stone-800 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                  📞
                </div>
                <div>
                  <h3 className="font-bold text-green-900 dark:text-stone-200 text-lg mb-1">Phone</h3>
                  <p className="text-green-800/80 dark:text-stone-300">{siteConfig.links.phone}</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-12 h-12 bg-green-100 dark:bg-stone-800 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                  ✉️
                </div>
                <div>
                  <h3 className="font-bold text-green-900 dark:text-stone-200 text-lg mb-1">Email</h3>
                  <p className="text-green-800/80 dark:text-stone-300">{siteConfig.links.email}</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-12 h-12 bg-green-100 dark:bg-stone-800 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                  💬
                </div>
                <div>
                  <h3 className="font-bold text-green-900 dark:text-stone-200 text-lg mb-1">WhatsApp</h3>
                  <a href={siteConfig.links.whatsapp} target="_blank" rel="noopener noreferrer" className="text-green-600 dark:text-emerald-400 hover:text-green-800 dark:hover:text-emerald-300 underline">
                    Chat with us
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white dark:bg-stone-900 p-8 rounded-2xl shadow-sm border border-green-100 dark:border-stone-800">
            <h3 className="text-2xl font-serif text-green-900 dark:text-stone-200 mb-6">Send us a Message</h3>
            <form className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-green-800 dark:text-stone-300 mb-1">Name</label>
                <input 
                  type="text" 
                  id="name" 
                  className="w-full px-4 py-3 rounded-lg border border-green-200 dark:border-stone-700 focus:outline-none focus:ring-2 focus:ring-green-500/50 bg-green-50/30 dark:bg-stone-800/50 dark:text-stone-200"
                  placeholder="Your Name"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-green-800 dark:text-stone-300 mb-1">Email</label>
                  <input 
                    type="email" 
                    id="email" 
                    className="w-full px-4 py-3 rounded-lg border border-green-200 dark:border-stone-700 focus:outline-none focus:ring-2 focus:ring-green-500/50 bg-green-50/30 dark:bg-stone-800/50 dark:text-stone-200"
                    placeholder="your@email.com"
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-green-800 dark:text-stone-300 mb-1">Phone</label>
                  <input 
                    type="tel" 
                    id="phone" 
                    className="w-full px-4 py-3 rounded-lg border border-green-200 dark:border-stone-700 focus:outline-none focus:ring-2 focus:ring-green-500/50 bg-green-50/30 dark:bg-stone-800/50 dark:text-stone-200"
                    placeholder="Your Phone Number"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-green-800 dark:text-stone-300 mb-1">Message</label>
                <textarea 
                  id="message" 
                  rows={4}
                  className="w-full px-4 py-3 rounded-lg border border-green-200 dark:border-stone-700 focus:outline-none focus:ring-2 focus:ring-green-500/50 bg-green-50/30 dark:bg-stone-800/50 dark:text-stone-200 resize-none"
                  placeholder="How can we help you?"
                ></textarea>
              </div>

              <button 
                type="button"
                className="w-full bg-green-900 dark:bg-stone-800 text-white font-medium py-3 rounded-lg hover:bg-green-800 dark:hover:bg-stone-700 transition-colors"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>

        {/* Google Map */}
        <div className="w-full h-[400px] rounded-2xl overflow-hidden shadow-sm border border-green-100 dark:border-stone-800">
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d117565.48512101683!2d86.3762818972656!3d22.581005900000008!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a164b3ef86f2b7f%3A0xc39955ed2e3bf4a9!2sAranyak%20Resort!5e0!3m2!1sen!2sin!4v1709405073123!5m2!1sen!2sin" 
            width="100%" 
            height="100%" 
            style={{ border: 0 }} 
            allowFullScreen 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </div>
    </div>
  );
}
