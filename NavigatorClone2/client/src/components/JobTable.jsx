import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { 
  Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Paper, Button 
} from '@material-ui/core';
import { useHistory } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  tableContainer: {
    marginTop: theme.spacing(2),
  },
  table: {
    minWidth: 650,
  },
  headerCell: {
    backgroundColor: '#f5f5f5',
    fontWeight: 'bold',
  },
  actionCell: {
    width: 120,
  },
  link: {
    cursor: 'pointer',
    color: theme.palette.primary.main,
    textDecoration: 'underline',
  }
}));

const JobTable = ({ jobs, loading, orderId }) => {
  const classes = useStyles();
  const history = useHistory();
  
  if (loading) {
    return <div>Loading jobs...</div>;
  }
  
  const handleViewJob = (jobId) => {
    history.push(`/jobs/${jobId}`);
  };
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <TableContainer component={Paper} className={classes.tableContainer}>
      <Table className={classes.table} size="small">
        <TableHead>
          <TableRow>
            <TableCell className={classes.headerCell}>Job #</TableCell>
            <TableCell className={classes.headerCell}>Name</TableCell>
            <TableCell className={classes.headerCell}>Room</TableCell>
            <TableCell className={classes.headerCell}>Start Date</TableCell>
            <TableCell className={classes.headerCell}>End Date</TableCell>
            <TableCell className={classes.headerCell}>Status</TableCell>
            <TableCell className={classes.headerCell}>Total</TableCell>
            <TableCell className={classes.headerCell}>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {jobs.map((job) => (
            <TableRow key={job.job_id}>
              <TableCell className={classes.link} onClick={() => handleViewJob(job.job_id)}>
                {job.job_id}
              </TableCell>
              <TableCell>{job.name}</TableCell>
              <TableCell>{job.room}</TableCell>
              <TableCell>{formatDate(job.start_time)}</TableCell>
              <TableCell>{formatDate(job.end_time)}</TableCell>
              <TableCell>{job.status}</TableCell>
              <TableCell>${job.job_total.toLocaleString()}</TableCell>
              <TableCell className={classes.actionCell}>
                <Button 
                  size="small" 
                  variant="contained" 
                  color="primary"
                  onClick={() => handleViewJob(job.job_id)}
                >
                  View
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default JobTable; 