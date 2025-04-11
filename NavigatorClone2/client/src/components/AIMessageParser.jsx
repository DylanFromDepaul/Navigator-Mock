import React from 'react';
import { Typography, Box } from '@material-ui/core';

// A simple component to render AI messages with basic formatting
const AIMessageParser = ({ content, className }) => {
  // Split the content by newlines
  const lines = content.split('\n');
  
  // Process lines to handle basic markdown
  return (
    <div className={className}>
      {lines.map((line, index) => {
        // Handle headers (## Header)
        if (line.startsWith('## ')) {
          return (
            <Typography key={index} variant="subtitle1" style={{ fontWeight: 600, marginTop: 12, marginBottom: 4 }}>
              {line.substring(3)}
            </Typography>
          );
        }
        
        // Handle bullet points (- Item)
        if (line.trim().startsWith('- ')) {
          return (
            <Box key={index} display="flex" ml={1} mb={0.5}>
              <Box mr={1}>•</Box>
              <Box>{line.substring(line.indexOf('- ') + 2)}</Box>
            </Box>
          );
        }
        
        // Handle empty lines
        if (line.trim() === '') {
          return <Box key={index} mb={1} />;
        }
        
        // Regular paragraph
        return <Typography key={index} variant="body2" style={{ marginBottom: 8 }}>{line}</Typography>;
      })}
    </div>
  );
};

export default AIMessageParser; 