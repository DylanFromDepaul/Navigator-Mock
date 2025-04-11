import React from 'react';
import { 
  Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Paper, Link,
  makeStyles
} from '@material-ui/core';
import { formatDate, formatCurrency } from '../utils/formatters';

const useStyles = makeStyles((theme) => ({
  table: {
    minWidth: 650,
  },
  tableContainer: {
    boxShadow: 'none',
    border: '1px solid #e0e0e0',
  },
  headerCell: {
    backgroundColor: '#f5f5f5',
    fontWeight: 600,
    paddingTop: theme.spacing(1.5),
    paddingBottom: theme.spacing(1.5),
  },
  tableRow: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
  },
  link: {
    color: '#1976d2',
    textDecoration: 'none',
    '&:hover': {
      textDecoration: 'underline',
    },
  },
  cell: {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
}));

const OrderTable = ({ orders, loading }) => {
  const classes = useStyles();
  
  if (loading) {
    return <div>Loading orders...</div>;
  }
  
  return (
    <TableContainer component={Paper} className={classes.tableContainer}>
      <Table className={classes.table} size="small">
        <TableHead>
          <TableRow>
            <TableCell className={classes.headerCell}>Order #</TableCell>
            <TableCell className={classes.headerCell}>Order Name</TableCell>
            <TableCell className={classes.headerCell}>Account Name</TableCell>
            <TableCell className={classes.headerCell}>Start Date</TableCell>
            <TableCell className={classes.headerCell}>End Date</TableCell>
            <TableCell className={classes.headerCell}>Status</TableCell>
            <TableCell className={classes.headerCell}>Type</TableCell>
            <TableCell className={classes.headerCell}>Net Total</TableCell>
            <TableCell className={classes.headerCell}>Bill To Contact</TableCell>
            <TableCell className={classes.headerCell}>Sales Manager</TableCell>
            <TableCell className={classes.headerCell}>Probability</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {orders.length === 0 ? (
            <TableRow>
              <TableCell colSpan={11} align="center">No orders found</TableCell>
            </TableRow>
          ) : (
            orders.map((order) => (
              <TableRow key={order.order_id} className={classes.tableRow}>
                <TableCell className={classes.cell}>
                  <Link className={classes.link} href={`/orders/${order.order_id}`}>
                    {order.order_number}
                  </Link>
                </TableCell>
                <TableCell className={classes.cell}>
                  <Link className={classes.link} href={`/orders/${order.order_id}`}>
                    {order.order_name}
                  </Link>
                </TableCell>
                <TableCell className={classes.cell}>{order.account_name}</TableCell>
                <TableCell className={classes.cell}>{formatDate(order.start_date)}</TableCell>
                <TableCell className={classes.cell}>{formatDate(order.end_date)}</TableCell>
                <TableCell className={classes.cell}>{order.status}</TableCell>
                <TableCell className={classes.cell}>{order.type}</TableCell>
                <TableCell className={classes.cell}>{formatCurrency(order.net_total)}</TableCell>
                <TableCell className={classes.cell}>{order.bill_to_contact}</TableCell>
                <TableCell className={classes.cell}>{order.sales_manager}</TableCell>
                <TableCell className={classes.cell}>{order.probability}%</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default OrderTable; 