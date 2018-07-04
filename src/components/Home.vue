<template>
  <section class="home">
    <movies-list v-bind:key="item.id" v-for="item in listTypes" v-if="item.isCategory" :type="'component'" :mode="'collection'" :category="item.query" :shortList="true"></movies-list>
  </section>
</template>

<script>
import axios from 'axios'
import storage from '../storage.js'
import MoviesList from './MoviesList.vue'

export default {
  components: { MoviesList },
  data(){
    return {
      listTypes: storage.listTypes
    }
  },
  created(){
    document.title = 'Reto 2018 Front-End TMDb';
    storage.backTitle = document.title;
    const self = this;
    axios.get(`https://api.themoviedb.org/3/genre/movie/list?api_key=${storage.apiKey}&language=es-Es`).then(function(results){
      self.$store.commit('SET_GENRES', results.data.genres)
    })
  }
}
</script>
