import React, { Component } from "react";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import TableRow from "@material-ui/core/TableRow";
import Button from "@material-ui/core/Button";

import computedResults from "../../../public/computed.json";
import exportEmployees from "../../../public/employees.csv";

import fbIcon from "../../../public/images/logo_facebook.png";
import tripIcon from "../../../public/images/logo_tripadvisor.png";
import twitterIcon from "../../../public/images/logo_twitter.png";

import Card from "./Card";

class TablePanel extends Component {
  constructor(props) {
    super(props);
    this.employees = this.filter(computedResults.results);

    this.state = {
      viewingSize: Math.min(this.employees.length, 10)
    };
  }

  filter(results) {
    return results
      .filter(res => res.employees !== undefined && res.employees !== [])
      .map(result => ({ ...result, employee: result.employees[0] }))
      .filter(result => result.employee)
      .map(result => ({ ...result, sentiment: result.sentiment_score < 0 ? 'Negative' : 'Positive'}));
  }

  renderIcon(source) {
    if (source === "facebook") { 
      return <img src={fbIcon} height={"30px"}/>
    } else if (source === "twitter") {
      return <img src={twitterIcon} height={"30px"}/>
    } else if (source === "tripadvisor") {
      return <img src={tripIcon} height={"30px"}/>      
    }
    return <div>ICON</div>
  }

  renderSentiment(sentiment) {
    return <div className={`text ${sentiment}`}>{sentiment}</div>;
  }

  renderContent(content) {
    return <div style={{ overflow: "hidden", height: "1.1em", lineHeight: "1em" }}>{content}</div>
  }

  increaseResultSize() {
    let newSize = Math.min(this.state.viewingSize + 3, this.employees.length);
    this.setState({ viewingSize: newSize });
  }

  onExportButtonClick() {
    window.open(exportEmployees);
  }

  render() {
    return (
      <Card className='tablePanel'>
        <Button onClick={this.onExportButtonClick} variant="contained" className='exportButton'>Download Full CSV</Button>
        <div className='tableTitle'>{this.props.title}</div>
        <div className='tableSubTitle'>{this.props.subtitle}</div>
        <Table className='table'>
          <TableHead className="tablehead">
            <TableRow>
              <TableCell>Employee</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Source</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Sentiment</TableCell>
              <TableCell>Comment</TableCell>
            </TableRow>
          </TableHead>
          <TableBody className="tablebody">
            {this.employees.slice(0, this.state.viewingSize).map((result) => {
              return (
                <TableRow>
                  <TableCell>{result.employee}</TableCell>
                  <TableCell>{result.locations ? result.locations[0] : ""}</TableCell>
                  <TableCell>{this.renderIcon(result.source)}</TableCell>
                  <TableCell>{result.date}</TableCell>
                  <TableCell>{this.renderSentiment(result.sentiment)}</TableCell>
                  <TableCell style={{ maxWidth: "100px"}}>{this.renderContent(result.content)}</TableCell>
                </TableRow>
              )         
            })}
          </TableBody>
        </Table>
        {this.employees.length >= this.state.viewingSize ? (
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

export default TablePanel;