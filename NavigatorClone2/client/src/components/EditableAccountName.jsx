import React, { useState, useEffect } from 'react';
import { TextField } from '@material-ui/core';

const EditableAccountName = ({ value, onChange }) => {
  const [fieldValue, setFieldValue] = useState(value || '');
  
  useEffect(() => {
    setFieldValue(value || '');
  }, [value]);
  
  const handleChange = (e) => {
    const newValue = e.target.value;
    setFieldValue(newValue);
    if (onChange) {
      onChange(newValue);
    }
  };
  
  return (
    <TextField
      value={fieldValue}
      onChange={handleChange}
      fullWidth
      variant="outlined"
      size="small"
      margin="dense"
      style={{
        backgroundColor: "#ffffff"
      }}
      inputProps={{
        style: {
          cursor: "text",
          backgroundColor: "#ffffff"
        }
      }}
    />
  );
};

export default EditableAccountName; 