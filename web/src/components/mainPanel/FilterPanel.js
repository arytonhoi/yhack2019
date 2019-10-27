import React, { Component } from "react";
import Card from "./Card";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import computedResults from "../../../public/computed.json";

class FilterPanel extends Component {
  constructor(props) {
    super(props);

    this.state = {
      filter: "",
      viewingSize: 3,
      results: [],
      selectedTag: ""
    };
  }

  filter(results, filter) {
    var matches = [];

    for (var i = 0; i < results.length; i++) {
      let result = results[i];
      if (result.keywords.includes(filter)) {
        var match = {};

        var sentiment;
        if (result.sentiment_score < 0) {
          sentiment = "negative";
        } else {
          sentiment = "positive";
        }

        match["username"] = result.username;
        match["source"] = result.source;
        match["sentiment"] = sentiment;
        match["location"] = result.location[0];
        match["content"] = result.content;

        matches.push(result);
      }
    }
    return matches;
  }

  onSearchChanged(value) {
    this.setState({ filter: value });
  }

  onEnterKeyPressed() {
    this.setState({ selectedTag: "" });
    this.applyFilter(this.state.filter);
  }

  onTagClicked(selectedTag) {
    this.setState({ selectedTag: selectedTag });
    this.applyFilter(selectedTag);
  }

  increaseResultSize() {
    let newSize = Math.min(this.state.viewingSize + 3, this.results.length);
    this.setState({ viewingSize: newSize });
  }

  applyFilter(filter) {
    // do something to results
    console.log(this.filter(computedResults.results, filter));
    this.setState({ results: this.filter(computedResults.results, filter) });
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
            variant='outlined'
            id='searchInput'
            value={this.state.filter}
            onChange={event =>
              this.onSearchChanged.call(this, event.target.value)
            }
            onKeyPress={event => {
              if (event.key === "Enter") {
                this.onEnterKeyPressed.call(this);
              }
            }}
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
          {this.props.tags.map(tag => {
            return (
              <div
                key={tag}
                onClick={() => this.onTagClicked(tag)}
                className={`searchTerm ${
                  this.state.selectedTag === tag ? "selected" : ""
                }`}>
                {tag}
              </div>
            );
          })}
        </div>
        <div className='results'>
          {this.state.results.slice(0, this.state.viewingSize).map(result => {
            return (
              <div className='singleResult'>
                <div className='resultHeader'>{result.username}</div>
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
