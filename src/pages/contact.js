import React, { useState } from 'react';
import Head from 'next/head';

export default function ContactPage({ musicPacks = [] }) {
  const [contactFormState, setContactFormState] = useState({ name: '', email: '', message: '' });
  const [formSubmissionStatus, setFormSubmissionStatus] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const handleContactFormChange = (e) => {
    const { name, value } = e.target;
    setContactFormState(prevState => ({ ...prevState, [name]: value }));
  };

  const handleContactFormSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setFormSubmissionStatus('submitting');

    try {
      // Basic validation
      if (!contactFormState.name || !contactFormState.email || !contactFormState.message) {
        setFormSubmissionStatus('error');
        setErrorMessage('Please fill out all fields.');
        return;
      }

      // Submit to Formspree (configured to forward to topdjcrates@proton.me)
      const response = await fetch('https://formspree.io/f/xdkzwaaq', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: contactFormState.name,
          email: contactFormState.email,
          message: contactFormState.message,
          form_name: 'General Contact (Website)'
        })
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        const msg = data?.errors?.map(e => e.message).join(', ') || 'Failed to send message. Please try again later.';
        throw new Error(msg);
      }

      setFormSubmissionStatus('success');
      setContactFormState({ name: '', email: '', message: '' });
    } catch (err) {
      setFormSubmissionStatus('error');
      setErrorMessage(err.message || 'Something went wrong.');
    }
  };

  return (
    <>
      <Head>
        <title>Contact Us - TOP DJ CRATES</title>
        <meta name="description" content="Get in touch with TOP DJ CRATES for general questions and inquiries." />
      </Head>
      <div className="px-4 py-16">
        <section id="contact" className="text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-primary mb-4">General Contact</h1>
          <p className="text-lg md:text-xl text-text max-w-2xl mx-auto mb-8">For questions not related to custom mixes, use the form below.</p>
          <form onSubmit={handleContactFormSubmit} className="max-w-xl mx-auto space-y-6" role="form" aria-label="Contact form">
            {/* Name */}
            <div className="text-left">
              <label htmlFor="name" className="block text-sm font-medium mb-1">Name</label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={contactFormState.name}
                onChange={handleContactFormChange}
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:border-primary focus:outline-none"
                placeholder="Your name"
                aria-describedby="name-help"
                aria-required="true"
              />
              <div id="name-help" className="sr-only">Enter your full name</div>
            </div>

            {/* Email */}
            <div className="text-left">
              <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={contactFormState.email}
                onChange={handleContactFormChange}
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:border-primary focus:outline-none"
                placeholder="you@example.com"
                aria-describedby="email-help"
                aria-required="true"
              />
              <div id="email-help" className="sr-only">Enter your email address</div>
            </div>

            {/* Message */}
            <div className="text-left">
              <label htmlFor="message" className="block text-sm font-medium mb-1">Message</label>
              <textarea
                id="message"
                name="message"
                rows="6"
                required
                value={contactFormState.message}
                onChange={handleContactFormChange}
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:border-primary focus:outline-none"
                placeholder="How can we help?"
                aria-describedby="message-help"
                aria-required="true"
              />
              <div id="message-help" className="sr-only">Enter your message or question</div>
            </div>

            {/* Status */}
            {formSubmissionStatus === 'success' && (
              <p className="text-green-600" role="status" aria-live="polite">Thanks! Your message has been sent.</p>
            )}
            {formSubmissionStatus === 'error' && (
              <p className="text-red-600" role="alert" aria-live="assertive">{errorMessage}</p>
            )}

            <div className="pt-2">
              <button
                type="submit"
                disabled={formSubmissionStatus === 'submitting'}
                className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 font-semibold text-background hover:opacity-90 disabled:opacity-60"
                aria-describedby="submit-help"
              >
                {formSubmissionStatus === 'submitting' ? 'Sending…' : 'Send Message'}
              </button>
              <div id="submit-help" className="sr-only">Submit your contact form</div>
            </div>
          </form>
        </section>
      </div>
    </>
  );
}