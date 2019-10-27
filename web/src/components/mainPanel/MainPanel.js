import React from "react";
import "./MainPanel.css";

import ToggleablePanel from "./ToggleablePanel";

function MainPanel(props) {
  const options = {
    on: {
      name: "Positive Reviews",
      render: () => <div>Something goes here</div>
    },
    off: {
      name: "Negative Reviews",
      render: () => <div>Something else goes here</div>
    }
  };
  return <ToggleablePanel on={options.on} off={options.off} />;
}

export default MainPanel;
