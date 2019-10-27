import React from 'react';
import "./MainPanel.css";

function Card(props) {
  return (
    <div style={props.style} className={props.className + " card"}>
      {props.children}
    </div>
  )
}

export default Card;