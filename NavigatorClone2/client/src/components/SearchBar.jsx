import React, { useState } from 'react';
import { 
  Paper, Grid, TextField, Button, Box,
  Typography, makeStyles
} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  searchSection: {
    padding: theme.spacing(2),
    marginBottom: theme.spacing(2),
    backgroundColor: '#f9f9f9',
    border: '1px solid #e0e0e0',
  },
  form: {
    width: '100%',
  },
  searchButton: {
    marginRight: theme.spacing(1),
    backgroundColor: '#4caf50',
    color: 'white',
    '&:hover': {
      backgroundColor: '#43a047',
    },
  },
  resetButton: {
    backgroundColor: '#ff9800',
    color: 'white',
    '&:hover': {
      backgroundColor: '#f57c00',
    },
  },
  title: {
    marginBottom: theme.spacing(2),
    borderBottom: '1px solid #e0e0e0',
    paddingBottom: theme.spacing(1),
  },
}));

const SearchBar = ({ type, onSearch }) => {
  const classes = useStyles();
  const [searchValues, setSearchValues] = useState({});

  const handleChange = (e) => {
    setSearchValues({
      ...searchValues,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(searchValues);
  };

  const handleReset = () => {
    setSearchValues({});
    onSearch({});
  };

  return (
    <Paper elevation={0} className={classes.searchSection}>
      <Typography variant="h6" className={classes.title}>
        Search Criteria
      </Typography>
      
      <form onSubmit={handleSubmit} className={classes.form}>
        <Grid container spacing={2}>
          {type === 'order' ? (
            <>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  size="small"
                  variant="outlined"
                  label="Order Number"
                  name="order_number"
                  value={searchValues.order_number || ''}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  size="small"
                  variant="outlined"
                  label="Order Name"
                  name="order_name"
                  value={searchValues.order_name || ''}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  size="small"
                  variant="outlined"
                  label="Account Name"
                  name="account_name"
                  value={searchValues.account_name || ''}
                  onChange={handleChange}
                />
              </Grid>
            </>
          ) : (
            <>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  size="small"
                  variant="outlined"
                  label="Job Number"
                  name="job_number"
                  value={searchValues.job_number || ''}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  size="small"
                  variant="outlined"
                  label="Job Name"
                  name="job_name"
                  value={searchValues.job_name || ''}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  size="small"
                  variant="outlined"
                  label="Order Name"
                  name="order_name"
                  value={searchValues.order_name || ''}
                  onChange={handleChange}
                />
              </Grid>
            </>
          )}
          
          <Grid item xs={12}>
            <Box display="flex" justifyContent="flex-start">
              <Button 
                type="submit" 
                variant="contained" 
                className={classes.searchButton}
              >
                Search
              </Button>
              <Button 
                type="button" 
                variant="contained" 
                className={classes.resetButton}
                onClick={handleReset}
              >
                Reset
              </Button>
            </Box>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
};

export default SearchBar; 