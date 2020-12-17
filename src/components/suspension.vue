<template>
  <div>
    <h1>{{ msg }}</h1>
  </div>
</template>

<script>

let electron = window.require("electron");
export default {

  name: "suspension",
  props: {
    msg: String
  },
  mounted() {
    let win = electron.remote.getCurrentWindow();
    let biasX = 0;
    let biasY = 0;
    let that = this;
    document.addEventListener('mousedown', function (e) {
      console.log("鼠标按键",e);
      switch (e.button) {
        case 0:
          biasX = e.x;
          biasY = e.y;
          document.addEventListener('mousemove', moveEvent);
          break;
        case 2:
          console.log("鼠标右键点击")
          electron.ipcRenderer.send('app_exit');
          break;
      }
    });

    document.addEventListener('mouseup', function () {
      biasX = 0;
      biasY = 0;
      document.removeEventListener('mousemove', moveEvent)
    });

    function moveEvent(e) {
      console.log(e.screenX - biasX, e.screenY);
      win.setBounds({width:400,height:300,x:e.screenX - biasX, y:e.screenY - biasY})
    }
  }

}
</script>

<style scoped>

</style>