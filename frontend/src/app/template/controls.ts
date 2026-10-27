await api.updateMovieState(movie.id, {
  favorite: !state.favorite,
});