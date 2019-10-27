import React from "react";

function SelectablePanel(props) {
  const { title, selectors, selected } = props;
  return (
    <div className='selectablePanel'>
      <div className='header' label={title}>
        {title}
      </div>
      <div className='menu'>
        {selectors.map(selector => {
          const { name, label, onSelect } = selector;
          const cName = `menuItem ${selected == name ? "selected" : ""}`;
          return (
            <div
              className={cName}
              label={label}
              onClick={() => onSelect()}>
              {name}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default SelectablePanel;
