import React, { Component } from "react";
import { getMovies, deleteMovie } from "../services/movieService";
import { getGenres } from "../services/genreService";
import Pagination from "./common/pagination";
import MoviesTable from "./moviesTable";
import ListGroup from "./common/listGroup";
import { paginate } from "../utils/paginate";
import _ from "lodash";
import { NavLink } from "react-router-dom";

class Movies extends Component {
  state = {
    movies: [],
    pageSize: 4,
    currentPage: 1,
    genres: [],
    sortColumn: { path: "title", order: "asc" },
    search: "",
  };

  async componentDidMount() {
    const { data } = await getGenres();

    const genres = [{ _id: "", name: "All Genres" }, ...data];
    const { data: movies } = await getMovies();
    this.setState({ movies, genres });
  }

  handleDelete = async (movie) => {
    const originalMovies = this.state.movies;
    const movies = originalMovies.filter((m) => m._id !== movie._id);
    this.setState({ movies });
    try {
      await deleteMovie(movie._id);
    } catch (ex) {
      if (ex.response && ex.response === 404)
        alert("This movie has already been deleted");
      this.setState({ movies: originalMovies });
    }
  };

  handleHeart = (movie) => {
    const movies = [...this.state.movies];
    const index = movies.indexOf(movie);
    movies[index] = { ...movies[index] };

    movies[index].liked = !movies[index].liked;
    this.setState({ movies });
  };

  handlePageChange = (page) => {
    this.setState({ currentPage: page });
  };

  handleGenreSelect = (genre) => {
    this.setState({
      selectedGenre: genre,
      currentPage: 1,
      search: "",
    });
  };

  handleSort = (sortColumn) => {
    this.setState({ sortColumn });
  };

  getPageData = () => {
    const {
      pageSize,
      currentPage,
      movies: allMovies,
      selectedGenre,
      sortColumn,
      search,
    } = this.state;

    let filtered = allMovies;
    if (search) {
      filtered = allMovies.filter((e) =>
        e.title.toLowerCase().startsWith(search)
      );
    } else if (selectedGenre && selectedGenre._id) {
      filtered = allMovies.filter((m) => m.genre._id === selectedGenre._id);
    }

    const sorted = _.orderBy(filtered, [sortColumn.path], [sortColumn.order]);

    const movies = paginate(sorted, currentPage, pageSize);

    return { totalCount: filtered.length, data: movies };
  };

  handleSearch = ({ currentTarget: input }) => {
    this.setState({
      selectedGenre: "All Genres",
      currentPage: 1,
      search: input.value,
    });
  };

  render() {
    const { pageSize, currentPage, sortColumn } = this.state;
    const { totalCount, data: movies } = this.getPageData();
    const { user } = this.props;

    return (
      <div>
        <div className="row">
          <div className="col-3">
            <ListGroup
              items={this.state.genres}
              selectedItem={this.state.selectedGenre}
              onItemSelect={this.handleGenreSelect}
            />
          </div>
          <div className="col">
            {user && (
              <NavLink
                type="button"
                className="btn btn-primary mb-2"
                to="/movies/new"
              >
                New Movie
              </NavLink>
            )}
            <p className="lead">{`Showing ${totalCount} movies in the database`}</p>
            <input
              className="form-control mb-2"
              name="search"
              value={this.state.search}
              placeholder="Search..."
              onChange={this.handleSearch}
            />
            <MoviesTable
              movies={movies}
              onLike={this.handleHeart}
              onDelete={this.handleDelete}
              onSort={this.handleSort}
              sortColumn={sortColumn}
            />
            <Pagination
              itemsCount={totalCount}
              pageSize={pageSize}
              onPageChange={this.handlePageChange}
              currentPage={currentPage}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default Movies;
