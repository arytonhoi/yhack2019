import React, { Component } from "react";
import SelectablePanel from "./SelectablePanel";
import "./SidePanel.css"; 

class SidePanel extends Component {
  constructor(props) {
    super(props);
  }

  renderSelectablePanel(title, selections, props) {
    const { onPanelSelect, selected } = props;
    const selectors = selections.map(({ name, label }) => {
      return { name, label, onSelect: () => onPanelSelect(name) };
    });

    return (
      <SelectablePanel
        title={title}
        selectors={selectors}
        selected={selected}
      />
    );
  }

  render() {
    const semanticsTitle = "Overall Semantics";
    const semanticsSelections = [
      { name: "general-insights", label: "General Insights" },
      { name: "employee-spec", label: "Employee-Specific" }
    ];

    const insightsTitle = "Specific Insights";
    const insightsSelections = [
      { name: "facebook", label: "Facebook" },
      { name: "twitter", label: "Twitter" },
      { name: "tripadvisor", label: "Trip Advisor" },
      { name: "kayak", label: "Kayak" }
    ];

    return (
      <div className='sidePanel'>
        <div className='staticSidePanel'>
          <div className='title'>Internal Dashboard</div>
          <div>
            {this.renderSelectablePanel(
              semanticsTitle,
              semanticsSelections,
              this.props
            )}
          </div>
          <div>
            {this.renderSelectablePanel(
              insightsTitle,
              insightsSelections,
              this.props
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default SidePanel;
