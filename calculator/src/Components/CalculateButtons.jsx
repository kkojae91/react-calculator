import React from "react";

export default function CalculateButtons({
  parentClassName,
  childClassName,
  onClick,
  buttons,
  isFocused = () => false,
}) {
  return (
    <div className={parentClassName} onClick={onClick}>
      {buttons.map((button) => {
        return (
          <button
            key={button}
            className={
              isFocused(button)
                ? `${childClassName}--focused`
                : `${childClassName}`
            }
          >
            {button}
          </button>
        );
      })}
    </div>
  );
}
