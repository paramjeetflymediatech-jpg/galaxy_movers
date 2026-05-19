import React from 'react';
import JsonLd from './Jsonld';
 
/**
 * FAQSchema Component
 * Automatically generates FAQPage Structured Data (JSON-LD)
 * @param {Array} faqs - Array of { question, answer } objects
 */
export default function FAQschema({ faqs }) {
  if (!faqs || faqs.length === 0) return null;
 
  const schema = {
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
 
  return <JsonLd schema={schema} />;
}
