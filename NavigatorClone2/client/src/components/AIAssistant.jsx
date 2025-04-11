import React, { useState, useRef, useEffect } from 'react';
import { 
  Box, Typography, TextField, Button, Paper, 
  Divider, makeStyles, CircularProgress, IconButton,
  List, ListItem, ListItemText, ListItemSecondaryAction,
  Chip, Tooltip, Collapse, Badge
} from '@material-ui/core';
import { 
  Send, Add, ChatBubbleOutline, ShoppingCart, EditOutlined,
  ExpandMore, ExpandLess, CheckCircle, InfoOutlined
} from '@material-ui/icons';
import { generateEquipmentRecommendations } from '../services/aiService';
import AIMessageParser from './AIMessageParser';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    overflow: 'hidden',
    backgroundColor: '#ffffff',
  },
  header: {
    padding: theme.spacing(1.5),
    borderBottom: `1px solid ${theme.palette.divider}`,
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
  },
  headerTitle: {
    fontWeight: 500,
    display: 'flex',
    alignItems: 'center',
    '& svg': {
      marginRight: theme.spacing(1),
    }
  },
  content: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  chatHistory: {
    flex: '0 0 auto',
    maxHeight: '35%',
    overflowY: 'auto',
    padding: theme.spacing(1),
    backgroundColor: '#f5f8fa',
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
  message: {
    padding: theme.spacing(1),
    marginBottom: theme.spacing(1),
    borderRadius: theme.shape.borderRadius,
    maxWidth: '85%',
    fontSize: '0.875rem',
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    borderRadius: '18px 18px 4px 18px',
    padding: theme.spacing(1, 2),
    maxWidth: '80%',
    marginBottom: theme.spacing(1),
  },
  aiMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#f1f1f1',
    borderRadius: '18px 18px 18px 4px',
    padding: theme.spacing(1.5, 2),
    maxWidth: '85%',
    marginBottom: theme.spacing(1),
  },
  recommendationsContainer: {
    flex: 1,
    overflowY: 'auto',
    padding: theme.spacing(0.5),
  },
  categoryHeader: {
    padding: theme.spacing(0.5, 1),
    fontSize: '0.8rem',
    fontWeight: 'bold',
    color: theme.palette.text.secondary,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    marginTop: theme.spacing(1),
  },
  itemCard: {
    marginBottom: theme.spacing(0.75),
    borderRadius: theme.shape.borderRadius,
    border: `1px solid ${theme.palette.divider}`,
    backgroundColor: '#ffffff',
    transition: 'transform 0.2s, box-shadow 0.2s',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: theme.shadows[2],
    },
  },
  itemContent: {
    padding: theme.spacing(1),
  },
  itemName: {
    fontSize: '0.875rem',
    fontWeight: 500,
    marginBottom: theme.spacing(0.5),
    lineHeight: 1.2,
  },
  itemMeta: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '0.75rem',
    color: theme.palette.text.secondary,
  },
  price: {
    fontWeight: 500,
    color: theme.palette.success.main,
  },
  addButton: {
    minWidth: 'auto',
    padding: theme.spacing(0.5),
    marginLeft: theme.spacing(1),
  },
  inputArea: {
    padding: theme.spacing(1.5),
    backgroundColor: '#fff',
    borderTop: `1px solid ${theme.palette.divider}`,
    display: 'flex',
    flexDirection: 'column',
  },
  inputField: {
    flex: 1,
    marginBottom: theme.spacing(1),
    '& .MuiInputBase-root': {
      borderRadius: theme.shape.borderRadius,
      fontSize: '0.9rem',
    },
    '& .MuiOutlinedInput-multiline': {
      padding: theme.spacing(1.5),
    },
  },
  sendButton: {
    alignSelf: 'flex-end',
    minWidth: '80px',
  },
  addAllButton: {
    margin: theme.spacing(1),
    borderRadius: 20,
    boxShadow: theme.shadows[2],
    fontWeight: 500,
  },
  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing(2),
    color: theme.palette.text.secondary,
    textAlign: 'center',
    height: '100%',
  },
  statusMessage: {
    padding: theme.spacing(1),
    margin: theme.spacing(1, 0),
    fontSize: '0.75rem',
    textAlign: 'center',
    backgroundColor: theme.palette.success.light,
    color: theme.palette.success.dark,
    borderRadius: theme.shape.borderRadius,
  },
  loading: {
    display: 'flex',
    justifyContent: 'center',
    padding: theme.spacing(2),
  },
  messageContainer: {
    display: 'flex',
    flexDirection: 'column',
    margin: theme.spacing(0.5, 0),
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing(2),
  },
  markdown: {
    '& p': {
      margin: '0.5em 0',
    },
    '& h2, & h3': {
      margin: '0.75em 0 0.5em 0',
      fontSize: '1rem',
      fontWeight: 600,
    },
    '& ul, & ol': {
      paddingLeft: '1.5em',
      margin: '0.5em 0',
    },
    '& li': {
      margin: '0.25em 0',
    },
    '& code': {
      backgroundColor: 'rgba(0,0,0,0.05)',
      padding: '0.2em 0.4em',
      borderRadius: '3px',
      fontSize: '0.85em',
    },
  },
  typingIndicator: {
    display: 'flex',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#f1f1f1',
    borderRadius: '18px',
    padding: theme.spacing(0.8, 2),
    margin: theme.spacing(0.5, 0),
    '& .dot': {
      width: 8,
      height: 8,
      borderRadius: '50%',
      backgroundColor: '#888',
      margin: '0 2px',
      animation: '$bounce 1.5s infinite ease-in-out',
    },
    '& .dot:nth-child(1)': {
      animationDelay: '0s',
    },
    '& .dot:nth-child(2)': {
      animationDelay: '0.2s',
    },
    '& .dot:nth-child(3)': {
      animationDelay: '0.4s',
    },
  },
  '@keyframes bounce': {
    '0%, 60%, 100%': {
      transform: 'translateY(0)',
    },
    '30%': {
      transform: 'translateY(-4px)',
    },
  },
  categoryChip: {
    marginRight: theme.spacing(1),
    marginBottom: theme.spacing(0.5),
    fontSize: '0.7rem',
  },
  infoButton: {
    padding: theme.spacing(0.25),
  },
  recommendationItem: {
    marginBottom: theme.spacing(1),
    transition: 'all 0.2s ease',
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: theme.shape.borderRadius,
    '&:hover': {
      borderColor: theme.palette.primary.main,
      boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
    },
  },
  recommendationHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing(1, 1.5),
    cursor: 'pointer',
    backgroundColor: 'rgba(0,0,0,0.02)',
  },
  recommendationName: {
    fontWeight: 500,
    fontSize: '0.9rem',
  },
  recommendationDetails: {
    padding: theme.spacing(1, 1.5),
  },
  note: {
    fontSize: '0.75rem',
    fontStyle: 'italic',
    color: theme.palette.text.secondary,
    marginTop: theme.spacing(0.5),
  },
  badge: {
    right: -16,
    top: 8,
  },
  suggestedTitle: {
    fontSize: '0.8rem',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    color: theme.palette.primary.main,
    margin: theme.spacing(1, 0, 0.5, 1),
  },
  inCart: {
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
  },
  categoryBadge: {
    marginLeft: theme.spacing(1),
    fontSize: '0.7rem',
  },
  emptyChatPrompt: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    '& svg': {
      fontSize: '3rem',
      marginBottom: theme.spacing(1),
      opacity: 0.5,
    },
  },
  itemDetails: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(1),
    marginTop: theme.spacing(1),
  },
  recommendationImage: {
    width: '100%',
    height: 120,
    backgroundColor: '#f5f5f5',
    backgroundSize: 'contain',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    borderRadius: theme.shape.borderRadius,
    marginBottom: theme.spacing(1),
  },
  equipmentSpecs: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: theme.spacing(1),
    marginTop: theme.spacing(1),
  },
  specChip: {
    backgroundColor: '#f1f8ff',
    fontSize: '0.7rem',
  },
  note: {
    fontSize: '0.85rem',
    fontStyle: 'italic',
    color: theme.palette.text.secondary,
    backgroundColor: '#fffde7',
    padding: theme.spacing(1),
    borderRadius: theme.shape.borderRadius,
    borderLeft: `3px solid ${theme.palette.warning.light}`,
  },
  debugInfo: {
    backgroundColor: '#f5f5f5',
    padding: theme.spacing(1),
    margin: theme.spacing(1, 0),
    borderRadius: theme.shape.borderRadius,
    border: '1px dashed #ccc',
    fontSize: '0.75rem',
    fontFamily: 'monospace',
    overflowX: 'auto',
  },
  helpMessage: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    '& svg': {
      fontSize: '3rem',
      marginBottom: theme.spacing(1),
      opacity: 0.5,
    },
  },
  emptyRecommendations: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing(2),
  },
  recommendationsArea: {
    flex: 1,
    overflowY: 'auto',
    padding: theme.spacing(0.5),
  },
  categorySection: {
    marginBottom: theme.spacing(1),
  },
}));

const AIAssistant = ({ jobId, orderId, onAddEquipment, equipmentCatalog = [] }) => {
  const classes = useStyles();
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [showTypingIndicator, setShowTypingIndicator] = useState(false);
  const [conversationHistory, setConversationHistory] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [statusMessage, setStatusMessage] = useState('');
  const [expandedItems, setExpandedItems] = useState({});
  const [selectedItems, setSelectedItems] = useState([]);
  const chatContainerRef = useRef(null);
  const [hasSentFirstMessage, setHasSentFirstMessage] = useState(false);
  
  // Scroll to the bottom of the chat container when the conversation updates
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [conversationHistory, showTypingIndicator]);
  
  // Initialize with a greeting when the component mounts
  useEffect(() => {
    if (!hasSentFirstMessage && conversationHistory.length === 0) {
      setConversationHistory([
        { 
          role: 'assistant', 
          content: "Hi! I'm your AV equipment assistant. Tell me about your event, and I'll help you select the perfect equipment. What type of event are you planning?" 
        }
      ]);
      setHasSentFirstMessage(true);
    }
  }, [hasSentFirstMessage, conversationHistory]);
  
  // Toggle expanded state for a recommendation item
  const toggleExpanded = (itemId) => {
    setExpandedItems(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };
  
  // Handle adding an equipment item to the order
  const handleAddEquipment = (item) => {
    if (onAddEquipment) {
      onAddEquipment(item);
      // Add to selected items to show it's been added
      setSelectedItems(prev => [...prev, item.id]);
    }
  };
  
  // Handle sending a message to the AI assistant
  const handleSendMessage = async () => {
    if (!inputValue.trim() || loading) return;
    
    const userMessage = inputValue.trim();
    const updatedHistory = [
      ...conversationHistory, 
      { role: 'user', content: userMessage }
    ];
    
    setConversationHistory(updatedHistory);
    setInputValue('');
    setLoading(true);
    setRecommendations([]);
    setStatusMessage('');
    
    try {
      console.log('Sending request to AI service');
      // Pass conversation for context
      const result = await generateEquipmentRecommendations(
        userMessage, 
        equipmentCatalog, 
        jobId, 
        orderId,
        updatedHistory
      );
      
      console.log('Received AI response:', result);
      
      // Add the AI response to conversation history
      const newHistory = [
        ...updatedHistory,
        { role: 'assistant', content: result.message || "I'm not sure what equipment you need. Could you provide more details?" }
      ];
      
      setConversationHistory(newHistory);
      
      // Only set recommendations if we have valid ones
      if (result.recommendations && result.recommendations.length > 0) {
        console.log('Setting recommendations:', result.recommendations);
        setRecommendations(result.recommendations);
      } else {
        console.log('No recommendations received');
        // Clear any existing recommendations
        setRecommendations([]);
      }
      
      scrollToBottom();
    } catch (error) {
      console.error('Error getting recommendations:', error);
      setStatusMessage('Sorry, I had trouble processing your request. Please try again.');
      
      const newHistory = [
        ...updatedHistory,
        { 
          role: 'assistant', 
          content: "I apologize, but I encountered an issue processing your request. Could you try rephrasing your question? For example, 'I need uplights for my wedding' or 'What microphones do you recommend for a conference?'"
        }
      ];
      
      setConversationHistory(newHistory);
    } finally {
      setLoading(false);
    }
  };
  
  // Scroll chat container to bottom
  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      setTimeout(() => {
        chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
      }, 100);
    }
  };
  
  // Render an empty conversation starter
  const renderEmptyState = () => (
    <div className={classes.emptyChatPrompt}>
      <InfoOutlined color="disabled" />
      <Typography variant="body2" gutterBottom>
        I'm your AI equipment assistant
      </Typography>
      <Typography variant="caption">
        Ask me to recommend equipment for your event, or start with a specific need like "I need microphones for a panel discussion"
      </Typography>
    </div>
  );
  
  return (
    <div className={classes.root}>
      <div className={classes.header}>
        <Typography variant="h6" className={classes.headerTitle}>
          <ChatBubbleOutline />
          AI Assistant
        </Typography>
      </div>
      
      <div className={classes.content}>
        {/* Conversation History */}
        <div className={classes.chatHistory} ref={chatContainerRef}>
          {conversationHistory.map((msg, index) => (
            <div 
              key={index} 
              className={classes.messageContainer}
            >
              <div className={msg.role === 'user' ? classes.userMessage : classes.aiMessage}>
                {msg.role === 'assistant' ? (
                  <AIMessageParser 
                    content={msg.content} 
                    className={classes.markdown} 
                  />
                ) : (
                  msg.content
                )}
              </div>
            </div>
          ))}
          
          {/* Typing indicator animation */}
          {showTypingIndicator && (
            <div className={classes.typingIndicator}>
              <div className="dot"></div>
              <div className="dot"></div>
              <div className="dot"></div>
            </div>
          )}
          
          {conversationHistory.length === 0 && renderEmptyState()}
        </div>
        
        <Divider />
        
        {/* Equipment Recommendations */}
        {recommendations.length > 0 ? (
          <div className={classes.recommendationsArea}>
            <Typography className={classes.suggestedTitle}>
              Suggested Equipment
            </Typography>
            
            {/* Category filters */}
            <Box display="flex" flexWrap="wrap" mb={1} ml={1}>
              {Array.from(new Set(recommendations.map(item => item.categoryId))).map(category => (
                <Chip 
                  key={category}
                  label={category} 
                  size="small"
                  className={classes.categoryBadge}
                  color="primary"
                  variant="outlined"
                />
              ))}
            </Box>
            
            {/* Recommendation items - grouped by category */}
            {Object.entries(recommendations.reduce((acc, item) => {
              const category = item.categoryId || 'Other';
              if (!acc[category]) acc[category] = [];
              acc[category].push(item);
              return acc;
            }, {})).map(([category, items]) => (
              <div key={category} className={classes.categorySection}>
                <div className={classes.categoryHeader}>
                  {category}
                </div>
                
                {items.map(item => {
                  const isSelected = selectedItems.includes(item.id);
                  const isExpanded = expandedItems[item.id];
                  
                  return (
                    <Paper 
                      key={item.id} 
                      className={`${classes.recommendationItem} ${isSelected ? classes.inCart : ''}`}
                      elevation={0}
                    >
                      <div 
                        className={classes.recommendationHeader}
                        onClick={() => toggleExpanded(item.id)}
                      >
                        <Typography className={classes.recommendationName}>
                          {item.name}
                          {isSelected && (
                            <Badge 
                              color="primary"
                              badgeContent={<CheckCircle fontSize="small" />}
                              className={classes.badge}
                            />
                          )}
                        </Typography>
                        <div>
                          <Typography variant="body2" component="span">
                            {item.quantity}x ${item.rate}
                          </Typography>
                          <IconButton size="small">
                            {isExpanded ? <ExpandLess /> : <ExpandMore />}
                          </IconButton>
                        </div>
                      </div>
                      
                      <Collapse in={isExpanded}>
                        <div className={classes.recommendationDetails}>
                          {item.notes && (
                            <Typography className={classes.note}>
                              {item.notes}
                            </Typography>
                          )}
                          
                          <div className={classes.equipmentSpecs}>
                            <Chip 
                              size="small" 
                              className={classes.specChip} 
                              label={`Category: ${item.categoryId || 'General'}`} 
                            />
                            <Chip 
                              size="small" 
                              className={classes.specChip} 
                              label={`Rate: $${item.rate}/day`} 
                            />
                            <Chip 
                              size="small" 
                              className={classes.specChip} 
                              label={`Total: $${item.price || item.rate * item.quantity}`} 
                            />
                          </div>
                          
                          <Box display="flex" justifyContent="flex-end" mt={1}>
                            <Button
                              size="small"
                              color="primary"
                              variant="contained"
                              startIcon={<Add fontSize="small" />}
                              onClick={() => handleAddEquipment(item)}
                              disabled={isSelected}
                            >
                              {isSelected ? 'Added' : 'Add to Order'}
                            </Button>
                          </Box>
                        </div>
                      </Collapse>
                    </Paper>
                  );
                })}
              </div>
            ))}
          </div>
        ) : (
          <div className={classes.emptyRecommendations}>
            {loading ? (
              <div className={classes.loadingContainer}>
                <CircularProgress size={24} />
                <Typography variant="body2">Finding the best equipment...</Typography>
              </div>
            ) : statusMessage ? (
              <div className={classes.statusMessage}>
                {statusMessage}
              </div>
            ) : conversationHistory.length > 1 ? (
              <div className={classes.helpMessage}>
                <Typography variant="body2">
                  <InfoOutlined fontSize="small" style={{ marginRight: 8, verticalAlign: 'middle' }} />
                  Try asking for specific equipment like "wireless microphones" or "uplights for a wedding"
                </Typography>
              </div>
            ) : null}
          </div>
        )}
      </div>
      
      <div className={classes.inputArea}>
        <TextField
          className={classes.inputField}
          placeholder="Ask about equipment for your event..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          variant="outlined"
          fullWidth
          multiline
          rows={2}
          rowsMax={4}
          onKeyPress={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSendMessage();
            }
          }}
          disabled={loading}
        />
        <Button
          className={classes.sendButton}
          color="primary"
          variant="contained"
          onClick={handleSendMessage}
          disabled={loading || !inputValue.trim()}
          endIcon={<Send />}
        >
          Send
        </Button>
      </div>
      
      {process.env.NODE_ENV === 'development' && (
        <div className={classes.debugInfo}>
          <div><strong>Status</strong>: {loading ? 'Loading...' : 'Ready'}</div>
          <div><strong>Has recommendations</strong>: {recommendations.length > 0 ? 'Yes' : 'No'}</div>
          <div><strong>Recommendations count</strong>: {recommendations.length}</div>
          <div><strong>Last request</strong>: {inputValue || '(none)'}</div>
        </div>
      )}
    </div>
  );
};

export default AIAssistant; 