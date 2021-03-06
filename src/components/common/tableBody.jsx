import React, { Component } from "react";
import _ from "lodash";
import { Link } from "react-router-dom";

class TableBody extends Component {
  renderCell = (item, column) => {
    if (column.content) return column.content(item);
    return _.get(item, column.path);
  };

  createKey = (item, column) => item._id + (column.path || column.key);

  renderColumns = (item, column) => {
    if (column.path === "title") {
      return (
        <td key={this.createKey(item, column)}>
          <Link to={`/movies/${item._id}`}>
            {this.renderCell(item, column)}
          </Link>
        </td>
      );
    }
    return (
      <td key={this.createKey(item, column)}>
        {this.renderCell(item, column)}
      </td>
    );
  };

  render() {
    const { data, columns } = this.props;

    return (
      <tbody>
        {data.map((item) => (
          <tr key={item._id}>
            {columns.map((column) => this.renderColumns(item, column))}
          </tr>
        ))}
      </tbody>
    );
  }
}

export default TableBody;
