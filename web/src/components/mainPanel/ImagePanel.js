import React from "react";
import Card from "./Card";
import "./MainPanel.css";

function ImagePanel(props) {
	const { titleText } = props;
	const { url } = props;
	return (
		<Card className='imagePanel' style={props.style}>
		<div className='titleText'>{titleText}</div>
		<img className="image" src={url} />
		</Card>
		);
	}

	export default ImagePanel;
