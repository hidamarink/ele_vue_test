<template>
  <div id="app">
<!--    <img alt="Vue logo" src="./assets/logo.png">-->
    <suspension msg="Vue.js App"/>
    <div>计数{{count}}</div>
  </div>
</template>

<script>
import suspension from './components/suspension.vue'

export default {
  name: 'App',
  data(){
    return {
        count:0
    }
  },
  components: {
    suspension
  },
  mounted() {
    let that = this;
    console.log("-------------------------");
    setInterval(function (){
      that.count++;
    },100);
  }

}
</script>

<style>
html,body{
  height: 100%;
  width: 100%;
  margin: 0;
  padding: 0;
}
#app {
  user-select: none;
  width: 100%;
  height: 100%;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: white;
  /*margin-top: 60px;*/
  background-color: #141826;
  /*border: 3px dashed #00b464;*/
}
</style>
