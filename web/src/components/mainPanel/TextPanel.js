import React from "react";
import Card from "./Card";
import "./MainPanel.css";

function TextPanel(props) {
  const { boldedText, bodyText } = props;
  return (
    <Card className='textPanel' style={props.style}>
      <div className='bolded'>{boldedText}</div>
      <div className='body'>{bodyText}</div>
    </Card>
  );
}

export default TextPanel;
