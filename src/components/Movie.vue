<template>
  <section class="movie">
    <div class="movie__container" v-if="movieLoaded">
      <figure class="movie__poster">
        <img v-if="moviePosterSrc" class="movie__img" src="~assets/placeholder.png" v-img="moviePosterSrc">
        <img v-if="!moviePosterSrc" class="movies-item__img is-loaded" src="~assets/no-image.png">
      </figure>
      <div class="movie__title">
        <h1 class="movie__title--text">
          {{ movie.title }}
          <span v-if="movie.tagline">{{ movie.tagline }}</span>
        </h1>
        <div class="movie__title--genres">
          <p v-for="item in movie.genres">{{ item.name }}</p>
        </div>
        <div class="movie__language"><p>{{ movie.original_language }}</p></div>
        <div class="movie__detail">
          <div class="movie__detail--rating">
            <div class="movie__detail--rating-value">
              <div class="movie__detail--ico">
                <img class="heart-empty" src="~assets/rating.png" alt="">
                <div class="heart-percent" :class="'heart-percent'+Math.round(movie.vote_average/2)"> <img src="~assets/heart_full.svg" alt=""> </div>
              </div>
              <p class="movie__detail--value">{{ movie.vote_average }}</p>
            </div>
            <span>Rating</span>
          </div>
          <div class="movie__detail--rating">
            <div class="movie__detail--rating-value">
              <div class="movie__detail--ico">
                <img src="~assets/popularity.png" alt="">
              </div>
              <p class="movie__detail--value">{{ Math.round(movie.popularity) }}</p>
            </div>
            <span>Popularity</span>
          </div>
          <div class="movie__detail--rating">
            <div class="movie__detail--rating-value">
              <div class="movie__detail--ico">
                <img src="~assets/votes.png" alt="">
              </div>
              <p class="movie__detail--value">{{ movie.vote_count }}</p>
            </div>
            <span>Votes</span>
          </div>
        </div>
      </div>
      <div class="movie__description">
        {{ movie.overview }}
      </div>
      <div class="movie__date">
        <img src="~assets/calendar.svg" alt="">
        <p>{{formatoFecha(movie.release_date)}}</p>
      </div>
    </div>
  </section>
</template>

<script>
import axios from 'axios'
import storage from '../storage.js'
import img from '../directives/v-image.js'
import formatDate from '../directives/v-formatDate.js'

export default {
  props: ['id', 'type'],
  directives: {
    img: img,
    formatDate: formatDate
  },
  data(){
    return{
      movie: {},
      movieLoaded: false,
      moviePosterSrc: '',
      movieBackdropSrc: '',
      userLoggedIn: storage.sessionId ? true : false,
      favoriteChecked: false,
      favorite: ''
    }
  },
  // computed: {
  //   loaded(){
  //     return this.movieLoaded ? true : false;
  //   }
  // },
  methods: {
    formatoFecha(date){
      
      var partsDate = date.split('-')
      var monthNames = [
        "Jan", "Feb", "Mar",
        "Apr", "May", "Jun", "Jul",
        "Aug", "Sep", "Oct",
        "Nov", "Dec"
      ];
      console.log(date)
      return(partsDate[2]+' '+monthNames[partsDate[1]-1])
    },
    fetchMovie(id){
      axios.get(`https://api.themoviedb.org/3/movie/${id}?api_key=${storage.apiKey}&language=es-ES`)
      .then(function(resp){
          let movie = resp.data;
          this.movie = movie;
          this.poster();
          this.backdrop();
          // this.checkIfInFavorites(movie.id);
          // if(this.userLoggedIn){
            
          // } else {
          //   //this.movieLoaded = true;
          // }
          this.movieLoaded = true;
          // Push state
          if(storage.createMoviePopup){
            storage.moviePath = '/movie/' + id;
            history.pushState({ popup: true }, null, storage.moviePath);
            storage.createMoviePopup = false;
          }
          // Change Page title
          document.title = this.movie.title + storage.pageTitlePostfix;
      }.bind(this))
      .catch(function(error) {
        this.$router.push({ name: '404' });
      }.bind(this));
    },
    poster() {
      if(this.movie.poster_path){
        this.moviePosterSrc = 'https://image.tmdb.org/t/p/w600_and_h900_bestv2' + this.movie.poster_path;
      }
    },
    backdrop(){
      if(this.movie.backdrop_path){
        this.movieBackdropSrc = 'https://image.tmdb.org/t/p/w500' + this.movie.backdrop_path;
      }
    },
    nestedDataToString(data) {
      let nestedArray = [], resultString;
      data.forEach((item) => nestedArray.push(item.name));
      resultString = nestedArray.join(', ');
      return resultString;
    },
    checkIfInFavorites(id){
      axios.get(`https://api.themoviedb.org/3/movie/${id}/account_states?api_key=${storage.apiKey}&session_id=${storage.sessionId}`)
      .then(function(resp){
          this.favorite = resp.data.favorite;
          this.favoriteChecked = true;
          this.movieLoaded = true;
      }.bind(this))
    },
    toggleFavorite(){
      let favoriteInvert = !this.favorite;
      this.favorite = '';
      axios.post(`https://api.themoviedb.org/3/account/${storage.userId}/favorite?api_key=${storage.apiKey}&session_id=${storage.sessionId}`, {
        'media_type': 'movie',
        'media_id': this.id,
        'favorite': favoriteInvert
      })
      .then(function(resp){
        this.favorite = favoriteInvert;
        eventHub.$emit('updateFavorite');
      }.bind(this));
    }
  },
  // watch: {
  //   id: function(val){
  //     this.fetchMovie(val);
  //   }
  // },
  created(){
    this.fetchMovie(this.id);
  }
}
</script>