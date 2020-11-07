import React from "react";
import Form from "./common/form";
import Joi from "joi-browser";
import { getGenres } from "../services/genreService";
import { getMovie, saveMovie } from "../services/movieService";
import queryString from "query-string";

class MovieForm extends Form {
  state = {
    data: { title: "", genre: "", stock: "", rate: "" },
    errors: {},
    genres: [],
  };

  schema = {
    title: Joi.string().required().label("Title"),
    genre: Joi.string().required().label("Genre"),
    stock: Joi.number().required().label("Number in Stock").min(0).max(100),
    rate: Joi.number().required().label("Daily Rental Rate").min(0).max(10),
    _id: Joi.string(),
  };

  async populateGenres() {
    let { data: genres } = await getGenres();
    genres = genres.map((element) => {
      return element.name;
    });
    this.setState({ genres });
  }

  async populateMovies() {
    try {
      const movieId = this.props.match.params.id;
      if (movieId === "new") return;
      const { data: movie } = await getMovie(this.props.match.params.id);
      const data = { ...this.state.data };
      data.title = movie.title;
      data.genre = movie.genre.name;
      data.stock = movie.numberInStock;
      data.rate = movie.dailyRentalRate;
      data._id = movie._id;
      this.setState({ data });
    } catch (ex) {
      if (ex.response && ex.response.status === 404)
        this.props.history.replace("/not-found");
    }
  }

  async componentDidMount() {
    await this.populateGenres();
    await this.populateMovies();
  }

  doSubmit = async () => {
    const { title, genre, stock, rate, _id: movieId } = this.state.data;

    const { data: id } = await getGenres();
    id.filter((obj) => {
      return obj.name === genre;
    });

    const movie = {
      title: title,
      genreId: id[0]._id,
      numberInStock: parseInt(stock),
      dailyRentalRate: parseInt(rate),
      _id: movieId || null,
    };

    saveMovie(movie);
    // window.location = "/";
  };

  render() {
    const genres = this.state.genres;

    return (
      <div>
        <h1>Movie Form</h1>
        <form onSubmit={this.handleSubmit}>
          {this.renderInput("title", "Title")}
          {this.renderDropdown("genre", "Genre", genres)}
          {this.renderInput("stock", "Number in Stock")}
          {this.renderInput("rate", "Rate")}
          {this.renderButton("Save")}
        </form>
      </div>
    );
  }
}

export default MovieForm;
