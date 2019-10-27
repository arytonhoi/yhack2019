import React from "react";
import "./MainPanel.css";

import positiveGraphImage from "../../../public/images/positive-graph.png";
import positiveCloudImage from "../../../public/images/positive-cloud.png";
import negativeGraphImage from "../../../public/images/negative-graph.png";
import negativeCloudImage from "../../../public/images/negative-cloud.png";

import shortLineStatsBGImage from "../../../public/images/short-line-stats.png";
import shortBarStatsBGImage from "../../../public/images/short-bar-stats.png";
import longStatsBGImage from "../../../public/images/long-stats.png";

import facebookCloudImage from "../../../public/images/facebook-cloud.png";

import ToggleablePanel from "./ToggleablePanel";
import TextPanel from "./TextPanel";
import ImagePanel from "./ImagePanel";
import FilterPanel from "./FilterPanel";

function renderGeneralInsights() {
  const options = {
    on: {
      name: "Positive Reviews",
      render: () => (
        <React.Fragment>
          <img
            style={{ width: "100%", marginBottom: "20px" }}
            src={positiveGraphImage}></img>
          <div style={{ width: "75%", margin: "auto" }}>
            <img style={{ width: "100%" }} src={positiveCloudImage}></img>
          </div>
        </React.Fragment>
      )
    },
    off: {
      name: "Negative Reviews",
      render: () => (
        <React.Fragment>
          <img
            style={{ width: "100%", marginBottom: "20px" }}
            src={negativeGraphImage}></img>
          <div style={{ width: "75%", margin: "auto" }}>
            <img style={{ width: "100%" }} src={negativeCloudImage}></img>
          </div>
        </React.Fragment>
      )
    }
  };

  return (
    <React.Fragment>
      {renderTitle("General Insights")}
      {renderTitleText(
        "View the most current trending words our customers are saying across social media about JetBlue’s customer and in-flight service."
      )}
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
      {renderTitleText(
        "View employee-specific feedback and shoutouts directly from our customers."
      )}
      <div style={{ display: "flex", flexDirection: "row", height: "240px" }}>
        <TextPanel
          style={{
            flex: 1,
            backgroundImage: `url(${shortBarStatsBGImage})`,
            backgroundSize: "100%"
          }}
          boldedText='13%'
          bodyText='of our 2019 social media comments are about our employees.'
        />
        <TextPanel
          style={{
            flex: 1,
            backgroundImage: `url(${shortLineStatsBGImage})`,
            backgroundSize: "100%"
          }}
          boldedText='202'
          bodyText='shoutouts have been given to our JetBlue employees in 2019.'
        />
      </div>
    </React.Fragment>
  );
}

function renderFacebookInsights() {
  return (
    <React.Fragment>
      <TextPanel
        style={{
          flex: 1,
          backgroundImage: `url(${longStatsBGImage})`,
          backgroundSize: "110%",
          height: "240px"
        }}
        boldedText='32%'
        bodyText='of our 2019 social media comments is comprised of Facebook comments.'
      />
      <ImagePanel
        titleText='Trending Words on Facebook Comments'
        url={facebookCloudImage}
      />
      <FilterPanel
        title={"Filter Facebook Comments"}
        titleText={"Search or filter for a keyword to see what customers are saying on JetBlue’s Facebook posts for 2019."}
        tags={["entertainment", "aircraft", "baggage", "wi-fi", "flights"]}
      />
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
  } else if (selectedPanel === "facebook") {
    return renderFacebookInsights();
  } else {
    return <div>Some other panel</div>;
  }
}

function MainPanel(props) {
  return <div className='mainPanel'>{renderCorrectPanel(props.selected)}</div>;
}

export default MainPanel;
