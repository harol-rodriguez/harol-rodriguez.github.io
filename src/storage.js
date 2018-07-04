let storage = {
  apiKey: 'a70dbfe19b800809dfdd3e89e8532c9e',
  sessionId: localStorage.getItem('session_id') || null,
  userId: localStorage.getItem('user_id') || null,
  pageTitlePostfix: ' — ' + document.title,
  listTypes: [
    {
      title: 'En Cartelera',
      shortTitle: 'Now Playing',
      query: 'now_playing',
      type: 'collection',
      isCategory: true
    },
    {
      title: 'Peliculas Populares',
      shortTitle: 'Popular',
      query: 'popular',
      type: 'collection',
      isCategory: true
    },
    {
      title: 'Peliculas Rankeadas',
      shortTitle: 'Top Rated',
      query: 'top_rated',
      type: 'collection',
      isCategory: true
    },
    {
      title: 'Proximamente',
      shortTitle: 'Upcoming',
      query: 'upcoming',
      type: 'collection',
      isCategory: true
    },
    {
      title: 'Search Results',
      query: 'search',
      isCategory: false
    }
  ],
  categories: {},
  // For Browser History
  backTitle: '',
  moviePath: '',
  createMoviePopup: false,
  moviePopupOnHistory: false
};

// Create categories titles
storage.listTypes.forEach(function(listType){
  storage.categories[listType.query] = listType.title;
});

export default storage;
