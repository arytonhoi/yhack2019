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
      {renderTitleText("View the most current trending words our customers are saying across social media about JetBlue’s cusomter and in-flight service.")}
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
      {renderTitleText("View employee-specific feedback and shoutouts directly from our customers.")}
      <div style={{ display: "flex", flexDirection: "row" }}>
        <TextPanel
          style={{ flex: 1 }}
          boldedText='25%'
          bodyText='of our 2019 social media comments are specific to our employees.'
        />
        <TextPanel
          style={{ flex: 1 }}
          boldedText='40%'
          bodyText='different shoutouts have been given to our JetBlue employees in 2019.'
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
        bodyText='of our 2019 social media comments is comprised of Facebook comments.'
      />
    </div>
  );
}

export default MainPanel;
