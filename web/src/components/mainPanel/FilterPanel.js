import React, { Component } from "react";
import Card from "./Card";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import Search from "@material-ui/icons/Search";
import computedResults from "../../../public/computed.json";

class FilterPanel extends Component {
  constructor(props) {
    super(props);

    this.state = {
      filter: "",
      viewingSize: 3,
      results: this.sourceFilter(computedResults.results),
      selectedTag: ""
    };
  }

  sourceFilter(results) {
    if (this.props.sourceFilter) {
      results = results.filter(match => match.source === this.props.sourceFilter);
    }
    return results;
  }

  filter(results, filter) {
    let matches = [];

    for (let i = 0; i < results.length; i++) {
      let result = results[i];
      if (result.keywords.includes(filter)) {
        let match = {};

        let sentiment;
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

        matches.push(match);
      }
    }

    matches = this.sourceFilter(matches);

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
    this.setState({ filter: "", selectedTag: selectedTag });
    this.applyFilter(selectedTag);
  }

  increaseResultSize() {
    let newSize = Math.min(this.state.viewingSize + 3, this.state.results.length);
    this.setState({ viewingSize: newSize });
  }

  applyFilter(filter) {
    // do something to results
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
                  <Search />
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
              <div className={`singleResult ${result.sentiment}`}>
                <div className='resultHeader'>{result.username}</div>
                <div className='resultContent'>{result.content}</div>
              </div>
            );
          })}
        </div>
        {this.state.results.length >= this.state.viewingSize ? (
          <div className='seeMore'>
            <span onClick={() => this.increaseResultSize.call(this)}>
              See More
            </span>
          </div>
        ) : (
          <div style={{ padding: "20px"}}/>
        )}
      </Card>
    );
  }
}

export default FilterPanel;
