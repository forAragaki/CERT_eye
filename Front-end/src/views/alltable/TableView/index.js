import React from 'react';
import { Link } from 'react-router-dom';
import {
  Container,
  Grid,
  makeStyles
} from '@material-ui/core';
import Page from 'src/components/Page';
import EnhancedTable from './temp.js';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3)
  }
}));
// const classes = useStyles();
const TableView =()=>{
  const classes = useStyles();
  // callback(selected){
  //   console.console.log(selected);
  // };
  return (
    <div style={{width:'1000px',margin:'auto',backgroundColor:'#FFFFFF'}}>
    <div style={{'display':'block'}}>
    <EnhancedTable/>
    </div>
    </div>
  );
};
export default TableView;