import { musicPacks } from '@/data/musicPacks';

const BASE_URL = 'https://www.topdjcrates.com';

function generateSiteMap(packs) {
  // Define static site routes
  const staticPages = [
    '',
    '/music',
    '/about',
    '/contact',
    '/sonic-branding'
  ];

  const currentDate = new Date().toISOString();

  return `<?xml version="1.0" encoding="UTF-8"?>
   <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
     <!-- Static Page URLs -->
     ${staticPages
       .map((path) => {
         return `
       <url>
           <loc>${BASE_URL}${path}</loc>
           <lastmod>${currentDate}</lastmod>
           <changefreq>weekly</changefreq>
           <priority>${path === '' ? '1.0' : '0.8'}</priority>
       </url>
     `;
       })
       .join('')}
     <!-- Dynamic DJ Crate URLs -->
     ${packs
       .map(({ id }) => {
         return `
       <url>
           <loc>${BASE_URL}/music?crate=${id}</loc>
           <lastmod>${currentDate}</lastmod>
           <changefreq>weekly</changefreq>
           <priority>0.7</priority>
       </url>
     `;
       })
       .join('')}
   </urlset>
 `;
}

function SiteMap() {
  // React component remains empty as getServerSideProps handles the direct XML response
  return null;
}

export async function getServerSideProps({ res }) {
  // Generate the dynamic XML content using data from musicPacks
  const sitemap = generateSiteMap(musicPacks);

  // Set response headers and write raw XML sitemap
  res.setHeader('Content-Type', 'text/xml');
  res.write(sitemap);
  res.end();

  return {
    props: {},
  };
}

export default SiteMap;
