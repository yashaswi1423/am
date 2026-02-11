import React from 'react';

const About = () => {
  return (
    <div className="min-h-screen overflow-x-hidden">
      {/* Founder Hero Section */}
      <div className="relative h-screen w-full overflow-hidden bg-gray-900">
        <div className="absolute inset-0 animate-zoom-in">
          <img
            src="/IMG-20260203-WA0427.jpg.jpeg"
            alt="M Miteesh - Founder of AM_fashions"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/70"></div>
        </div>
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-20 px-6">
          <div className="text-center text-white max-w-3xl animate-fade-in-up">
            <h1 className="text-6xl md:text-7xl font-bold tracking-wide drop-shadow-2xl mb-4">
              M Miteesh
            </h1>
            <p className="text-2xl md:text-3xl font-light drop-shadow-lg mb-2">
              Founder & Visionary
            </p>
            <p className="text-lg md:text-xl text-gray-200 drop-shadow-lg">
              AM_fashions
            </p>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="bg-gradient-to-b from-white to-gray-50 py-20">
        <div className="max-w-6xl mx-auto px-6">
          {/* Brand Story */}
          <div className="mb-20 animate-fade-in-up">
            <h2 className="text-5xl font-bold text-accent text-center mb-6">
              Our Story
            </h2>
            <div className="w-24 h-1 bg-accent mx-auto mb-12"></div>
            <p className="text-xl text-gray-700 leading-relaxed text-center max-w-4xl mx-auto">
              AM_fashions was born from a passion for style and a vision to make fashion accessible to everyone. 
              Founded by M Miteesh, our brand represents more than just clothing—it's a movement that celebrates 
              individuality, quality, and self-expression.
            </p>
          </div>

          {/* Three Column Features */}
          <div className="grid md:grid-cols-3 gap-8 mb-20">
            <div className="bg-white rounded-3xl p-8 shadow-lg hover-glow transform transition-all duration-500 hover:-translate-y-2 animate-fade-in-up">
              <div className="w-16 h-16 bg-accent rounded-2xl flex items-center justify-center mb-6 mx-auto">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-accent text-center mb-4">Quality First</h3>
              <p className="text-gray-600 text-center leading-relaxed">
                Every piece is crafted with premium materials and attention to detail, ensuring durability and comfort that lasts.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-8 shadow-lg hover-glow transform transition-all duration-500 hover:-translate-y-2 animate-fade-in-up stagger-1">
              <div className="w-16 h-16 bg-accent rounded-2xl flex items-center justify-center mb-6 mx-auto">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-accent text-center mb-4">Style Freedom</h3>
              <p className="text-gray-600 text-center leading-relaxed">
                We believe fashion is personal. Choose your own style and express yourself authentically with our diverse collection.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-8 shadow-lg hover-glow transform transition-all duration-500 hover:-translate-y-2 animate-fade-in-up stagger-2">
              <div className="w-16 h-16 bg-accent rounded-2xl flex items-center justify-center mb-6 mx-auto">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-accent text-center mb-4">Customer First</h3>
              <p className="text-gray-600 text-center leading-relaxed">
                Your satisfaction is our priority. We're committed to providing exceptional service and an unforgettable shopping experience.
              </p>
            </div>
          </div>

          {/* Founder's Vision */}
          <div className="bg-accent rounded-3xl p-12 shadow-2xl text-white mb-20 animate-fade-in-up stagger-3">
            <div className="max-w-4xl mx-auto text-center">
              <svg className="w-16 h-16 mx-auto mb-6 opacity-50" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
              </svg>
              <p className="text-2xl md:text-3xl font-light leading-relaxed mb-6 italic">
                "Fashion is not just about what you wear—it's about how you express yourself. At AM_fashions, 
                we empower you to discover and embrace your unique style."
              </p>
              <p className="text-xl font-semibold">— M Miteesh</p>
              <p className="text-lg opacity-90">Founder, AM_fashions</p>
            </div>
          </div>

          {/* Vision & Mission */}
          <div className="grid md:grid-cols-2 gap-8 mb-20">
            <div className="bg-gradient-to-br from-accent to-gray-800 rounded-3xl p-10 shadow-2xl text-white transform transition-all duration-500 hover:scale-105 animate-fade-in-up stagger-4">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
                <h3 className="text-3xl font-bold">Our Vision</h3>
              </div>
              <p className="text-lg leading-relaxed text-white/90">
                To become the most trusted fashion destination where every individual finds their perfect style. 
                We envision a world where fashion is accessible, sustainable, and celebrates diversity—empowering 
                people to express their authentic selves through quality clothing that transcends trends.
              </p>
            </div>

            <div className="bg-gradient-to-br from-gray-800 to-accent rounded-3xl p-10 shadow-2xl text-white transform transition-all duration-500 hover:scale-105 animate-fade-in-up stagger-5">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                </div>
                <h3 className="text-3xl font-bold">Our Mission</h3>
              </div>
              <p className="text-lg leading-relaxed text-white/90">
                To deliver exceptional fashion experiences by offering premium quality clothing at affordable prices. 
                We are committed to understanding our customers' needs, providing personalized service, and creating 
                a seamless shopping journey that makes fashion accessible to everyone, everywhere.
              </p>
            </div>
          </div>

          {/* Our Promise */}
          <div className="text-center animate-fade-in-up stagger-4">
            <h2 className="text-4xl font-bold text-accent mb-6">Our Promise</h2>
            <div className="w-24 h-1 bg-accent mx-auto mb-8"></div>
            <p className="text-xl text-gray-700 leading-relaxed max-w-3xl mx-auto mb-12">
              We promise to deliver not just clothing, but confidence. Every piece from AM_fashions is designed 
              to make you feel your best, whether you're dressing for success, comfort, or making a statement.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <div className="bg-white px-8 py-4 rounded-full shadow-lg hover-lift">
                <p className="text-accent font-semibold">Premium Quality</p>
              </div>
              <div className="bg-white px-8 py-4 rounded-full shadow-lg hover-lift">
                <p className="text-accent font-semibold">Affordable Prices</p>
              </div>
              <div className="bg-white px-8 py-4 rounded-full shadow-lg hover-lift">
                <p className="text-accent font-semibold">Fast Delivery</p>
              </div>
              <div className="bg-white px-8 py-4 rounded-full shadow-lg hover-lift">
                <p className="text-accent font-semibold">Easy Returns</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
