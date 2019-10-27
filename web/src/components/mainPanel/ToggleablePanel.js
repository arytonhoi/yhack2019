import React, { Component } from "react";
import Card from "./Card";

import "./MainPanel.css";

class ToggleablePanel extends Component {
  constructor(props) {
    super(props);

    this.state = {
      toggle: true
    };
  }

  toggleOn() {
    this.setState({ toggle: true });
  }

  toggleOff() {
    this.setState({ toggle: false });
  }

  renderHeader() {
    const on = this.state.toggle ? "selected" : "";
    const off = this.state.toggle ? "" : "selected";

    return (
      <div className='header'>
        <div className='toggleBar'>
          <div onClick={this.toggleOn.bind(this)} className={`toggle ${on}`}>
            {this.props.on.name}
          </div>
          <div onClick={this.toggleOff.bind(this)} className={`toggle ${off}`}>
            {this.props.off.name}
          </div>
        </div>
      </div>
    );
  }

  renderBody() {
    if (this.state.toggle) {
      return this.props.on.render();
    } else {
      return this.props.off.render();
    }
  }

  render() {
    return (
      <Card className='toggleablePanel'>
        {this.renderHeader()}
        <div className='body'>{this.renderBody()}</div>
      </Card>
    );
  }
}

export default ToggleablePanel;
