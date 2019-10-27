import React, { Component } from "react";
import Card from "./Card";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";

class FilterPanel extends Component {
  constructor(props) {
    super(props);

    this.state = {
      filter: "",
      viewingSize: 3,
      results: []
    };
  }

  onSearchChanged(value) {
    this.setState({ filter: value });
  }

  increaseResultSize() {
    let newSize = Math.min(this.state.viewingSize + 3, this.results.length);
    this.setState({ viewingSize: newSize });
  }

  applyFilter() {
    // do something to results
    this.setState({ results: [] });
  }

  render() {
    return (
      <Card className='filterPanel'>
        <div className='header'>
          <div className='title'>{this.props.title}</div>
          <div className='titleText'>{this.props.titleText}</div>
        </div>
        <div className='search'>
          <TextField
            variant="outlined"
            id="searchInput"
            value={this.state.filter}
            onChange={event =>
              this.onSearchChanged.call(this, event.target.value)
            }
            onBlur={this.applyFilter.bind(this)}
            className='searchInput'
            InputProps={{
              startAdornment: (
                <InputAdornment position='start'>
                  <div className='material-icons'>search</div>
                </InputAdornment>
              )
            }}
          />
        </div>
        <div className='terms'>
          {this.props.searchableTerms.map(searchableTerm => {
            return (
              <div
                key={searchableTerm}
                onClick={() => this.onSearchChanged.call(this, searchableTerm)}
                className='searchTerm'>
                {searchableTerm}
              </div>
            );
          })}
        </div>
        <div className='results'>
          {this.state.results.slice(0, this.state.viewingSize).map(result => {
            return (
              <div className='singleResult'>
                <div className='resultHeader'>{result.header}</div>
                <div className='resultContent'>{result.content}</div>
              </div>
            );
          })}
        </div>
        <div className='seeMore'>
          <span onClick={() => this.increaseResultSize.call(this)}>
            See More
          </span>
        </div>
      </Card>
    );
  }
}

export default FilterPanel;
