import React from 'react';
import OrderPage from './OrderPage.jsx';

const OrderPageNew = (props) => {
  console.log('Using OrderPage component');
  
  // Simply pass through to the original OrderPage component without the red bar
  return <OrderPage {...props} />;
};

export default OrderPageNew; 