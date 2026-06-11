import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

const Contact: React.FC = () => {
  const [form, setForm] = useState({ name: '', phone: '', email: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.message) {
      toast.error('Please fill in all required fields');
      return;
    }
    setLoading(true);
    try {
      await supabase.from('contact_messages').insert([{
        name: form.name,
        phone: form.phone,
        email: form.email || null,
        message: form.message,
      }]);
      toast.success('Message sent! We\'ll respond on WhatsApp soon.');
      setForm({ name: '', phone: '', email: '', message: '' });
    } catch (err) {
      toast.error('Failed to send message. Please call us directly.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-24 relative overflow-hidden" style={{ background: '#1B4332' }}>
      <div className="absolute inset-0" style={{
        background: 'radial-gradient(ellipse at 50% 0%, rgba(201,168,76,0.15) 0%, transparent 60%)',
        pointerEvents: 'none',
      }} />

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        {/* CTA Banner */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="rounded-3xl p-10 md:p-14 text-center mb-16 shadow-2xl"
          style={{ 
            background: 'linear-gradient(135deg, rgba(201,168,76,0.12) 0%, rgba(13,43,31,0.95) 50%, rgba(8,27,19,0.98) 100%)', 
            border: '1px solid rgba(201,168,76,0.3)' 
          }}
        >
          <h2 className="section-heading text-4xl md:text-5xl text-white font-syne font-bold mb-4">
            Ready for a <span className="text-[#C9A84C]">Sparkling Home?</span>
          </h2>
          <p className="text-white/80 font-dm text-lg mb-8 max-w-xl mx-auto">
            Book now or contact us directly. We're available every day from 7 AM to 8 PM.
          </p>
        </motion.div>

        {/* Contact Form & Info Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start mt-12">
          
          {/* Contact Info Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col gap-6"
          >
            {/* Phone Card */}
            <a href="tel:9392420643" className="bg-[#0D2B1F]/60 border border-white/15 p-6 rounded-2xl flex items-center gap-6 group hover:border-[#C9A84C]/50 hover:bg-[#0D2B1F]/80 transition-all">
              <div className="w-14 h-14 rounded-full bg-[#C9A84C]/20 flex items-center justify-center text-[#C9A84C] group-hover:scale-110 group-hover:bg-[#C9A84C]/30 transition-all">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                </svg>
              </div>
              <div>
                <h4 className="text-white/60 font-dm text-sm mb-1 uppercase tracking-wider">Phone</h4>
                <p className="text-white font-syne text-xl font-bold group-hover:text-[#C9A84C] transition-colors">+91 9392420643</p>
              </div>
            </a>

            {/* WhatsApp Card */}
            <a href="https://wa.me/919392420643?text=Hi%20SuciHome%2C%20I%20want%20to%20book%20a%20service" target="_blank" rel="noopener noreferrer" className="bg-[#0D2B1F]/60 border border-white/15 p-6 rounded-2xl flex items-center gap-6 group hover:border-[#25D366]/50 hover:bg-[#0D2B1F]/80 transition-all">
              <div className="w-14 h-14 rounded-full bg-[#25D366]/20 flex items-center justify-center text-[#25D366] group-hover:scale-110 group-hover:bg-[#25D366]/30 transition-all">
                <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
              </div>
              <div>
                <h4 className="text-white/60 font-dm text-sm mb-1 uppercase tracking-wider">WhatsApp</h4>
                <p className="text-white font-syne text-xl font-bold group-hover:text-[#25D366] transition-colors">Chat with us</p>
              </div>
            </a>

            {/* Email Card */}
            <a href="mailto:Welcome@vrcpvtltd.com" className="bg-[#0D2B1F]/60 border border-white/15 p-6 rounded-2xl flex items-center gap-6 group hover:border-[#C9A84C]/50 hover:bg-[#0D2B1F]/80 transition-all">
              <div className="w-14 h-14 rounded-full bg-[#C9A84C]/20 flex items-center justify-center text-[#C9A84C] group-hover:scale-110 group-hover:bg-[#C9A84C]/30 transition-all">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                </svg>
              </div>
              <div>
                <h4 className="text-white/60 font-dm text-sm mb-1 uppercase tracking-wider">Email</h4>
                <p className="text-white font-syne text-lg md:text-xl font-bold group-hover:text-[#C9A84C] transition-colors truncate">Welcome@vrcpvtltd.com</p>
              </div>
            </a>

            {/* Working Hours Card */}
            <div className="bg-[#0D2B1F]/60 border border-white/15 p-6 rounded-2xl flex items-center gap-6">
              <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center text-white/80">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h4 className="text-white/60 font-dm text-sm mb-1 uppercase tracking-wider">Working Hours</h4>
                <p className="text-white font-syne text-xl font-bold">Everyday: <span className="text-white/80 font-normal text-base">7 AM - 8 PM</span></p>
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-[#0D2B1F]/80 border border-white/15 p-8 md:p-10 rounded-3xl shadow-xl"
          >
            <h3 className="font-syne font-bold text-3xl text-white mb-4">Send Us a Message</h3>
            <p className="text-white/80 font-dm mb-8">
              Fill out the form and we'll get back to you on WhatsApp within minutes.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/80 text-xs font-dm mb-1.5">Full Name *</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    placeholder="Your full name"
                    className="w-full bg-white text-[#2D4A35] border border-[#EDE8DC] rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#C9A84C] placeholder-[#5C6B5E]/60 font-dm transition-all shadow-inner"
                    required
                  />
                </div>
                <div>
                  <label className="block text-white/80 text-xs font-dm mb-1.5">Phone *</label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={e => setForm({ ...form, phone: e.target.value })}
                    placeholder="10-digit mobile number"
                    className="w-full bg-white text-[#2D4A35] border border-[#EDE8DC] rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#C9A84C] placeholder-[#5C6B5E]/60 font-dm transition-all shadow-inner"
                    required
                    pattern="[0-9]{10}"
                  />
                </div>
              </div>
              <div>
                <label className="block text-white/80 text-xs font-dm mb-1.5">Email (Optional)</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  placeholder="your@email.com"
                  className="w-full bg-white text-[#2D4A35] border border-[#EDE8DC] rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#C9A84C] placeholder-[#5C6B5E]/60 font-dm transition-all shadow-inner"
                />
              </div>
              <div>
                <label className="block text-white/80 text-xs font-dm mb-1.5">Message *</label>
                <textarea
                  value={form.message}
                  onChange={e => setForm({ ...form, message: e.target.value })}
                  placeholder="Tell us what you need..."
                  className="w-full bg-white text-[#2D4A35] border border-[#EDE8DC] rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#C9A84C] placeholder-[#5C6B5E]/60 font-dm transition-all shadow-inner min-h-[120px] resize-y"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 flex items-center justify-center gap-2 rounded-xl bg-[#C9A84C] text-[#0D2B1F] hover:bg-[#B8963D] hover:shadow-lg font-bold font-dm transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {loading ? (
                  <><div className="w-4 h-4 border-2 border-[#0D2B1F] border-t-transparent rounded-full animate-spin"></div>Sending...</>
                ) : (
                  <><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/></svg>Send Message</>
                )}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
