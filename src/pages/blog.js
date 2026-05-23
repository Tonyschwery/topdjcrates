import React from 'react';
import Head from 'next/head';
import Script from 'next/script';

export default function BlogPage() {
  return (
    <>
      <Head>
        <title>Blog | TOP DJ CRATES</title>
        <meta
          name="description"
          content="Stay updated with the latest music trends, DJ tips, Afro-House releases, and exclusive crates on TOP DJ CRATES."
        />
      </Head>

      <div className="px-4 py-16 max-w-6xl mx-auto">
        {/* Header Section */}
        <section className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-primary mb-4 tracking-tight">
            TOP DJ CRATES BLOG
          </h1>
          <p className="text-lg text-text max-w-2xl mx-auto">
            Your source for exclusive DJ news, industry insights, and crate reviews.
          </p>
        </section>

        {/* Embedded Soro Blog Container */}
        <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-2xl p-6 md:p-10 shadow-2xl backdrop-blur-sm min-h-[500px]">
          <div id="soro-blog" className="w-full"></div>
        </div>

        {/* Safe loading of the blog embed script */}
        <Script
          src="https://app.trysoro.com/api/embed/ca934cbd-2453-4b40-9bab-c11d0fdaba58"
          strategy="afterInteractive"
        />
      </div>
    </>
  );
}
