const states = await api.getMyMovies();

const entries = await Promise.all(
  states.map(async (state) => {
    try {
      const movie = await api.getMovie(state.tmdb_id);
      return { movie, state };
    } catch {
      return null;
    }
  })
);

const library = entries.filter(
  (entry) => entry !== null
);