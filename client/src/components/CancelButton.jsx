import React from "react";
import CloseIcon from "@mui/icons-material/Close";
import Zoom from "@mui/material/Zoom";

export default function CancelButton(props) {
  return (
    <Zoom in={true}>
      <button
        className="cancel-btn text-blue border-0 w-10 absolute right-0"
        onClick={() => {
          props.click();
        }}
        aria-label="add"
      >
        <CloseIcon />
      </button>
    </Zoom>
  );
}
