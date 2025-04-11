const OpenAI = require('openai');
const db = require('../database/db');

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Generate equipment recommendations based on intent detection
 */
exports.generateRecommendations = async (req, res) => {
  try {
    console.log('==== AI REQUEST RECEIVED ====');
    console.log('Request body:', JSON.stringify(req.body));
    console.log('Conversation history length:', req.body.conversationHistory ? req.body.conversationHistory.length : 0);
    
    const { prompt, jobId, orderId, conversationHistory = [] } = req.body;
    
    if (!prompt) {
      return res.status(400).json({ error: 'No prompt provided' });
    }
    
    // Load our equipment catalog
    const equipmentCatalog = await getEquipmentCatalog();
    
    // Track previous recommendations to build upon them
    const previousRecommendations = extractPreviousRecommendations(conversationHistory);
    console.log('Previous recommendations:', previousRecommendations);
    
    // INTENT DETECTION: First determine what the user is looking for
    const intent = await detectEquipmentIntent(prompt, conversationHistory);
    console.log('Detected intent:', intent);
    
    // RECOMMENDATION PHASE: Generate recommendations based on intent and conversation history
    const recommendations = generateRecommendationsFromIntent(intent, equipmentCatalog, previousRecommendations);
    
    // If no recommendations could be generated, don't fall back to default items
    // Instead, return an empty array with an explanation
    if (recommendations.length === 0) {
      return res.json({
        message: "I'm not familiar with that specific equipment. Could you clarify what you're looking for? For example, we have audio equipment, video projection, lighting, power strips, and other AV equipment.",
        items: []
      });
    }
    
    // Create appropriate response message
    const responseMessage = createResponseMessage(intent, recommendations, previousRecommendations);
    
    // Before sending response
    console.log('==== AI RESPONSE SENDING ====');
    console.log('Message:', responseMessage.substring(0, 100) + '...');
    console.log('Items count:', recommendations.length);
    console.log('Intent:', JSON.stringify(intent));
    
    // Return the final result with the intent included for tracking
    res.json({
      message: responseMessage,
      items: recommendations,
      intent: intent  // Include the detected intent for frontend reference
    });
  } catch (error) {
    console.error('Error generating recommendations:', error);
    res.status(500).json({ 
      error: 'Failed to generate recommendations',
      message: "I'm having trouble processing your request. Could you try again with a clearer description of what you need?"
    });
  }
};

/**
 * Detect the user's intent from their message and conversation history
 */
async function detectEquipmentIntent(prompt, conversationHistory) {
  const promptLower = prompt.toLowerCase().trim();
  
  // Extract context from conversation history
  const eventContext = extractEventContextFromHistory(conversationHistory);
  
  // First check for follow-up intents that reference previous context
  if (isFollowUpQuestion(promptLower) && eventContext) {
    console.log('Detected follow-up question with context:', eventContext);
    
    // Check for addition requests
    if (promptLower.match(/\badd\b/) || promptLower.match(/\bmore\b/) || promptLower.match(/\balso\b/) || promptLower.match(/\band\b/)) {
      // This is asking to add more equipment to existing recommendations
      
      // Check what kind of equipment they want to add
      if (promptLower.match(/\blight(s|ing)?\b/)) {
        return {
          category: 'lighting',
          subcategory: determineSpecificLightingType(promptLower),
          isFollowUp: true,
          context: eventContext,
          quantity: estimateQuantity(promptLower, 2)
        };
      } else if (promptLower.match(/\bmicrophone(s)?\b/) || promptLower.match(/\bmic(s)?\b/) || promptLower.match(/\baudio\b/)) {
        return {
          category: 'audio',
          subcategory: promptLower.match(/\bwireless\b/) ? 'wireless_microphone' : 'audio_general',
          isFollowUp: true,
          context: eventContext,
          quantity: estimateQuantity(promptLower, 1)
        };
      } else if (promptLower.match(/\b(projector|screen|display|monitor)\b/)) {
        return {
          category: 'video',
          subcategory: promptLower.match(/\bprojector\b/) ? 'projector' : 'screen',
          isFollowUp: true,
          context: eventContext,
          quantity: estimateQuantity(promptLower, 1)
        };
      } else if (promptLower.match(/\b(power|extension|cord|strip)\b/)) {
        return {
          category: 'electrical',
          subcategory: 'power_strips',
          isFollowUp: true,
          context: eventContext,
          quantity: estimateQuantity(promptLower, 1)
        };
      }
    }
    
    // Check for replacement requests
    if (promptLower.match(/\binstead\b/) || promptLower.match(/\breplace\b/) || promptLower.match(/\bchange\b/)) {
      // They want to replace something
      if (promptLower.match(/\blight(s|ing)?\b/)) {
        return {
          category: 'lighting',
          subcategory: determineSpecificLightingType(promptLower),
          isReplacement: true,
          context: eventContext,
          quantity: estimateQuantity(promptLower, 4)
        };
      }
      // Add other replacement cases for audio, video, etc.
    }
  }
  
  // Then continue with the existing pattern matching...
  
  // 1. QUICK PATTERN MATCHING FOR COMMON INTENTS
  // Check for direct equipment mentions with simple pattern matching
  if (promptLower.match(/\buplight(s)?\b/) || promptLower.match(/\bup light(s)?\b/)) {
    return {
      category: 'lighting',
      subcategory: 'uplights',
      quantity: estimateQuantity(promptLower, 6),
      context: extractContext(promptLower)
    };
  }
  
  // Add power strip detection
  if (promptLower.match(/\bpower strip(s)?\b/) || promptLower.match(/\bpower bar(s)?\b/) || promptLower.match(/\bextension cord(s)?\b/)) {
    return {
      category: 'electrical',
      subcategory: 'power_strips',
      quantity: estimateQuantity(promptLower, 1),
      context: extractContext(promptLower)
    };
  }
  
  if (promptLower.match(/\bwireless\s+mic(rophone)?(s)?\b/)) {
    return {
      category: 'audio',
      subcategory: 'wireless_microphone',
      quantity: estimateQuantity(promptLower, 1),
      context: extractContext(promptLower)
    };
  }
  
  if (promptLower.match(/\bspeaker(s)?\b/) || promptLower.match(/\baudio system\b/)) {
    return {
      category: 'audio',
      subcategory: 'speakers',
      quantity: estimateQuantity(promptLower, 1),
      context: extractContext(promptLower)
    };
  }
  
  if (promptLower.match(/\bprojector(s)?\b/)) {
    return {
      category: 'video',
      subcategory: 'projector',
      quantity: estimateQuantity(promptLower, 1),
      context: extractContext(promptLower),
      needsScreen: true
    };
  }
  
  if (promptLower.match(/\bscreen(s)?\b/) && !promptLower.match(/\bprojector(s)?\b/)) {
    return {
      category: 'video',
      subcategory: 'screen',
      quantity: estimateQuantity(promptLower, 1),
      context: extractContext(promptLower)
    };
  }
  
  // 2. EVENT TYPE DETECTION
  if (promptLower.match(/\bwedding\b/)) {
    return {
      category: 'event',
      subcategory: 'wedding',
      context: extractContext(promptLower)
    };
  }
  
  if (promptLower.match(/\bconference\b/) || promptLower.match(/\bmeeting\b/)) {
    return {
      category: 'event',
      subcategory: 'conference',
      context: extractContext(promptLower)
    };
  }
  
  // 3. FALLBACK TO AI FOR COMPLEX INTENTS
  try {
    const messages = [
      { 
        role: "system", 
        content: `You are an equipment intent classifier. Analyze the user's message and classify what type of audio-visual equipment they're looking for.
        
Output ONLY ONE of these categories:
- CATEGORY: audio, SUBCATEGORY: microphone, DETAIL: [wireless/tabletop/lavalier/etc]
- CATEGORY: audio, SUBCATEGORY: speakers, DETAIL: [basic/advanced]
- CATEGORY: video, SUBCATEGORY: projector, DETAIL: [standard/HD]
- CATEGORY: video, SUBCATEGORY: screen, DETAIL: [size-small/size-medium/size-large]
- CATEGORY: lighting, SUBCATEGORY: uplights, DETAIL: [quantity]
- CATEGORY: lighting, SUBCATEGORY: stagelighting, DETAIL: [basic/advanced]
- CATEGORY: event, SUBCATEGORY: [wedding/conference/presentation/party], DETAIL: [size-small/size-medium/size-large]
- CATEGORY: unknown, SUBCATEGORY: general, DETAIL: needshelp`
      },
      { role: "user", content: prompt }
    ];
    
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: messages,
      temperature: 0.3,
      max_tokens: 150
    });
    
    const response = completion.choices[0].message.content;
    
    // Parse the AI response
    const categoryMatch = response.match(/CATEGORY:\s*(\w+)/i);
    const subcategoryMatch = response.match(/SUBCATEGORY:\s*(\w+)/i);
    const detailMatch = response.match(/DETAIL:\s*([^\n]+)/i);
    
    if (categoryMatch && subcategoryMatch) {
      return {
        category: categoryMatch[1].toLowerCase(),
        subcategory: subcategoryMatch[1].toLowerCase(),
        detail: detailMatch ? detailMatch[1].toLowerCase() : null,
        context: extractContext(promptLower)
      };
    }
  } catch (error) {
    console.error('Error in AI intent classification:', error);
  }
  
  // Default fallback
  return {
    category: 'unknown',
    subcategory: 'general',
    context: extractContext(promptLower)
  };
}

/**
 * Generate recommendations based on detected intent and conversation history
 */
function generateRecommendationsFromIntent(intent, equipmentCatalog, previousRecommendations = []) {
  console.log('Generating recommendations for intent:', intent);
  
  const recommendations = [];
  
  // Special handling for follow-up requests
  if (intent.isFollowUp) {
    console.log('Processing follow-up request with context:', intent.context);
    
    // Check what we've already recommended to avoid duplicates
    const alreadyRecommendedTypes = previousRecommendations.map(item => item.name.toLowerCase());
    console.log('Already recommended:', alreadyRecommendedTypes);
    
    // For follow-up audio requests
    if (intent.category === 'audio') {
      // Only add wireless mics if none were previously recommended
      const hasWirelessMic = alreadyRecommendedTypes.some(type => type.includes('wireless') && type.includes('mic'));
      
      if (intent.subcategory === 'wireless_microphone' && !hasWirelessMic) {
        const wirelessMic = findEquipmentByType(equipmentCatalog, 'wireless microphone');
        if (wirelessMic) {
          recommendations.push({
            ...wirelessMic,
            quantity: intent.quantity || 1,
            notes: 'Additional wireless microphone for your event'
          });
        }
      }
      
      // Only add speakers if none were previously recommended
      const hasSpeakers = alreadyRecommendedTypes.some(type => type.includes('speaker'));
      
      if (!hasSpeakers) {
        const speakers = findEquipmentByType(equipmentCatalog, 'speaker');
        if (speakers) {
          recommendations.push({
            ...speakers,
            quantity: 1,
            notes: 'Speaker system to ensure clear audio for your event'
          });
        }
      }
      
      // Handle other audio subcategories...
    }
    
    // For follow-up lighting requests
    else if (intent.category === 'lighting') {
      // Check if uplights were already recommended
      const hasUplights = alreadyRecommendedTypes.some(type => 
        type.includes('up light') || type.includes('uplight'));
      
      if (intent.subcategory === 'uplights' && !hasUplights) {
        const uplights = findEquipmentByType(equipmentCatalog, 'uplights');
        if (uplights) {
          recommendations.push({
            ...uplights,
            quantity: intent.quantity || 4,
            notes: 'Decorative lighting to enhance the atmosphere of your event'
          });
        }
      }
      
      // Handle other lighting subcategories...
    }
    
    // For follow-up video requests
    else if (intent.category === 'video') {
      // Check existing recommendations
      const hasProjector = alreadyRecommendedTypes.some(type => type.includes('projector'));
      const hasScreen = alreadyRecommendedTypes.some(type => type.includes('screen'));
      
      if (intent.subcategory === 'projector' && !hasProjector) {
        const projector = findEquipmentByType(equipmentCatalog, 'projector');
        if (projector) {
          recommendations.push({
            ...projector,
            quantity: intent.quantity || 1,
            notes: 'Additional projector for displaying presentations or videos'
          });
          
          // Add a screen if none exists yet
          if (!hasScreen) {
            const screen = findEquipmentByType(equipmentCatalog, 'screen');
            if (screen) {
              recommendations.push({
                ...screen,
                quantity: 1,
                notes: 'Required projection surface for the projector'
              });
            }
          }
        }
      }
      
      // Handle other video subcategories...
    }
    
    // Electrical equipment follow-up
    else if (intent.category === 'electrical') {
      const hasPowerStrips = alreadyRecommendedTypes.some(type => 
        type.includes('power strip') || type.includes('extension cord'));
      
      if (intent.subcategory === 'power_strips' && !hasPowerStrips) {
        const powerStrip = findEquipmentByType(equipmentCatalog, 'Power Strip');
        if (powerStrip) {
          recommendations.push({
            ...powerStrip,
            quantity: intent.quantity || 2,
            notes: 'Power strips for connecting multiple devices'
          });
        }
      }
    }
    
    // If we still have no recommendations for a follow-up, try to add context-specific recommendations
    if (recommendations.length === 0 && intent.context) {
      if (intent.context === 'wedding' || intent.context === 'party') {
        // Add appropriate lighting or audio based on the event context
        const hasLighting = alreadyRecommendedTypes.some(type => 
          type.includes('light') || type.includes('wash'));
        
        if (!hasLighting) {
          const uplights = findEquipmentByType(equipmentCatalog, 'uplights');
          if (uplights) {
            recommendations.push({
              ...uplights,
              quantity: 4,
              notes: 'Atmospheric lighting to enhance your event'
            });
          }
        }
      } else if (intent.context === 'conference' || intent.context === 'presentation') {
        // Add appropriate projection or audio based on the event context
        const hasProjection = alreadyRecommendedTypes.some(type => 
          type.includes('projector') || type.includes('screen'));
        
        if (!hasProjection) {
          const projector = findEquipmentByType(equipmentCatalog, 'projector');
          if (projector) {
            recommendations.push({
              ...projector,
              quantity: 1,
              notes: 'Projector for displaying presentations'
            });
            
            const screen = findEquipmentByType(equipmentCatalog, 'screen');
            if (screen) {
              recommendations.push({
                ...screen,
                quantity: 1,
                notes: 'Projection screen for displaying presentations'
              });
            }
          }
        }
      }
    }
  }
  
  // If it's not a follow-up request, or we couldn't generate follow-up recommendations,
  // fall back to the original logic
  if (recommendations.length === 0) {
    // Original recommendation logic...
    // ... (existing code for generateRecommendationsFromIntent)
    
    // Debug logging for electrical equipment
    if (intent.category === 'electrical') {
      // ... existing code
    }
    
    // Handle different types of intents
    switch (intent.category) {
      case 'lighting':
        // ... existing code
        break;
      case 'audio':
        // ... existing code
        break;
      case 'video':
        // ... existing code
        break;
      case 'event':
        // ... existing code
        break;
      case 'unknown':
        // ... existing code
        break;
    }
  }
  
  return recommendations;
}

/**
 * Helper to add a package of equipment for a specific event type
 */
function addEventPackage(recommendations, catalog, eventType) {
  if (eventType === 'wedding') {
    // Wireless microphones for ceremony
    const wirelessMic = findEquipmentByType(catalog, 'wireless microphone');
    if (wirelessMic) {
      recommendations.push({
        ...wirelessMic,
        quantity: 2,
        notes: 'For officiant and vows during ceremony'
      });
    }
    
    // Speakers for ceremony and reception
    const speakers = findEquipmentByType(catalog, 'speaker');
    if (speakers) {
      recommendations.push({
        ...speakers,
        quantity: 1,
        notes: 'For ceremony audio and reception music'
      });
    }
    
    // Uplights for reception decoration
    const uplights = findEquipmentByType(catalog, 'uplights');
    if (uplights) {
      recommendations.push({
        ...uplights,
        quantity: 8,
        notes: 'Create beautiful ambient lighting in your wedding colors'
      });
    }
    
    // DJ setup for reception
    const djBooth = findEquipmentByType(catalog, 'dj');
    if (djBooth) {
      recommendations.push({
        ...djBooth,
        quantity: 1,
        notes: 'Complete DJ setup for reception music and announcements'
      });
    }
  } else if (eventType === 'conference') {
    // Projection system
    const projector = findEquipmentByType(catalog, 'projector');
    if (projector) {
      recommendations.push({
        ...projector,
        quantity: 1,
        notes: 'For presentations and slides'
      });
    }
    
    // Screen
    const screen = findEquipmentByType(catalog, 'screen');
    if (screen) {
      recommendations.push({
        ...screen,
        quantity: 1,
        notes: 'Large format display for presentations'
      });
    }
    
    // Microphones
    const wirelessMic = findEquipmentByType(catalog, 'wireless microphone');
    if (wirelessMic) {
      recommendations.push({
        ...wirelessMic,
        quantity: 2,
        notes: 'For presenters and Q&A sessions'
      });
    }
    
    // Tabletop microphones
    const tabletopMic = findEquipmentByType(catalog, 'tabletop');
    if (tabletopMic) {
      recommendations.push({
        ...tabletopMic,
        quantity: 1,
        notes: 'For panel discussions or conference tables'
      });
    }
    
    // Audio system
    const speakers = findEquipmentByType(catalog, 'speaker');
    if (speakers) {
      recommendations.push({
        ...speakers,
        quantity: 1,
        notes: 'For clear audio throughout the venue'
      });
    }
  }
}

/**
 * Format a response message based on intent, recommendations and conversation history
 */
function createResponseMessage(intent, recommendations, previousRecommendations = []) {
  // If this is a follow-up and we have new recommendations
  if (intent.isFollowUp && recommendations.length > 0) {
    let message = "Based on your follow-up request, I recommend adding these additional items:\n\n";
    
    // Group recommendations by category
    const groupedRecommendations = recommendations.reduce((acc, item) => {
      const category = item.category || 'Other';
      if (!acc[category]) acc[category] = [];
      acc[category].push(item);
      return acc;
    }, {});
    
    // Build detailed message with explanations
    Object.entries(groupedRecommendations).forEach(([category, items]) => {
      message += `## ${category}\n`;
      
      items.forEach(item => {
        message += `- ${item.quantity} × ${item.name} - $${item.rate} each (${item.notes})\n`;
      });
      
      message += '\n';
    });
    
    // Add explanation of how this fits with previous recommendations
    if (previousRecommendations.length > 0) {
      message += "These items will complement your existing equipment selections and enhance your overall setup. ";
      
      if (intent.category === 'lighting') {
        message += "The additional lighting will create a more immersive atmosphere for your event.";
      } else if (intent.category === 'audio') {
        message += "The additional audio equipment will ensure better sound coverage and clarity.";
      } else if (intent.category === 'video') {
        message += "This video equipment will enhance your visual presentation capabilities.";
      } else if (intent.category === 'electrical') {
        message += "These power distribution items will ensure you have enough outlets for all your equipment.";
      }
    }
    
    return message;
  }
  
  // Otherwise use the original message formatting
  // Special case for electrical equipment
  if (intent.category === 'electrical' && intent.subcategory === 'power_strips') {
    const quantity = recommendations.length > 0 ? recommendations[0].quantity : intent.quantity || 1;
    
    return `For your event, I recommend:\n\n## Electrical Equipment\n- ${quantity} × Power Strip - 6 Outlet - $15 each (These will allow you to connect multiple devices to a single power source)\n\nThese power strips have surge protection and are suitable for connecting AV equipment safely.`;
  }
  
  // Standard message formatting for other equipment types
  let message = "Based on your requirements, here are my equipment recommendations:\n\n";
  
  // Group recommendations by category
  const groupedRecommendations = recommendations.reduce((acc, item) => {
    const category = item.category || 'Other';
    if (!acc[category]) acc[category] = [];
    acc[category].push(item);
    return acc;
  }, {});
  
  // Build detailed message with explanations
  Object.entries(groupedRecommendations).forEach(([category, items]) => {
    message += `## ${category}\n`;
    
    items.forEach(item => {
      message += `- ${item.quantity} × ${item.name} - $${item.rate} each (${item.notes})\n`;
    });
    
    message += '\n';
  });
  
  // Add contextual explanation based on intent
  if (intent.category === 'lighting' && intent.subcategory === 'uplights') {
    message += "The uplights will create beautiful ambient lighting around your venue. They can be set to match your event colors and will dramatically enhance the atmosphere.";
  } else if (intent.category === 'audio' && intent.subcategory === 'wireless_microphone') {
    message += "The wireless microphones will allow free movement during speeches or presentations, while the speaker system ensures everyone can hear clearly.";
  } else if (intent.category === 'video') {
    message += "This video setup will provide high-quality visual presentation capabilities, ideal for displaying presentations, videos, or images to your audience.";
  } else if (intent.category === 'event') {
    message += "This complete package provides all the essential equipment for your event, ensuring professional audio-visual capabilities throughout.";
  }
  
  return message;
}

/**
 * Find equipment in the catalog by type using flexible matching
 */
function findEquipmentByType(catalog, type) {
  const typeLower = type.toLowerCase();
  
  // First try more specific matches
  for (const item of catalog) {
    const nameLower = item.name.toLowerCase();
    
    // Direct keyword match prioritizing exact matches
    if (
      (typeLower === 'wireless microphone' && nameLower.includes('wireless') && nameLower.includes('microphone')) ||
      (typeLower === 'tabletop' && nameLower.includes('tabletop')) ||
      (typeLower === 'speaker' && nameLower.includes('speaker')) ||
      (typeLower === 'projector' && nameLower.includes('projector')) ||
      (typeLower === 'screen' && nameLower.includes('screen')) ||
      (typeLower === 'uplights' && (nameLower.includes('up light') || nameLower.includes('uplight'))) ||
      (typeLower === 'stage wash' && nameLower.includes('stage wash')) ||
      (typeLower === 'laptop' && nameLower.includes('laptop')) ||
      (typeLower === 'audio package' && nameLower.includes('audio package')) ||
      (typeLower === 'dj' && nameLower.includes('dj'))
    ) {
      return item;
    }
  }
  
  // Fallback to a more general search
  return catalog.find(item => item.name.toLowerCase().includes(typeLower));
}

/**
 * Get equipment catalog from db or fallback to mock data
 */
async function getEquipmentCatalog() {
  try {
    const equipmentResult = await db.query('SELECT * FROM equipment');
    if (equipmentResult.rows && equipmentResult.rows.length > 0) {
      return equipmentResult.rows;
    }
  } catch (error) {
    console.error('Database error fetching equipment:', error);
  }
  
  // Fallback to mock data
  return getMockEquipment();
}

/**
 * Extract quantity information from the prompt if available
 */
function estimateQuantity(prompt, defaultValue) {
  // Check for specific numbers (e.g., "3 microphones")
  const numberMatch = prompt.match(/(\d+)\s+(microphone|mic|light|uplight|speaker|projector|screen)/i);
  if (numberMatch) {
    return parseInt(numberMatch[1], 10);
  }
  
  // Check for quantity words
  if (prompt.includes('couple') || prompt.includes('few')) {
    return 2;
  }
  if (prompt.includes('several')) {
    return 3;
  }
  if (prompt.includes('many') || prompt.includes('lots')) {
    return 5;
  }
  
  return defaultValue;
}

/**
 * Try to extract context information from prompt
 */
function extractContext(prompt) {
  if (prompt.includes('wedding') || prompt.includes('ceremony') || prompt.includes('reception')) {
    return 'wedding';
  }
  if (prompt.includes('conference') || prompt.includes('meeting') || prompt.includes('presentation')) {
    return 'conference';
  }
  if (prompt.includes('party') || prompt.includes('celebration')) {
    return 'party';
  }
  if (prompt.includes('concert') || prompt.includes('performance')) {
    return 'performance';
  }
  
  return 'event';
}

/**
 * Get mock equipment data
 */
function getMockEquipment() {
  return [
    { id: 1, name: 'Projector - Standard', rate: 200, price: 200, category: 'Video' },
    { id: 2, name: 'Projector - HD', rate: 350, price: 350, category: 'Video' },
    { id: 3, name: 'Audio - Wireless Microphone', rate: 75, price: 75, category: 'Audio' },
    { id: 4, name: 'Audio - Tabletop Microphone', rate: 65, price: 65, category: 'Audio' },
    { id: 5, name: 'Audio - Powered Speaker Package', rate: 180, price: 180, category: 'Audio' },
    { id: 6, name: 'Audio - Line Array Speaker System', rate: 450, price: 450, category: 'Audio' },
    { id: 7, name: 'LED Screen 55"', rate: 250, price: 250, category: 'Video' },
    { id: 8, name: 'LED Screen 75"', rate: 450, price: 450, category: 'Video' },
    { id: 9, name: 'Video - Laptop', rate: 125, price: 125, category: 'Computer' },
    { id: 10, name: 'Video - HDMI Cable (6ft)', rate: 15, price: 15, category: 'Accessories' },
    { id: 11, name: 'Video - Switcher', rate: 175, price: 175, category: 'Video' },
    { id: 12, name: 'Flipchart with Markers', rate: 45, price: 45, category: 'Presentation' },
    { id: 13, name: 'Wi-Fi Dedicated Connection', rate: 150, price: 150, category: 'Network' },
    { id: 14, name: 'Podium with Microphone', rate: 125, price: 125, category: 'Furniture' },
    { id: 15, name: 'Basic Presentation Package', rate: 350, price: 350, category: 'Bundle' },
    { id: 16, name: 'Conference Audio Package', rate: 275, price: 275, category: 'Bundle' },
    { id: 17, name: 'Lighting - Basic Stage Wash', rate: 180, price: 180, category: 'Lighting' },
    { id: 18, name: 'Lighting - UP Lights', rate: 35, price: 35, category: 'Lighting' },
    { id: 19, name: '10\'6"x18\'8" Screen Kit - Front Projection', rate: 350, price: 350, category: 'Video' },
    { id: 20, name: 'DJ Booth Setup', rate: 275, price: 275, category: 'Entertainment' },
    // Add power strips to the catalog
    { id: 21, name: 'Power Strip - 6 Outlet', rate: 15, price: 15, category: 'Electrical' },
    { id: 22, name: 'Power Strip - 12 Outlet', rate: 25, price: 25, category: 'Electrical' },
    { id: 23, name: 'Extension Cord - 25ft', rate: 12, price: 12, category: 'Electrical' },
    { id: 24, name: 'Extension Cord - 50ft', rate: 18, price: 18, category: 'Electrical' },
  ];
}

/**
 * Extract previous recommendations from conversation history
 */
function extractPreviousRecommendations(conversationHistory) {
  if (!conversationHistory || !conversationHistory.length) {
    return [];
  }
  
  // Look for assistant messages that contain recommendations
  const previousRecommendations = [];
  
  for (const message of conversationHistory) {
    if (message.role === 'assistant' && message.items && Array.isArray(message.items)) {
      // Add these items to our tracking of what's already been recommended
      previousRecommendations.push(...message.items);
    }
  }
  
  return previousRecommendations;
}

/**
 * Determine if this is a follow-up question
 */
function isFollowUpQuestion(prompt) {
  return prompt.match(/\badd\b/) || 
         prompt.match(/\bmore\b/) || 
         prompt.match(/\balso\b/) ||
         prompt.match(/\band\b/) ||
         prompt.match(/\binstead\b/) ||
         prompt.match(/\breplace\b/) ||
         prompt.match(/\bchange\b/) ||
         prompt.match(/\bwhat about\b/) ||
         prompt.match(/\bcan you\b/) ||
         prompt.match(/\bhow about\b/) ||
         prompt.length < 15; // Short queries are likely follow-ups
}

/**
 * Determine specific lighting type based on prompt
 */
function determineSpecificLightingType(prompt) {
  if (prompt.match(/\buplight(s)?\b/) || prompt.match(/\bup light(s)?\b/)) {
    return 'uplights';
  } else if (prompt.match(/\bstage\b/)) {
    return 'stage_lighting';
  } else if (prompt.match(/\bspot(light)?(s)?\b/)) {
    return 'spotlight';
  } else {
    return 'general_lighting';
  }
}

/**
 * Extract event context from conversation history
 */
function extractEventContextFromHistory(conversationHistory) {
  if (!conversationHistory || !conversationHistory.length) {
    return null;
  }
  
  // Look through conversation history for event type indicators
  for (const message of conversationHistory) {
    const msgText = message.content?.toLowerCase() || '';
    
    if (msgText.includes('wedding') || msgText.includes('ceremony') || msgText.includes('reception')) {
      return 'wedding';
    } else if (msgText.includes('conference') || msgText.includes('meeting') || msgText.includes('presentation')) {
      return 'conference';
    } else if (msgText.includes('party') || msgText.includes('celebration')) {
      return 'party';
    } else if (msgText.includes('concert') || msgText.includes('performance')) {
      return 'performance';
    }
  }
  
  // Check for intent objects in assistant responses
  for (const message of conversationHistory) {
    if (message.role === 'assistant' && message.intent) {
      return message.intent.context || message.intent.category;
    }
  }
  
  return 'event'; // Default context
} 