import { useEffect } from 'react';
import { CANONICAL_URL, DEFAULT_SEO_IMAGE_URL } from '../config/constants';

const setMetaTag = (attr: 'name' | 'property', key: string, content: string) => {
    let element = document.querySelector(`meta[${attr}='${key}']`);
    if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attr, key);
        document.head.appendChild(element);
    }
    element.setAttribute('content', content);
};


export const useSeo = (
  title: string,
  description: string,
  imageUrl?: string,
  pageUrl?: string,
  locale?: 'sq_AL' | 'en_US'
) => {
  useEffect(() => {
    document.title = title;

    const safeDescription = description || 'NOVARIC® AI-Powered News - Analiza dhe verifikim faktesh për Shqipërinë.';
    const metaDescription = safeDescription.substring(0, 160).replace(/\s+/g, ' ').trim();
    
    const imageToUse = imageUrl || DEFAULT_SEO_IMAGE_URL;
    
    // Standard tags
    setMetaTag('name', 'description', metaDescription);

    // Open Graph (for Facebook, LinkedIn, etc.)
    setMetaTag('property', 'og:title', title);
    setMetaTag('property', 'og:description', metaDescription);
    setMetaTag('property', 'og:image', imageToUse);
    setMetaTag('property', 'og:url', pageUrl || CANONICAL_URL);
    setMetaTag('property', 'og:type', 'website');
    setMetaTag('property', 'og:site_name', 'NOVARIC® AI-Powered News');
    setMetaTag('property', 'og:locale', locale || 'sq_AL');
    
    // Twitter Card
    setMetaTag('name', 'twitter:card', 'summary_large_image');
    setMetaTag('name', 'twitter:site', '@novaricmedia');
    setMetaTag('name', 'twitter:title', title);
    setMetaTag('name', 'twitter:description', metaDescription);
    setMetaTag('name', 'twitter:image', imageToUse);

  }, [title, description, imageUrl, pageUrl, locale]);
};