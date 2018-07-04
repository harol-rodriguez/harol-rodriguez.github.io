import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
export const store = new Vuex.Store({
  state: {
    genres: []
  },
  getters: {
    get_genres: state => {
      return state.genres
    }
  },
  mutations: {
    SET_GENRES (state, data) {
      state.genres = data
    }
  }
})
