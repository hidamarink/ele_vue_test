<template>
  <div>
    <div >当前价格:<span class="price_green">{{price}}</span></div>
  </div>
</template>

<script>
import _ from "lodash";
let electron = window.require("electron");
let pako = require("pako");
const  window_width = electron.remote.getCurrentWindow().getSize()[0];
const  window_height = electron.remote.getCurrentWindow().getSize()[1];

export default {

  name: "suspension",
  props: {
    msg: String
  },
  data(){
    return {
      websock : null,
      is_connected : false,
      is_detail_sub : false,
      is_trade_sub: false,
      sub_list : [],
      price:""
    }
  },
  created() {
    this.initWebSocket();
  },
  destroyed() {
    this.websock.close() //离开路由之后断开websocket连接
  },
  mounted() {
    console.log("suspension page")
    let win = electron.remote.getCurrentWindow();
    let biasX = 0;
    let biasY = 0;
    let that = this;
    document.addEventListener('mousedown', function (e) {
      // console.log("鼠标按键",e);
      switch (e.button) {
        case 0:
          biasX = e.x;
          biasY = e.y;
          document.addEventListener('mousemove', moveEvent);
          break;
        case 1:
          console.log("鼠标中键点击")
          electron.ipcRenderer.send('app_exit');
          break;
        case 2:
          electron.ipcRenderer.send('createSuspensionMenu');
          console.log("鼠标右键点击")
          break;
      }
    });

    document.addEventListener('mouseup', function () {
      biasX = 0;
      biasY = 0;
      document.removeEventListener('mousemove', moveEvent)
    });

    function moveEvent(e) {
      // console.log(e.screenX - biasX, e.screenY);
      // console.log("==============",electron.remote.getCurrentWindow().getSize())
      win.setBounds({width:window_width,height:window_height,x:e.screenX - biasX, y:e.screenY - biasY})
    }

    //添加监听事件
    electron.ipcRenderer.on("change_symbol",function (){
      console.log("====================================================监听到更换币对通知");
    });

  },
  methods: {
    initWebSocket() { //初始化weosocket
      const wsuri = "wss://api.huobi.pro/ws";
      this.websock = new WebSocket(wsuri);
      this.websock.onmessage = this.websocketonmessage;
      this.websock.onopen = this.websocketonopen;
      this.websock.onerror = this.websocketonerror;
      this.websock.onclose = this.websocketclose;
      //重置变量
      this.is_trade_sub = false;
      this.is_detail_sub = false;
    },

    websocketonopen() { //连接建立之后执行send方法发送数据
      // let actions = {"test":"12345"};
      // this.websocketsend(JSON.stringify(actions));
      console.log("Websocke连接已经建立");
    },
    websocketonerror() {//连接建立失败重连
      this.initWebSocket();
    },
    async websocketonmessage(e) { //数据接收
      // const redata = JSON.parse(e.data);
      // console.log(e);
      let str =  await this.gzip2str(e.data);
      console.log("解压完成",str);
      let json_result = JSON.parse(str);
      if(json_result.ping){
        this.websocketsend(JSON.stringify({pong:json_result.ping}));
        if(!this.is_detail_sub){
          this.websocketsend(JSON.stringify({
            sub: "market.btcusdt.detail",
            id: "detail_sub1"
          }))
          this.is_detail_sub = true;
        }
        if(!this.is_trade_sub){
          this.websocketsend(JSON.stringify({
            sub: "market.btcusdt.trade.detail",
            id: "trade_sub1"
          }));
          this.is_trade_sub = true;
        }
      }
      if(json_result.id === "trade_sub1"){
          console.log("交易订阅成功");
      }

      //如果是交易详情的回调
      if(json_result.ch && json_result.ch.includes("market.") && json_result.ch.includes(".trade.detail")){
        let direction = json_result.tick.data[0].direction;
        this.price = json_result.tick.data[0].price.toFixed(2);
          // console.log(direction === "buy" ? chalk.green(direction) : chalk.red(direction),json_result.tick.data[0].price);
      }
    },
    websocketsend(Data) {//数据发送
      this.websock.send(Data);
    },
    websocketclose(e) {  //关闭
      console.log('断开连接', e);
      //TODO:关闭之后10秒尝试重新连接

    },
    async gzip2str(data){
      let b64_data = await this.blob2base64(data);
      let strData   = atob(b64_data);
      // Convert binary string to character-number array
      let charData  = strData.split('').map(function(x){return x.charCodeAt(0);});
      // Turn number array into byte-array
      let binData   = new Uint8Array(charData);
      // // unzip
      let inf_data  = pako.inflate(binData);
      // Convert gunzipped byteArray back to ascii string:
      strData   = String.fromCharCode.apply(null, new Uint16Array(inf_data));
      return strData;
    },
    blob2base64(blob_data){
      return new Promise(function (resolve, reject){
        let a = new FileReader();
        a.onload = function (e) {
          // console.log(e.target.result);
          resolve(e.target.result.replace("data:application/octet-stream;base64,",""));
        }
        a.readAsDataURL(blob_data);
      })
    },

    sub_trade_detail(symbol){
      this.websocketsend(JSON.stringify({
        sub: `market.${symbol}.trade.detail`,
        id: `trade_sub_${symbol}`
      }));
      this.sub_list.push(symbol);

      this.is_trade_sub = true;
    },
    unsub_trade_detail(symbol){
      this.websocketsend(JSON.stringify({
        sub: `market.${symbol}.trade.detail`,
        id: `trade_sub_${symbol}`
      }));
      this.sub_list.push(symbol);

      this.is_trade_sub = false;
    },


    //更换监听的币对
    change_symbol(){

    }



  }
}
</script>

<style scoped>
.price_green{
  color: #00b464;
}
</style>