interface ParsedGift {
  title: string;
  description: string;
}

export async function parseGiftText(text: string): Promise<ParsedGift> {
  try {
    const response = await fetch(
      'https://api-inference.huggingface.co/models/facebook/bart-large',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_HUGGINGFACE_API_KEY}`
        },
        body: JSON.stringify({
          inputs: `Parse this gift idea into a title and description. Text: ${text}
          Format: Title: <title>
          Description: <description>`,
        }),
      }
    );

    const result = await response.json();
    const output = result[0]?.generated_text || '';
    
    // Extract title and description from the formatted output
    const titleMatch = output.match(/Title: (.*?)(?:\n|$)/);
    const descriptionMatch = output.match(/Description: (.*?)(?:\n|$)/);

    return {
      title: titleMatch?.[1] || text,
      description: descriptionMatch?.[1] || ''
    };
  } catch (error) {
    console.error('Error parsing gift text:', error);
    // Fallback: use the entire text as title if parsing fails
    return {
      title: text,
      description: ''
    };
  }
}