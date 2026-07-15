import React, { useState } from 'react';
import Head from 'next/head';

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "Who are these DJ crates designed for?",
      answer: "Our curated DJ crates are meticulously designed for Professional DJs, Club DJs, Lounge DJs, and Wedding DJs. We do the heavy lifting of sorting, editing, and categorizing tracks so you can focus entirely on your performance."
    },
    {
      question: "Where can I find curated DJ crates for restaurants and lounges?",
      answer: "We offer highly specialized crates like 'Organic / Downtempo' and 'Deep House' which are perfect for sunset sessions, beach clubs, luxury lounges, and high-end restaurant sets."
    },
    {
      question: "What file formats are included in the music packs?",
      answer: "Every single track in our crates is provided in high-quality format. You will receive DJ-ready WAV and 320kbps MP3 files, ensuring pristine sound on any club sound system."
    },
    {
      question: "Do you offer music for cultural and specialty events?",
      answer: "Yes! We have a massive selection of crossover and cultural genres. From Bollywood edits to Arabic, Oriental, Reggaeton, and Afro-House anthems, you'll be ready for any international crowd."
    }
  ];

  const toggleOpen = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  // Generate JSON-LD Schema for Conversational SEO
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  return (
    <section className="py-20 px-4 max-w-4xl mx-auto w-full mt-16 border-t border-gray-800">
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      </Head>

      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 tracking-wide uppercase">Frequently Asked Questions</h2>
        <div className="w-24 h-1 bg-red-600 mx-auto"></div>
        <p className="text-gray-400 mt-6 text-lg">Everything you need to know about our premium DJ Crates.</p>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div 
            key={index} 
            className="border border-gray-700 rounded-lg overflow-hidden bg-gray-900 transition-all duration-300 shadow-lg hover:border-gray-600"
          >
            <button
              className="w-full px-6 py-5 flex justify-between items-center text-left transition-colors focus:outline-none"
              onClick={() => toggleOpen(index)}
            >
              <span className="font-semibold text-lg text-white pr-4">{faq.question}</span>
              <span className={`transform transition-transform duration-300 flex-shrink-0 ${openIndex === index ? 'rotate-180' : ''}`}>
                <svg className="w-6 h-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </span>
            </button>
            
            <div 
              className={`px-6 overflow-hidden transition-all duration-300 ease-in-out bg-black/30 ${openIndex === index ? 'max-h-96 py-5 border-t border-gray-700 opacity-100' : 'max-h-0 opacity-0'}`}
            >
              <p className="text-gray-300 leading-relaxed text-base">{faq.answer}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FAQ;
