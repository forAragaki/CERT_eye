import React from 'react';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import {
  AppBar,
  Button,
  Toolbar,
  Avatar,
  makeStyles
} from '@material-ui/core';
import Logo from 'src/components/Logo';

// const useStyles = makeStyles(({
//   root: {},
//   toolbar: {
//     height: 64
//   }
// }));
const user = {
  avatar: 'static/images/avatars/CERT_EYE.png',
  // jobTitle: 'Senior Developer',
  name: 'CERT-EYE'
};
const useStyles = makeStyles((theme) => ({
  root: {
  },
  // menuButton: {
  //   marginRight: theme.spacing(2),
  // },
}));
const TopBar = ({ className, ...rest }) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
    <AppBar>
    {/* <AppBar
      className={clsx(classes.root, className)}
      elevation={0}
      {...rest}
    > */
    }
      <Toolbar className={classes.toolbar}>
        <div style={{display:'block',float:'left'}} id="logo">
        {/* <a href="/certeye/">
        <img scr={require("static/images/avatars/CERT_EYE.png")} alt="CERT-EYE" title="CERT-EYE"></img>
        </a> */}
        <Avatar
          variant="square"
          className={classes.avatar}
          component={Link}
          src={user.avatar}
          to="/certeye/"
        />
        </div>

        <div style={{'padding-left':'20px',float:'right','font-weight':'bold'}}>
        <Link  component="button" to={{pathname: '/certeye/Table'}} style={{color:'#FFFFFF','padding-right':25}}>
        SSL检测
        </Link>

        <Link  component="button" style={{color:'#FFFFFF','padding-right':25}} to={{pathname: '/certeye/Cdn'}}>
        CDN检测
        </Link>
        </div>

        {/* <a style={{color:'#FFFFFF','padding-right':25}} href="/certeye/">SSL检测</a>
        <a style={{color:'#FFFFFF','padding-right':25}} href="/certeye/Cdn">CDN检测</a> */}
        {/* <div>
        <Link
          to={{
           pathname: '/1/',
              }}
        >
        <Button
          variant="outlined" 
          // color="inherit"
        >
        SSL检测
        </Button>
        
        </Link>
        </div>
        <Link
          to={{
           pathname: '/certeye/',
              }}
        >
        <Button
          variant="outlined" 
          // color="inherit"
          >
        CDN检测
        </Button>
        </Link> */}
        {/* <Button color="inherit">SSL</Button>
        <Button color="inherit">CDN</Button> */}
        {/* <RouterLink to="/certeye/">
          <Logo />
        </RouterLink> */}
      </Toolbar>
    </AppBar>
    </div>
  );
};

TopBar.propTypes = {
  className: PropTypes.string
};

export default TopBar;
