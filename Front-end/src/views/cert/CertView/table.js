import React from 'react';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import PropTypes from 'prop-types';
import {
  useTheme
} from '@material-ui/core';
const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
  root: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
  },
}))(TableRow);

function createData(name,c1,c2,c3,c4) {
  return {name,c1, c2,c3,c4};
}

// const rows = [
//   createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
//   createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
//   createData('Eclair', 262, 16.0, 24, 6.0),
//   createData('Cupcake', 305, 3.7, 67, 4.3),
//   createData('Gingerbread', 356, 16.0, 49, 3.9),
// ];

const useStyles = makeStyles({
  table: {
    minWidth: 700,
  },
});
class Ttable extends React.Component{
    static propTypes = {
        classes: PropTypes.string
    }
    constructor(props){
        super(props);
        const { theme } = this.props;
        this.rows = []
    }
  handledata(){
    // const url1 = "http://47.98.227.159:5001/historytrust";
    // const url2 = "http://47.98.227.159:5001/historyalg";
    // const url3 = "http://47.98.227.159:5001/historyafter";
    // const url4 = "http://47.98.227.159:5001/historychaintrust"
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
    // 第二次
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

    var date = data3['date']
    this.row = [];
    for (var k=0,len=date.length;k<len;k++){
    // 获得data，c1,c2
         var tp1 = data1['0.0'][k];
         var tp2 = data2['1.0'][k];
         var tp3 = data3['0.0'][k];
         var tp4 = data4['0.0'][k];
         var per1 =  tp1/(data1['1.0'][k]+tp1)*100;
         var per2 =  tp2/(data2['0.0'][k]+tp2)*100;
         var per3 =  tp3/(data3['1.0'][k]+tp3)*100;
         var per4 =  tp4/(data4['1.0'][k]+tp4)*100;
         per1 = per1.toFixed(2);
         per2 = per2.toFixed(2);
         per3 = per3.toFixed(2);
         per4 = per4.toFixed(2);
         var dt1 = tp1 + "(" + per1 + "%)";
         var dt2 = tp2 + "(" + per2 + "%)";
         var dt3 = tp3 + "(" + per3 + "%)";
         var dt4 = tp4 + "(" + per4 + "%)";
         this.row.push(createData(date[k],dt1,dt2,dt3,dt4))
    }
    // this.data.datasets[1].data = datas["b"][0]
  }
    componentWillMount(){
      this.handledata();
      this.forceUpdate();
    }
    render() {
        const {classes} = this.props;
        return (
        <TableContainer component={Paper}>
            <Table className={classes.table} aria-label="customized table">
                <TableHead>
                <TableRow>
                    <StyledTableCell align="left">测试日期</StyledTableCell>
                    <StyledTableCell align="right">证书和域名不匹配</StyledTableCell>
                    <StyledTableCell align="right">证书使用MD5或SHA1算法</StyledTableCell>
                    <StyledTableCell align="right">证书过期</StyledTableCell>
                    <StyledTableCell align="right">证书链不完整</StyledTableCell>
                </TableRow>
                </TableHead>
                <TableBody>
                {this.row.map((row) => (
                    <StyledTableRow key={row.name}>
                    <StyledTableCell component="th" scope="row">
                        {row.name}
                    </StyledTableCell>
                    <StyledTableCell align="right">{row.c1}</StyledTableCell>
                    <StyledTableCell align="right">{row.c2}</StyledTableCell>
                    <StyledTableCell align="right">{row.c3}</StyledTableCell>
                    <StyledTableCell align="right">{row.c4}</StyledTableCell>
                    </StyledTableRow>
                ))}
                </TableBody>
            </Table>
        </TableContainer>
        );
    }
}
export default function(props){
  const classes = useStyles();
  const theme = useTheme();
  return <Ttable {...props} theme={theme} classes={classes}/>;
}
