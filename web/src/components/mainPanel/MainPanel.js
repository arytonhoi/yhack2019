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
import twitterCloudImage from "../../../public/images/twitter-cloud.png";
import tripAdvisorCloudImage from "../../../public/images/tripadvisor-cloud.png";

import ToggleablePanel from "./ToggleablePanel";
import TextPanel from "./TextPanel";
import ImagePanel from "./ImagePanel";
import FilterPanel from "./FilterPanel";
import TablePanel from "./TablePanel";

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
      <TablePanel title='Compiled Employee-Specific Feedback' subtitle='An immediate extensive list can be downloaded in a full Excel sheet in the upper right' />
    </React.Fragment>
  );
}

function renderFacebookInsights() {
  return (
    <React.Fragment>
      {renderTitle("Insights from Facebook")}
      {renderTitleText("View the most current trending words our customers are saying on Facebook about JetBlue's customer and in-flight service.")}
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
        titleText={
          "Search or filter for a keyword to see what customers are saying on JetBlue’s Facebook posts for 2019."
        }
        sourceFilter={"facebook"}
        tags={["flight", "bag", "customer service", "class", "smiles"]}
      />
    </React.Fragment>
  );
}

function renderTwitterInsights() {
  return (
    <React.Fragment>
      {renderTitle("Insights from Twitter")}
      {renderTitleText("View the most current trending words our customers are saying on Twitter about JetBlue's customer and in-flight service.")}
      <TextPanel
        style={{
          flex: 1,
          backgroundImage: `url(${longStatsBGImage})`,
          backgroundSize: "110%",
          height: "240px"
        }}
        boldedText='18%'
        bodyText='of our 2019 social media comments is comprised of Twitter tweets.'
      />
      <ImagePanel
        titleText='Trending Words on Twitter tweets'
        url={twitterCloudImage}
      />
      <FilterPanel
        title={"Filter Twitter Comments"}
        titleText={
          "Search or filter for a keyword to see what customers are saying on JetBlue’s Twitter posts for 2019."
        }
        sourceFilter={"twitter"}
        tags={["entertainment", "aircraft", "baggage", "wi-fi", "flights"]}
      />
    </React.Fragment>
  );
}

function renderTripAdvisorInsights() {
  return (
    <React.Fragment>
      {renderTitle("Insights from Trip Advisor")}
      {renderTitleText("View the most current trending words our customers are saying on Trip Advisor about JetBlue's customer and in-flight service.")}
      <TextPanel
        style={{
          flex: 1,
          backgroundImage: `url(${longStatsBGImage})`,
          backgroundSize: "110%",
          height: "240px"
        }}
        boldedText='50%'
        bodyText='of our 2019 social media comments is comprised of Trip Advisor reviews.'
      />
      <ImagePanel
        titleText='Trending Words on Trip Advisor Reviews'
        url={tripAdvisorCloudImage}
      />
      <FilterPanel
        title={"Filter Trip Advisor Reviews"}
        titleText={
          "Search or filter for a keyword to see what customers are saying on JetBlue’s Trip Advisor page."
        }
        sourceFilter={"tripadvisor"}
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
  } else if (selectedPanel === "twitter") {
    return renderTwitterInsights();
  } else if (selectedPanel === "tripadvisor") {
    return renderTripAdvisorInsights();
  } else {
    return <div>Still In Progress ... Come back another time</div>;
  }
}

function MainPanel(props) {
  return <div className='mainPanel'>{renderCorrectPanel(props.selected)}</div>;
}

export default MainPanel;
