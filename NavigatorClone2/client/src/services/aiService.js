// AI integration service for equipment recommendations

const API_URL = process.env.REACT_APP_API_URL || '';

/**
 * Generate equipment recommendations based on user input
 * @param {string} userInput - The user's description of what they need
 * @param {Array} equipmentCatalog - Available equipment items
 * @param {number} jobId - Current job ID (optional)
 * @param {number} orderId - Current order ID (optional)
 * @param {Array} conversationHistory - Previous messages (optional)
 * @returns {Promise<Object>} Object containing message and recommendations
 */
export const generateEquipmentRecommendations = async (
  userInput, 
  equipmentCatalog, 
  jobId, 
  orderId,
  conversationHistory = []
) => {
  console.log('Generating recommendations for input:', userInput);
  
  try {
    // First try the API
    try {
      const response = await fetch(`${API_URL}/ai/recommendations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: userInput,
          jobId,
          orderId,
          conversationHistory,
        }),
      });

      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('AI response data:', data);
      
      // Enhanced recommendation processing
      const processedData = {
        message: data.message,
        recommendations: processRecommendations(data.items, equipmentCatalog)
      };

      return processedData;
    } catch (apiError) {
      console.error('API error, falling back to local processing:', apiError);
      
      // If API fails, fall back to a simple local implementation
      console.log('Using local fallback for equipment recommendations');
      
      // Basic keyword matching algorithm as fallback
      const fallbackRecommendations = [];
      const userInputLower = userInput.toLowerCase();
      
      if (userInputLower.includes('presentation') || userInputLower.includes('slide') || userInputLower.includes('projector')) {
        const projector = equipmentCatalog.find(e => e.name.toLowerCase().includes('projector'));
        if (projector) fallbackRecommendations.push({...projector, quantity: 1});
        
        const screen = equipmentCatalog.find(e => e.name.toLowerCase().includes('screen'));
        if (screen) fallbackRecommendations.push({...screen, quantity: 1});
      }
      
      if (userInputLower.includes('microphone') || userInputLower.includes('mic') || userInputLower.includes('sound') || userInputLower.includes('speak')) {
        const mic = equipmentCatalog.find(e => e.name.toLowerCase().includes('microphone'));
        if (mic) fallbackRecommendations.push({...mic, quantity: userInputLower.includes('panel') ? 3 : 1});
        
        const speaker = equipmentCatalog.find(e => e.name.toLowerCase().includes('speaker'));
        if (speaker) fallbackRecommendations.push({...speaker, quantity: 1});
      }
      
      if (userInputLower.includes('tv') || userInputLower.includes('monitor') || userInputLower.includes('display')) {
        const display = equipmentCatalog.find(e => e.name.toLowerCase().includes('tv') || e.name.toLowerCase().includes('led'));
        if (display) fallbackRecommendations.push({...display, quantity: 1});
      }
      
      if (fallbackRecommendations.length === 0) {
        // Add a default item if no matches
        const defaultItem = equipmentCatalog[0] || { id: 1, name: 'Basic Equipment Package', rate: 100, price: 100 };
        fallbackRecommendations.push({...defaultItem, quantity: 1});
      }
      
      return {
        message: "Based on your requirements, here are my equipment recommendations:",
        recommendations: fallbackRecommendations
      };
    }
  } catch (error) {
    console.error('Error in AI service:', error);
    throw error;
  }
};

/**
 * Process the recommendations from the AI response
 */
export function processRecommendations(items, equipmentCatalog) {
  console.log('Processing recommendations:', items);
  
  if (!items || !items.length) {
    console.log('No items to process');
    return [];
  }
  
  // Map recommendations to catalog items with enhanced matching
  return items.map(item => {
    console.log('Processing item:', item);
    
    // Find the best catalog match
    const catalogMatch = findBestEquipmentMatch(item.name, equipmentCatalog);
    console.log('Found catalog match:', catalogMatch);
    
    // If we found a match in the catalog, use its data
    const matchedItem = catalogMatch ? {
      id: catalogMatch.id,
      name: catalogMatch.name,
      rate: catalogMatch.rate || 0,
      price: (catalogMatch.rate || 0) * (item.quantity || 1),
      categoryId: item.category || catalogMatch.category || 'Other',
    } : {
      // Otherwise, create a new item based on the AI recommendation
      id: Date.now() + Math.random().toString(36).substring(2, 9),
      name: item.name,
      rate: item.rate || 0,
      price: (item.rate || 0) * (item.quantity || 1),
      categoryId: item.category || 'Other',
    };
    
    // Add the quantity and any notes from the original recommendation
    return {
      ...matchedItem,
      quantity: item.quantity || 1,
      notes: item.notes || '',
    };
  });
}

/**
 * Find the best equipment match with stricter criteria
 */
function findBestEquipmentMatch(itemName, catalog) {
  if (!catalog || catalog.length === 0) return null;
  
  const itemNameLower = itemName.toLowerCase().trim();
  
  // First try exact matches
  const exactMatch = catalog.find(e => 
    e.name.toLowerCase() === itemNameLower
  );
  if (exactMatch) return exactMatch;
  
  // Try more specific contains matches
  const wordMatches = catalog.filter(e => {
    const eName = e.name.toLowerCase();
    const keyTerms = itemNameLower.split(/\s+/).filter(term => term.length > 3);
    
    // Match if all key terms are present in the equipment name
    return keyTerms.every(term => eName.includes(term));
  });
  
  if (wordMatches.length > 0) {
    // If we found matches based on key terms, return the best one
    if (wordMatches.length === 1) return wordMatches[0];
    
    // Multiple matches, find one with closest length
    return wordMatches.reduce((best, current) => {
      const bestDiff = Math.abs(best.name.length - itemName.length);
      const currentDiff = Math.abs(current.name.length - itemName.length);
      return currentDiff < bestDiff ? current : best;
    });
  }
  
  // Standard contains matches as fallback
  const containsMatches = catalog.filter(e => 
    e.name.toLowerCase().includes(itemNameLower) || 
    itemNameLower.includes(e.name.toLowerCase())
  );
  
  if (containsMatches.length === 0) return null;
  
  // If multiple matches, find the closest match by string length
  if (containsMatches.length > 1) {
    return containsMatches.reduce((best, current) => {
      const bestDiff = Math.abs(best.name.length - itemName.length);
      const currentDiff = Math.abs(current.name.length - itemName.length);
      return currentDiff < bestDiff ? current : best;
    });
  }
  
  return containsMatches[0];
} 