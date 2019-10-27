import React, { Component } from "react";
import "./App.css";
import SidePanel from "./components/sidePanel/SidePanel";
import MainPanel from "./components/mainPanel/MainPanel";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedPanel: null
    };
  }

  onPanelSelect(selectedPanel) {
    this.setState({ selectedPanel });
  }

  render() {
    return (
      <div className='app'>
        <SidePanel
          selected={this.state.selectedPanel}
          onPanelSelect={this.onPanelSelect.bind(this)}
        />
        <MainPanel />
      </div>
    );
  }
}

export default App;
