<template>
  <li class="movies-item">
    <a class="movies-item__link" :class="{'no-image': noImage}" :href="'/movie/' + movie.id" @click.prevent="openMoviePopup(movie.id, true)">
      <figure class="movies-item__poster">
        <img v-if="!noImage" class="movies-item__img" src="~assets/placeholder.png" v-img="poster()" alt="">
        <img v-if="noImage" class="movies-item__img is-loaded" src="~assets/no-image.png" alt="">
      </figure>
      <div class="movies-item__content">
        <p class="movies-item__title">{{ movie.title }}</p>
        <div class="movies-item__genres">
          <p class="movies-item__genres--item" v-for="genre_id in movie.genre_ids">{{ nameGenres(genre_id)}}</p>
        </div>
        <div class="movies-item__vote">
          <img class="movies-item__vote--empty" src="~assets/heart.svg" alt="">
          <div class="movies-item__vote--percent" :class="'movies-item__vote--percent'+Math.round(movie.vote_average/2)"> <img src="~assets/heart_full.svg" alt=""> </div>
          <p>{{ movie.vote_average }}</p>
        </div>
        <div class="movies-item__btnDetalle btn1"> Detalle </div>
      </div>
    </a>
  </li>
</template>

<script>
import img from '../directives/v-image.js'

export default {
  props: ['movie'],
  directives: {
    img: img
  },
  data(){
    return{
      noImage: false,
      genres: []
    }
  },
  mounted() {
    const self = this
    let genresAux = self.$store.getters.get_genres
  },
  methods: {
    nameGenres(id){
      const self = this
      var rtn =  self.$store.getters.get_genres.filter( function(obj) {
        return obj.id == id
      })[0]
      if(rtn != undefined ){
        return rtn.name;
      }
    },
    poster() {
      if(this.movie.poster_path){
        return 'https://image.tmdb.org/t/p/w370_and_h556_bestv2' + this.movie.poster_path;
      } else {
        this.noImage = true;
      }
    },
    openMoviePopup(id, event){
      eventHub.$emit('openMoviePopup', id, event);
      console.log(this.movie)
    }
  }
}
</script>