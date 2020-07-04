import "./CircularComponent.css";
import React from "react";
import {
  CircularInput,
  CircularTrack,
  CircularThumb,
  CircularProgress,
} from "react-circular-input";

function CircularComponent(props) {
  const primary = "#f9a73e";
  const secondary = "#264b96";

  return (
    <div class="circular">
      <CircularInput value={props.circularValue} onChange={props.onValueChange}>
        <CircularTrack strokeWidth="20" stroke={primary} />
        <CircularThumb strokeWidth="0" fill={secondary} />
        <CircularProgress
          strokeWidth={20}
          stroke={`rgba(61, 153, 255, ${props.value})`}
        />
      </CircularInput>
      <button
        style={{ backgroundColor: props.innerColor }}
        class="circular--inner-button"
        onClick={props.innerFunction}
      >
        {props.innerValue}
      </button>
    </div>
  );
}

export default CircularComponent;
