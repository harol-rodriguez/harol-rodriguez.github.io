<template>
  <div id="app">
    <header class="header">
      <img class="header__logo" src="/dist/icons/culqi_logo.png" @click="searchvisible = !searchvisible"></img>
      <div class="header__search" v-if="searchvisible">        
        <input class="header__search-input" type="text" v-model.trim="searchQuery" @keyup.enter="search" @blur="search" placeholder="Busca una película...">
        <img class="header__search-icon" src="/dist/icons/search-icon.svg"></img>
      </div>
    </header>
    <movie-popup v-if="moviePopupIsVisible" @close="closeMoviePopup" :id="moviePopupId"></movie-popup>
    <section class="main">
      <transition name="fade" @after-leave="afterLeave">
        <router-view name="list-router-view" :type="'page'" :mode="'collection'" :key="$route.params.category"></router-view>
        <router-view name="search-router-view" :type="'page'" :mode="'search'" :key="$route.params.query"></router-view>
        <router-view name="page-router-view"></router-view>
      </transition>
    </section>
    <footer class="footer">
      <div class="footer__content">
        <div class="footer__logo"><p>CULQI</p></div>
        <div class="footer__social">
          <span class="footer__social--item">        
            <img src="/dist/icons/twitter.svg"></img>
          </span>
          <span class="footer__social--item">
            <img src="/dist/icons/facebook.svg"></img>
          </span>
          <span class="footer__social--item">
            <img src="/dist/icons/instagram.svg"></img>
          </span>
        </div>
        <div class="footer__copyright"><p>CULQI TRYOUTS</p></div>
      </div>
    </footer>
  </div>
</template>

<script>
import axios from 'axios'
import storage from './storage.js'
import MoviePopup from './components/MoviePopup.vue'

export default {
  name: 'app',
  components: { MoviePopup},
  data(){
    return{
      searchvisible: false,
      moviePopupIsVisible: false,
      moviePopupHistoryVisible: false,
      moviePopupId: 0,
      searchQuery: ''
    }
  },
  computed: {
    queryForRouter(){
      return encodeURI(this.searchQuery.replace(/ /g, "+"));
    }
  },
  methods: {
    // User Session Methods
    requestToken(){
      storage.sessionId = null;
      axios.get(`https://api.themoviedb.org/3/authentication/token/new?api_key=${storage.apiKey}`)
      .then(function(resp){
          if(typeof resp.data == 'string') {
             resp.data = JSON.parse(resp.data);
          }
          let data = resp.data;
          window.location.href = `https://www.themoviedb.org/authenticate/${data.request_token}?redirect_to=${location.protocol}//${location.host}/profile`
      }.bind(this));
    },
    setUserStatus(){
      storage.sessionId = localStorage.getItem('session_id') || null;
      storage.userId = localStorage.getItem('user_id') || null;
    },
    // Movie Popup Methods
    openMoviePopup(id, newMoviePopup){
      if(newMoviePopup){
        storage.backTitle = document.title;
      }
      storage.createMoviePopup = newMoviePopup;
      this.moviePopupIsVisible = true;
      this.moviePopupId = id;
      document.querySelector('body').classList.add('hidden');
    },
    closeMoviePopup(){
      storage.createMoviePopup = false;
      this.moviePopupIsVisible = false;
      document.querySelector('body').classList.remove('hidden');
      window.history.back();
    },
    onHistoryState(e){
      storage.moviePopupOnHistory = e.state ? e.state.hasOwnProperty('popup') : false;
      if(!storage.moviePopupOnHistory){
        this.moviePopupIsVisible = false;
        document.title = storage.backTitle;
      }
    },
    changeHistoryState(){
      if(history.state && history.state.popup){
        let newState = {
          popup: false
        };
        history.replaceState(newState , null, storage.moviePath);
      }
    },
    // Search Methods
    search(){
      if(!this.searchQuery.length) return;
      this.$router.push({ name: 'search', params: { query: this.queryForRouter }});
    },
    setSearchQuery(clear){
      if(clear){
        this.searchQuery = '';
      } else {
        let query = decodeURIComponent(this.$route.params.query);
        this.searchQuery =  query ? query.replace(/\+/g, " ") : '';
      }
    },
    // Router After Leave
    afterLeave(){
      document.querySelector('body').scrollTop = 0;
    },
    // Detect if touch device
    isTouchDevice() {
      return 'ontouchstart' in document.documentElement;
    }
  },
  created(){
    window.addEventListener('popstate', this.onHistoryState);
    window.addEventListener('pagehide', this.changeHistoryState);
    eventHub.$on('openMoviePopup', this.openMoviePopup);
    eventHub.$on('setSearchQuery', this.setSearchQuery);
    eventHub.$on('requestToken', this.requestToken);
    eventHub.$on('setUserStatus', this.setUserStatus);
    if (this.isTouchDevice()) {
      document.querySelector('body').classList.add('touch');
    }
  }
}
</script>