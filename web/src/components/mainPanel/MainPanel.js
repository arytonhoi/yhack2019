import React from "react";
import "./MainPanel.css";

import ToggleablePanel from "./ToggleablePanel";
import TextPanel from "./TextPanel";

function renderGeneralInsights() {
  const options = {
    on: {
      name: "Positive Reviews",
      render: () => (
        <React.Fragment>
          <div>Image One Goes here </div>
          <div>Image Two Goes Here</div>
        </React.Fragment>
      )
    },
    off: {
      name: "Negative Reviews",
      render: () => (
        <React.Fragment>
          <div>Image One NEG Goes here </div>
          <div>Image Two NEG Goes Here</div>
        </React.Fragment>
      )
    }
  };

  return (
    <React.Fragment>
      {renderTitle("General Insights")}
      {renderTitleText("View the blah blah blah")}
      <ToggleablePanel on={options.on} off={options.off} />
    </React.Fragment>
  );
}

function renderEmployeeSpecific() {
  const options = {
    on: {
      name: "Positive Feedback",
      render: () => (
        <React.Fragment>
          <div>Image One Goes here </div>
          <div>Image Two Goes Here</div>
        </React.Fragment>
      )
    },
    off: {
      name: "Negative Feedback",
      render: () => (
        <React.Fragment>
          <div>Image One NEG Goes here </div>
          <div>Image Two NEG Goes Here</div>
        </React.Fragment>
      )
    }
  };

  return (
    <React.Fragment>
      {renderTitle("Employee-Specific Comments")}
      {renderTitleText("View Some blah blah blah")}
      <div style={{ display: "flex", flexDirection: "row", height: "300px" }}>
        <TextPanel
          style={{ flex: 1 }}
          boldedText='25%'
          bodyText='A lot of gibberish goes here'
        />
        <TextPanel
          style={{ flex: 1 }}
          boldedText='40%'
          bodyText='A lot of gibberish goes here'
        />
      </div>
    </React.Fragment>
  );
}

function renderTitle(title) {
  return <div className='bigTitle'>{title}</div>;
}

function renderTitleText(titleText) {
  return <div className='bigTitleText'>{titleText}</div>;
}

function renderCorrectPanel(selectedPanel) {
  if (selectedPanel === "general-insights") {
    return renderGeneralInsights();
  } else if (selectedPanel === "employee-spec") {
    return renderEmployeeSpecific();
  } else {
    return <div>Some other panel</div>;
  }
}

function MainPanel(props) {
  return (
    <div className='mainPanel'>
      {renderCorrectPanel(props.selected)}
      <TextPanel
        boldedText='50%'
        bodyText='Here is some arbitrrary long description for somthing'
      />
    </div>
  );
}

export default MainPanel;
