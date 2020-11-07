import http from "./httpService";

const apiEndpoint = "/movies";

function getMovieUrl(id) {
  return `${apiEndpoint}/${id}`;
}

export function getMovies() {
  return http.get(apiEndpoint);
}

export function deleteMovie(id) {
  return http.delete(getMovieUrl(id));
}

export function getMovie(id) {
  return http.get(getMovieUrl(id));
}

export function saveMovie(movie) {
  console.log(movie);
  if (movie._id) {
    const body = { ...movie };
    delete body._id;
    return http.put(getMovieUrl(movie._id), body);
  }
  return http.post(apiEndpoint, {
    title: "AAA",
    genre: {
      _id: "5fa67d901d042554e911cab0",
      name: "Comedy ",
    },
    numberInStock: 4,
    dailyRentalRate: 4,
    publishDate: moment().toJSON(),
  });
}
