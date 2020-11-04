import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { Doughnut } from 'react-chartjs-2';
import axios from 'axios'
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Typography,
  colors,
  makeStyles,
  useTheme
} from '@material-ui/core';
import LaptopMacIcon from '@material-ui/icons/LaptopMac';
import PhoneIcon from '@material-ui/icons/Phone';
import TabletIcon from '@material-ui/icons/Tablet';

const useStyles = makeStyles(() => ({
  root: {
    height: '100%'
  }
}));

class No_Trust extends React.Component{
  static propTypes = {
    classes: PropTypes.string
  } 
  constructor(props) {
    super(props);
    const { theme } = this.props;
    this.options = {
      animation: false,
      cutoutPercentage: 80,
      layout: { padding: 0 },
      legend: {
        display: false
      },
      maintainAspectRatio: false,
      responsive: true,
      tooltips: {
        backgroundColor: theme.palette.background.default,
        bodyFontColor: theme.palette.text.secondary,
        borderColor: theme.palette.divider,
        borderWidth: 1,
        enabled: true,
        footerFontColor: theme.palette.text.secondary,
        intersect: false,
        mode: 'index',
        titleFontColor: theme.palette.text.primary
      }
    };
    this.data = {
      datasets: [
        {
          data: [20,30],
          borderWidth: 8,
          backgroundColor : [
            colors.indigo[500],
            colors.red[600]
          ],
          borderColor: colors.common.white,
          hoverBorderColor: colors.common.white
        }
      ],
      labels: ['0.0', '1.0']
    };

  }
  handledata(){
    const url = "https://nanase.ink:5001/chain_notrust"+"?school="+ global.constants.param;
    var oReq = new XMLHttpRequest();
    oReq.open("GET", url, false); // 同步请求
    oReq.setRequestHeader("Content-type", "application/json");
    //oReq.send(JSON.stringify({"name": value}));//发送数据需要自定义，这里发送的是JSON结构
    oReq.send();
    var result = oReq.responseText;//响应结果
    var datas =  JSON.parse(result);
    var connection = new Array();
    var number = new Array();
    var backgroundColor =new Array();

    var temp_backgroundColor = [
      colors.indigo[500],
      colors.red[600],
      colors.orange[600],
      colors.red[400],
      colors.orange[500],
    ];
    var i=0;
    for (var k in datas){
      connection.push(k);
      number.push(datas[k]);
      backgroundColor.push(temp_backgroundColor[i%5]);
      i+=1;
    }
    this.data.datasets[0].data = number;
    // this.data.datasets[1].data = datas["b"][0]
    this.data.labels = connection;
    this.data.datasets[0].backgroundColor = backgroundColor
  }
  componentWillMount(){
    this.handledata();
    this.forceUpdate();
  }
  componentDidMount(){
    this.interval = setInterval(()=>{
      this.handledata();
      // console.log(Object.prototype.toString.apply(datas["a"][0][0]))
      // console.log((datas["a"]))
      // console.log(datas["b"][0]);
      this.forceUpdate();
      // window.location.reload();
    },60000)
  }
  componentWillUnmount(){
    if(this.interval){
      clearInterval(this.interval);
    }
  }

  render() {
    const {classes} = this.props;
    return (
      <Card
        className={clsx(classes.root, this.props.className)}
        {...this.props.rest}
      >
        <CardHeader title="证书链是否可信"/>
        <Divider />
        <CardContent>
          <Box
            height={300}
            position="relative"
          >
            <Doughnut
              data= {this.data}
              options= {this.options}
            />
          </Box>
        </CardContent>
      </Card>
    );
  }
}

export default function(props){
  const classes = useStyles();
  const theme = useTheme();
  return <No_Trust {...props} theme={theme} classes={classes}/>;
}