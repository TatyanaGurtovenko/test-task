<template>
  <div id="app">
    <div class="wrapper">
      <Header/>
      <div class="container">
        <div class="page__title">Список заявлений</div>
        <EnrolledTable :data="data"/>
      </div>
    </div>
  </div>
</template>

<script>
import Header from './components/Header.vue'
import EnrolledTable from './components/EnrolledTable.vue'
import Data from './static/data.json';

export default {
  name: 'App',
  components: {
    Header,
    EnrolledTable
  },
  data() {
    return {
      data: Data,
    }
  },
}
</script>

<style lang="scss">
#app {
  height: 100%;
  overflow-x: hidden;
}

body, html {
  height: 100%;
}

* {
  margin: 0;
  padding: 0;
}


body {
  margin: 0;
  background: #EDF5FF;
}

#app {
  font-family: 'ProximaNova', Arial, sans-serif;
  color: #1C1D1F;
}

.wrapper {
  height: 100%;
  margin: 0 auto;
}

.container {
  height: 100%;
  padding-right: 15px;
  padding-left: 15px;
  max-width: 81.25rem;
  margin: 0 auto;
}

.page__title {
  font-weight: 800;
  font-size: 32px;
  color: #1C1D1F;
  margin-bottom: 20px;
}

@font-face {
  font-family: ProximaNova;
  font-weight: 400;
  font-style: normal;
  src: local("ProximaNova Regular"), url("../src/assets/fonts/proxima-nova-regular.woff") format("woff");
}


@font-face {
  font-family: ProximaNova;
  font-weight: 700;
  font-style: normal;
  src: local("ProximaNova Extrabold"), url("../src/assets/fonts/proxima-nova-extrabold.woff") format("woff");
}

@font-face {
  font-family: ProximaNova;
  font-weight: 800;
  font-style: normal;
  src: local("ProximaNova Bold"), url("../src/assets/fonts/proxima-nova-bold.woff") format("woff");
}

</style>
