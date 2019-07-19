<template>
  <div id="app">
    <img src="./assets/logo.png">
    <div>
      <label>bg-loadMore</label>
      <div>
        <demo1></demo1>
      </div>
    </div>
  </div>
</template>

<script>
import demo1 from '../example/demo1';
export default {
  name: 'app',
  components: {
    demo1
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
