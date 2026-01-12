import React from "react";
import AddIcon from "@mui/icons-material/Add";
import Fab from "@mui/material/Fab";
import Zoom from "@mui/material/Zoom";

export default function AddButton(props) {
  return (
    <form className="buttonForm">
      <Zoom in={true}>
        <Fab
          className="w-10 h-10 bg-blue text-white fixed right-9 bottom-20  lg:right-32 lg:bottom-12 md:right-20 md:bottom-12 z-50"
          onClick={() => {
            props.click();
          }}
          color="primary"
          aria-label="add"
        >
          <AddIcon />
        </Fab>
      </Zoom>
    </form>
  );
}
