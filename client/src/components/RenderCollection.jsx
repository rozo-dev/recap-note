import React, { useState } from "react";
import { NavLink } from "react-router-dom";
//import getRandomImage from "../apis/getRandomImage";
//import { useNote } from "../contexts/NoteContext";
import { useUser } from "../contexts/UserContext";
import { useNote } from "../contexts/NoteContext";
import deleteCollection from "../apis/deleteCollection";
import MoreVertIcon from "@mui/icons-material/MoreVert";

export default function RenderCollection(props) {
  const {
    collections,
    setCollections,
    setCollectionUpdated,
    setShowCollectionPane,
    showCollectionPane,
    setCollectionId,
  } = useNote();

  const { userInfo } = useUser();
  const [openOption, setOpenOption] = useState(false);

  function openCollectionPane() {
    setCollectionId(props.id);
    setShowCollectionPane(true);
  }

  function handleDelete() {
    deleteCollection(props.id, userInfo, collections, setCollections);
    setCollectionUpdated(true);
  }
  
  function toggleOptionPane() {
    setOpenOption(!openOption);
    if (showCollectionPane) {
      setShowCollectionPane(false);
    }
  }

  return (
    <>
      <div className="m-2 bg-white rounded-md shadow-md box-border w-full h-auto relative overflow-hidden self-start">
        {openOption && (
          <div className="absolute right-5 top-1 max-w-50vw h-auto z-50 bg-blue text-white p-1">
            <p
              className="mt-1 text-xxs block cursor-pointer"
              onClick={openCollectionPane}
            >
              Add a Note
            </p>
            <p
              onClick={handleDelete}
              className="mt-1 text-xxs block cursor-pointer"
            >
              Delete
            </p>
          </div>
        )}

        <div
          className="w-full h-28"
          style={{
            background: `url(${
              props.img
                ? props.img
                : "https://images.unsplash.com/photo-1693858837984-c0a8829fe3d7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwxOXx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=60"
            })`,
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
          }}
        >
          <div className="w-full h-7 relative text-white p-0 z-10">
            <MoreVertIcon
              className="absolute right-0"
              onClick={toggleOptionPane}
            />
          </div>
        </div>
        <div>
          <div className="px-1">
            <h2 className="text-blue font-jost text-2xl block">{props.name}</h2>
          </div>
          <div className="flex flex-row justify-center py-1 bg-blue w-full text-white">
            <div className="w-3/4 h-auto text-left flex flex-col justify-center pl-1">
              <p className="text-xs">created: {props.date}</p>
            </div>
            <div className="w-1/4 h-auto text-right pr-2">
              <NavLink
                className="text-xs font-semibold px-1.5 bg-white text-blue rounded-sm"
                to={`/view-collection/${props.id}`}
              >
                View
              </NavLink>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
