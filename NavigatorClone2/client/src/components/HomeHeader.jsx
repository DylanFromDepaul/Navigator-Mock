import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';
import NavigatorLogo from '../assets/navigator-logo.png';

const useStyles = makeStyles((theme) => ({
  header: {
    display: 'flex',
    alignItems: 'center',
    padding: '8px',
    backgroundColor: '#ffffff',
    borderBottom: '1px solid #ccc',
  },
  logo: {
    height: 36,
    marginRight: theme.spacing(2),
  },
  logoContainer: {
    marginRight: 'auto'
  }
}));

const HomeHeader = () => {
  const classes = useStyles();
  
  return (
    <div className={classes.header}>
      <div className={classes.logoContainer}>
        <Link to="/">
          <img src={NavigatorLogo} alt="Navigator Logo" className={classes.logo} />
        </Link>
      </div>
      <span>2621 - Marriott Marquis Chicago</span>
    </div>
  );
};

export default HomeHeader; 