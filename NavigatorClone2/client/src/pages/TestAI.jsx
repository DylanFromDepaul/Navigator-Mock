import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Paper, CircularProgress } from '@material-ui/core';

const TestAI = () => {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Add user message to history
      const newHistory = [...history, { role: 'user', content: input }];
      
      // Make direct API call
      const result = await fetch('/api/ai/recommendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: input,
          conversationHistory: history
        })
      }).then(res => res.json());
      
      // Update history with AI response
      newHistory.push({
        role: 'assistant', 
        content: result.message,
        items: result.items
      });
      
      setHistory(newHistory);
      setResponse(result);
      setInput('');
    } catch (error) {
      console.error('Error testing AI:', error);
      setResponse({ error: 'Failed to get response' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>AI Testing Page</Typography>
      
      <Paper elevation={3}>
        <Box p={2} mb={3} maxHeight="60vh" overflow="auto">
          {history.map((msg, i) => (
            <Box key={i} mb={2} p={1} bgcolor={msg.role === 'user' ? '#e3f2fd' : '#f1f8e9'}>
              <Typography variant="subtitle2">{msg.role === 'user' ? 'You' : 'AI'}:</Typography>
              <Typography>{msg.content}</Typography>
              {msg.items && (
                <Box mt={1}>
                  <Typography variant="subtitle2">Recommendations:</Typography>
                  {msg.items.map((item, j) => (
                    <Typography key={j} variant="body2">• {item.quantity} × {item.name}</Typography>
                  ))}
                </Box>
              )}
            </Box>
          ))}
        </Box>
      </Paper>
      
      <form onSubmit={handleSubmit}>
        <Box display="flex" mt={2}>
          <TextField
            fullWidth
            variant="outlined"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask for equipment recommendations..."
            disabled={loading}
          />
          <Button 
            type="submit" 
            variant="contained" 
            color="primary" 
            disabled={loading || !input.trim()}
            style={{ marginLeft: 8 }}
          >
            {loading ? <CircularProgress size={24} /> : 'Send'}
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default TestAI; 