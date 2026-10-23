'use client';

import { siteConfig } from '@/config/site';
import { MapPin, Phone, Mail, MessageCircle, Send } from 'lucide-react';
import { motion } from 'framer-motion';
import { SectionHeader } from '@/components/ui/section-header';
import { Card } from '@/components/ui/card';
import { Input, Textarea } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useState } from 'react';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [submitting, setSubmitting] = useState(false);

  const handleSend = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    try {
      const response = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const result = await response.json() as { success: boolean; error?: string };
      if (!response.ok || !result.success) throw new Error(result.error || 'Unable to send message');
      setForm({ name: '', email: '', phone: '', message: '' });
      toast.success('Message sent! We will get back to you soon.');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unable to send message');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Header */}
      <section className="bg-forest text-white py-16 sm:py-20 px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <SectionHeader 
            title="Contact Us" 
            subtitle="We'd love to hear from you"
          />
        </motion.div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-12 sm:py-16">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 mb-12 md:mb-16">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-serif text-heading mb-8">Get in Touch</h2>
            
            <div className="space-y-6">
              <Card className="p-4 flex items-start glass-card">
                <div className="w-12 h-12 bg-gold/10 text-gold rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-heading text-lg mb-1">Address</h3>
                  <p className="text-bodytext">{siteConfig.address}</p>
                </div>
              </Card>

              <Card className="p-4 flex items-start glass-card">
                <div className="w-12 h-12 bg-gold/10 text-gold rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-heading text-lg mb-1">Phone</h3>
                  <p className="text-bodytext">{siteConfig.links.phone}</p>
                </div>
              </Card>

              <Card className="p-4 flex items-start glass-card">
                <div className="w-12 h-12 bg-gold/10 text-gold rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-heading text-lg mb-1">Email</h3>
                  <p className="text-bodytext">{siteConfig.links.email}</p>
                </div>
              </Card>

              <Card className="p-4 flex items-start glass-card">
                <div className="w-12 h-12 bg-gold/10 text-gold rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                  <MessageCircle className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-heading text-lg mb-1">WhatsApp</h3>
                  <a href={siteConfig.links.whatsapp} target="_blank" rel="noopener noreferrer" className="text-forest hover:text-gold transition-colors">
                    Chat with us
                  </a>
                </div>
              </Card>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <Card className="p-5 sm:p-8 glass-card">
              <h3 className="text-xl sm:text-2xl font-serif text-heading mb-6">Send us a Message</h3>
              <form className="space-y-4" onSubmit={handleSend}>
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-heading mb-1">Name</label>
                  <Input 
                    type="text" 
                    id="name" 
                    placeholder="Your Name"
                    maxLength={100}
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="glass-input"
                  />
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-heading mb-1">Email</label>
                    <Input
                      type="email" 
                      id="email" 
                      placeholder="your@email.com"
                      maxLength={254}
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="glass-input"
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-heading mb-1">Phone</label>
                    <Input 
                      type="tel" 
                    id="phone"
                    placeholder="Your Phone Number"
                    maxLength={30}
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="glass-input"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-heading mb-1">Message</label>
                  <Textarea 
                    id="message" 
                    rows={4}
                    placeholder="How can we help you?"
                    maxLength={3000}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="glass-input resize-none"
                  />
                </div>

                <Button 
                  type="submit"
                  variant="primary"
                  className="w-full"
                  isLoading={submitting}
                >
                  <Send className="w-4 h-4 mr-2" />
                  Send Message
                </Button>
              </form>
            </Card>
          </motion.div>
        </div>

        {/* Google Map */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="w-full h-[300px] sm:h-[400px] rounded-2xl overflow-hidden glass-card p-1"
        >
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d117565.48512101683!2d86.3762818972656!3d22.581005900000008!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a164b3ef86f2b7f%3A0xc39955ed2e3bf4a9!2sAranyak%20Resort!5e0!3m2!1sen!2sin!4v1709405073123!5m2!1sen!2sin" 
            width="100%" 
            height="100%" 
            style={{ border: 0, borderRadius: '1rem' }} 
            allowFullScreen 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </motion.div>
      </div>
    </div>
  );
}
