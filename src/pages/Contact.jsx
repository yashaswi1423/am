import React, { useState } from 'react';
import emailjs from '@emailjs/browser';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    // EmailJS credentials
    const serviceId = 'service_glf585p';
    const templateId = 'template_ideddtd';
    const publicKey = 'g0FagqI_oJKBsprMA';

    const templateParams = {
      from_name: formData.name,
      from_email: formData.email,
      message: formData.message,
      to_name: 'AM Fashions',
    };

    emailjs.send(serviceId, templateId, templateParams, publicKey)
      .then((response) => {
        console.log('SUCCESS!', response.status, response.text);
        setSubmitStatus('success');
        setFormData({ name: '', email: '', message: '' });
        setIsSubmitting(false);
      })
      .catch((error) => {
        console.error('FAILED...', error);
        setSubmitStatus('error');
        setIsSubmitting(false);
      });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen pt-20 px-6 py-16 overflow-x-hidden">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-5xl font-bold text-accent text-center mb-4 animate-fade-in-up">
          Get In Touch
        </h1>
        <p className="text-center text-gray-600 mb-16 animate-fade-in-up stagger-1">
          We'd love to hear from you. Send us a message!
        </p>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="animate-slide-right">
            <div className="bg-accent rounded-3xl p-8 shadow-2xl hover-glow transform transition-all duration-500">
              <h2 className="text-2xl font-semibold text-white mb-6">Send us a message</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-gray-200 text-sm font-medium mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-2xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all"
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <label className="block text-gray-200 text-sm font-medium mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-2xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all"
                    placeholder="your@email.com"
                  />
                </div>

                <div>
                  <label className="block text-gray-200 text-sm font-medium mb-2">
                    Message
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows="5"
                    className="w-full px-4 py-3 rounded-2xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all resize-none"
                    placeholder="Your message..."
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-white text-accent py-3 rounded-2xl font-semibold hover:bg-gray-100 transition-all duration-500 hover:shadow-xl active:scale-95 transform hover:-translate-y-1 relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="relative z-10">
                    {isSubmitting ? 'Sending...' : 'Submit'}
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-200 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                </button>
              </form>

              {/* Success/Error Messages */}
              {submitStatus === 'success' && (
                <div className="mt-4 p-4 bg-green-500/20 border border-green-500/50 rounded-2xl text-white animate-fade-in">
                  <p className="font-semibold">✓ Message sent successfully!</p>
                  <p className="text-sm text-gray-200">We'll get back to you soon.</p>
                </div>
              )}
              {submitStatus === 'error' && (
                <div className="mt-4 p-4 bg-red-500/20 border border-red-500/50 rounded-2xl text-white animate-fade-in">
                  <p className="font-semibold">✗ Failed to send message</p>
                  <p className="text-sm text-gray-200">Please try again or contact us directly.</p>
                </div>
              )}
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-8 animate-slide-left">
            <div className="bg-card rounded-3xl p-8 shadow-lg hover-glow transform transition-all duration-500">
              <h2 className="text-2xl font-semibold text-accent mb-6">Contact Information</h2>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4 group transform transition-all duration-500 hover:translate-x-2">
                  <div className="w-12 h-12 bg-accent rounded-2xl flex items-center justify-center flex-shrink-0 transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 group-hover:shadow-lg">
                    <svg className="w-6 h-6 text-white transition-transform duration-500 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1 transition-colors duration-300 group-hover:text-accent">Email</h3>
                    <p className="text-gray-600 transition-colors duration-300 group-hover:text-gray-900">madasumiteesh@gmail.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 group transform transition-all duration-500 hover:translate-x-2">
                  <div className="w-12 h-12 bg-accent rounded-2xl flex items-center justify-center flex-shrink-0 transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 group-hover:shadow-lg">
                    <svg className="w-6 h-6 text-white transition-transform duration-500 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1 transition-colors duration-300 group-hover:text-accent">Location</h3>
                    <p className="text-gray-600 transition-colors duration-300 group-hover:text-gray-900">Anantapur, Andhra Pradesh 515001</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-card rounded-3xl p-8 shadow-lg hover-glow transform transition-all duration-500">
              <h2 className="text-2xl font-semibold text-accent mb-6">Follow Us</h2>
              <div className="flex gap-4">
                <a
                  href="https://www.instagram.com/am_fashions.official?igsh=MWU5a3F2eXprYW8ybQ=="
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-14 h-14 bg-accent rounded-2xl flex items-center justify-center hover:bg-gray-800 transition-all duration-500 hover:shadow-2xl hover:scale-125 hover:rotate-12 group relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <svg className="w-7 h-7 text-white relative z-10 transition-transform duration-500 group-hover:scale-110" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
              </div>
            </div>

            <div className="bg-card rounded-3xl p-8 shadow-lg hover-glow transform transition-all duration-500">
              <h2 className="text-2xl font-semibold text-accent mb-6">Chat with Us</h2>
              <a
                href="https://wa.me/919100911697"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 bg-[#25D366] text-white px-6 py-4 rounded-2xl hover:bg-[#20BA5A] transition-all duration-500 hover:shadow-2xl hover:scale-105 group"
              >
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center transition-transform duration-500 group-hover:scale-110 group-hover:rotate-12">
                  <svg className="w-7 h-7 text-[#25D366]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-lg">WhatsApp</p>
                  <p className="text-sm text-white/90">+91 91009 11697</p>
                </div>
                <svg className="w-6 h-6 transition-transform duration-500 group-hover:translate-x-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
