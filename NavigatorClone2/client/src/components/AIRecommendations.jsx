import React, { useState, useEffect } from 'react';
import { getAIRecommendations } from '../services/api';

const AIRecommendations = ({ jobId, orderId, onAddRecommendations }) => {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [conversationHistory, setConversationHistory] = useState([]);
  const [currentRecommendation, setCurrentRecommendation] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!input.trim()) return;
    
    setLoading(true);
    setError(null);
    
    // Add user message to conversation history
    const userMessage = {
      role: 'user',
      content: input
    };
    
    const updatedHistory = [...conversationHistory, userMessage];
    
    try {
      // Get recommendations from AI with conversation history
      const result = await getAIRecommendations(input, conversationHistory, jobId, orderId);
      
      // Create assistant message object with response
      const assistantMessage = {
        role: 'assistant',
        content: result.message,
        items: result.items,
        intent: result.intent // If your backend returns this
      };
      
      // Update conversation history with both messages
      setConversationHistory([...updatedHistory, assistantMessage]);
      setCurrentRecommendation(result);
      setInput('');
    } catch (err) {
      setError('Failed to get recommendations. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Rest of component...
}; 