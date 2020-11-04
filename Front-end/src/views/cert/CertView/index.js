import React from 'react';
import {
  Container,
  Grid,
  makeStyles
} from '@material-ui/core';
import Page from 'src/components/Page';
import Showcert from './showcert';
import Showalgo from './cert_algo';
import TextField from '@material-ui/core/TextField';
import Ttable from './table'
import Cert_notAfter from './show_after'
import No_Trust from './No_trust'
import History from './history'
const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3)
  }
}));

const Dashboard = () => {
  const classes = useStyles();
  return (
    <Page
      className={classes.root}
      title="Dashboard"
    >
      <Container maxWidth={true}>
        <Grid
          container
          spacing={2}
        >
          <Grid
           item
           xs={12}
          >
          <Ttable/>
          </Grid>
          <Grid
            item
            xs={12}
          >
          <History />
          </Grid>
        <Grid
          container
          spacing={2}
          xs={12}
        >
          <Grid
            item
            xs={3}
          >
            <Showcert />
          </Grid>
          <Grid
            item
            xs={3}
          >
            <Cert_notAfter/>
          </Grid>
          <Grid
          item
          xs={3}
          >
          <Showalgo/>
          </Grid>
          <Grid
          item
          xs={3}
          >
          <No_Trust/>
          </Grid>
        </Grid>
          <Grid
            item
            xs={12}
          >
          <TextField
          fullWidth='true'
          xs={12}
          id="outlined-helperText"
          label="Helper text"
          defaultValue="证书相关属性，0表示否，1表示是"
          // helperText="Some important text"
          variant="outlined"
          />
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
};

export default Dashboard;