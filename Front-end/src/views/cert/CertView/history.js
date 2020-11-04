import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { Bar,Line,Pie} from 'react-chartjs-2';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  useTheme,
  makeStyles,
  colors
} from '@material-ui/core';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';

const useStyles = makeStyles(() => ({
  root: {}
}));

//change
class History extends React.Component{
  static propTypes = {
    classes: PropTypes.string
  }
  constructor(props) {
    super(props);
    const { theme } = this.props;
    this.options = {
      animation: false,
      cornerRadius: 20,
      layout: { padding: 0 },
      legend: { display: true },
      maintainAspectRatio: false,
      responsive: true,
      scales: {
        xAxes: [
          {
            barThickness: 12,
            maxBarThickness: 10,
            barPercentage: 0.5,
            categoryPercentage: 0.5,
            ticks: {
              fontColor: theme.palette.text.secondary
            },
            gridLines: {
              display: false,
              drawBorder: false
            }
          }
        ],
        yAxes: [
          {
            ticks: {
              fontColor: theme.palette.text.secondary,
              beginAtZero: false,
              min: 0
            },
            gridLines: {
              borderDash: [2],
              borderDashOffset: [2],
              color: theme.palette.divider,
              drawBorder: false,
              zeroLineBorderDash: [2],
              zeroLineBorderDashOffset: [2],
              zeroLineColor: theme.palette.divider
            }
          }
        ]
      },
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
        // {
        //   backgroundColor: colors.indigo[500],
        //   data: [18, 5, 19, 27, 29, 19, 20],
        //   // data: datas['a'],
        //   label: 'Status'
        // },
        // {
        //   backgroundColor: colors.grey[200],
        //   data: [11, 20, 12, 29, 30, 25, 13],
        //   // data: datas['b'],
        //   label: 'Last year'
        // }
      ],
      labels: ['1 Aug', '2 Aug', '3 Aug', '4 Aug', '5 Aug', '6 Aug']
    };
    this.state = {
      reload: false
    };
  }
  handledata(){
    // const url1 = "http://47.98.227.159:5001/historytrust";
    // const url2 = "http://47.98.227.159:5001/historyalg";
    // const url3 = "http://47.98.227.159:5001/historyafter";
    // const url4 = "http://47.98.227.159:5001/historychaintrust"
    // var oReq = new XMLHttpRequest();
    // oReq.open("GET", url1, false); // 同步请求
    // oReq.setRequestHeader("Content-type", "application/json");
    // //oReq.send(JSON.stringify({"name": value}));//发送数据需要自定义，这里发送的是JSON结构
    // oReq.send();
    // var result = oReq.responseText;//响应结果
    // var datas1 =  JSON.parse(result);
    // // 第二次
    // oReq.open("GET", url2, false); // 同步请求
    // oReq.setRequestHeader("Content-type", "application/json");
    // //oReq.send(JSON.stringify({"name": value}));//发送数据需要自定义，这里发送的是JSON结构
    // oReq.send();
    // result = oReq.responseText;//响应结果
    // var datas2 =  JSON.parse(result);
    // //第三次
    // oReq.open("GET", url3, false); // 同步请求
    // oReq.setRequestHeader("Content-type", "application/json");
    // //oReq.send(JSON.stringify({"name": value}));//发送数据需要自定义，这里发送的是JSON结构
    // oReq.send();
    // result = oReq.responseText;//响应结果
    // var datas3 =  JSON.parse(result);

    // oReq.open("GET", url4, false); // 同步请求
    // oReq.setRequestHeader("Content-type", "application/json");
    // //oReq.send(JSON.stringify({"name": value}));//发送数据需要自定义，这里发送的是JSON结构
    // oReq.send();
    // result = oReq.responseText;//响应结果
    // var datas4 =  JSON.parse(result);
    const url = "https://nanase.ink:5001/getnewhistorycert"+"?school="+ global.constants.param;
    var oReq = new XMLHttpRequest();
    oReq.open("GET", url, false); // 同步请求
    oReq.setRequestHeader("Content-type", "application/json");
    //oReq.send(JSON.stringify({"name": value}));//发送数据需要自定义，这里发送的是JSON结构
    oReq.send();
    var result = oReq.responseText;//响应结果
    var datas =  JSON.parse(result);
    var data1 = datas['ct'];
    var data2 = datas['cs'];
    var data3 = datas['ca'];
    var data4 = datas['cc'];

    var date = data3['date'];
    this.row = [];
    var temp_backgroundColor = [
      colors.indigo[500],
      colors.red[600],
      colors.orange[600],
      colors.red[100],
      colors.orange[500],
      colors.indigo[500],
      colors.red[600],
      colors.orange[500],
    ];
    this.data.datasets = new Array()
    // 获得data，c1,c2
    var tmp = {
        backgroundColor: temp_backgroundColor[0],
        data:data1['0.0'],
        label: '证书与域名不匹配'
    }
    this.data.labels = data1['date']
    this.data.datasets.push(tmp)
    tmp = {
        backgroundColor: temp_backgroundColor[1],
        data:data2['1.0'],
        label: '证书使用弱哈希算法'
    }
    this.data.datasets.push(tmp)
    tmp = {
        backgroundColor: temp_backgroundColor[2],
        data:data3['0.0'],
        label: '证书过期'
    }
    this.data.datasets.push(tmp);
    tmp = {
      backgroundColor: temp_backgroundColor[3],
      data:data4['0.0'],
      label: '证书链不完整'
    }
    this.data.datasets.push(tmp);
  }
  componentWillMount(){
    this.handledata();
    this.forceUpdate();
  }
  // componentDidMount(){
  //   this.interval = setInterval(()=>{
  //     this.handledata();
  //     this.forceUpdate();
  //     // window.location.reload();
  //   },10000)
  // }
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
        <CardHeader
          action={(
            <Button
              endIcon={<ArrowDropDownIcon />}
              size="small"
              variant="text"
            >
              {/* Last 7 days */}
            </Button>
          )}
          title="历史状态统计(柱状图)"
        />
        <Divider />
        <CardContent>
          <Box
            height={400}
            position="relative"
          >
            <Bar
              data={this.data}
              options={this.options}
            />
          </Box>
        </CardContent>
        <Divider />
        <Box
          display="flex"
          justifyContent="flex-end"
          p={2}
        >
          {/* <Button
            color="primary"
            endIcon={<ArrowRightIcon />}
            size="small"
            variant="text"
          >
            Overview
          </Button> */}
        </Box>
      </Card>
    );
  }
}
export default function(props){
  const classes = useStyles();
  const theme = useTheme();
  return <History {...props} theme={theme} classes={classes}/>;
}