import React, { Component } from "react";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import TableRow from "@material-ui/core/TableRow";
import Button from "@material-ui/core/Button";
import computedResults from "../../../public/computed.json";

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

    }
    return <div>ICON</div>
  }

  renderSentiment(sentiment) {
    return <div className={`text ${sentiment}`}>{sentiment}</div>;
  }

  renderContent(content) {
    return <div style={{ overflow: "hidden", height: "1.1em", lineHeight: "1em" }}>{content}</div>
  }

  render() {
    return (
      <Card className='tablePanel'>
        <Button variant="contained" className='exportButton'>Download Full CSV</Button>
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
      </Card>
    );
  }
}

export default TablePanel;