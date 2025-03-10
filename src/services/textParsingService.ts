interface ParsedGiftText {
  title: string;
  description: string;
  priceEstimate?: string;
  url?: string;
}

export async function parseGiftText(text: string): Promise<ParsedGiftText> {
  // Basic parsing for URL - look for http:// or https:// in the text
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const urlMatch = text.match(urlRegex);
  const url = urlMatch ? urlMatch[0] : undefined;
  
  // Basic parsing for price - look for currency symbols or numbers with decimal points
  const priceRegex = /[\$£€](\d+(\.\d{2})?)|(\d+(\.\d{2})?)\s*(dollars|pound|euro)/i;
  const priceMatch = text.match(priceRegex);
  const priceEstimate = priceMatch ? priceMatch[1] || priceMatch[3] : undefined;

  // Remove URL and price from text before splitting into title/description
  let cleanText = text
    .replace(urlRegex, '')
    .replace(priceRegex, '')
    .trim();

  // If the text is short, use it as title only
  if (cleanText.length < 50) {
    return {
      title: cleanText,
      description: '',
      priceEstimate,
      url
    };
  }

  // Otherwise, take first sentence as title and rest as description
  const sentences = cleanText.split(/[.!?]+\s+/);
  const title = sentences[0].trim();
  const description = sentences.slice(1).join('. ').trim();

  return {
    title,
    description,
    priceEstimate,
    url
  };
}