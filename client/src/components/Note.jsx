import React, { useState, useEffect } from "react";
import { NavLink, useLocation, useParams } from "react-router-dom";
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { useUser } from "../contexts/UserContext";
import { useNote } from "../contexts/NoteContext";
import { useAuth } from "../contexts/AuthContext";
import deleteNote from "../apis/deleteNote";
import deleteFromCollection from "../apis/deleteFromCollection";
import MoreVertIcon from "@mui/icons-material/MoreVert";

const api_base = process.env.REACT_APP_API_URL;

function Note(props) {
  const location = useLocation();
  const currentPath = location.pathname;
  const { collectionId } = useParams();
  const { userInfo } = useUser();
  const { jwtToken } = useAuth();

  const [openOption, setOpenOption] = useState(false);

  const {
    setCollectionNotesUpdated,
    collectionNotesUpdated,
    setShowCollectionPane,
    showCollectionPane,
    notes,
    setNotes,
    setNotesUpdated,
    setUpdateFavourites,
    setNoteId,
  } = useNote();

  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const maxContentLength = screenWidth < 640 ? 20 : 50;

  const contentToDisplay =
    props.content.length > maxContentLength
      ? props.content.substring(0, 50)
      : props.content;

  function openCollectionPane() {
    setNoteId(props.id);
    setShowCollectionPane(true);
  }
  function toggleOptionPane() {
    setOpenOption(!openOption);
    if (showCollectionPane) {
      setShowCollectionPane(false);
    }
  }

  function handleDelete() {
    deleteNote(props.id, userInfo, notes, setNotes);
    setNotesUpdated(true);
  }

  const toggleFavourites = async () => {
    try {
      if (jwtToken) {
        const response = await fetch(
          api_base + `/toggleFavourites/${props.id}/${userInfo._id}`,
          {
            method: "PUT",
            credentials: "include",
            headers: { Authorization: `Bearer ${jwtToken}` },
          }
        );

        if (response.ok) {
          setNotesUpdated(true);
          setUpdateFavourites(true);
        }
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  function handleRemove() {
    deleteFromCollection(collectionId, props.id, userInfo._id);
    setCollectionNotesUpdated(!collectionNotesUpdated);
  }

  return (
    <div
      className="m-2 bg-white rounded-md shadow-md box-border w-full lg:w-72 md:w-96 h-auto relative overflow-hidden self-start 
    "
    >
      {openOption && (
        <div className="absolute right-5 top-1 max-w-50vw h-auto z-10 bg-blue text-white p-1">
          <p
            className="mt-1 text-xxs block cursor-pointer"
            onClick={openCollectionPane}
          >
            Add to Collection
          </p>
          {currentPath.startsWith("/view-collection") && (
            <p
              className="mt-1 text-xxs block cursor-pointer"
              onClick={handleRemove}
            >
              Remove from Collection
            </p>
          )}
          <a
            href={`/edit/${props.id}`}
            className="mt-1 text-xxs block text-white"
          >
            Edit
          </a>
          <p onClick={handleDelete} className="mt-1 text-xxs block">
            Delete
          </p>
        </div>
      )}

      <div className="noteTop w-full h-7 relative text-blue p-0">
        <MoreVertIcon className="absolute right-0" onClick={toggleOptionPane} />
      </div>

      <div className="px-1">
        <h1 className="text-blue font-jost text-2xl mb-2 block">
          {props.title}
        </h1>
        <div className="content-box w-full h-10 overflow-y-auto mb-1">
          <p className="text-base  whitespace-pre-wrap break-words inline text-blue">
            {contentToDisplay}
          </p>
          {screenWidth < 640
            ? props.content.length >= 21 && (
                <NavLink
                  className="text-xss text-cyan inline ml-1"
                  to={`/view/${props.id}`}
                >
                  read more...
                </NavLink>
              )
            : props.content.length >= 50 && (
                <NavLink
                  className="text-xs text-blue inline ml-1"
                  to={`/view/${props.id}`}
                >
                  read more...
                </NavLink>
              )}
        </div>
      </div>
      <div className="note-meta w-full py-0 px-1 bg-blue flex flex-row items-center justify-center flex-nowrap relative bottom-0 z-0">
        <p className="text-xxs whitespace-pre break-words my-auto mx-0 w-full text-white">
          Created: {props.date}
        </p>

        <div className="flex flex-row p-0 m-0 ml-auto">
          <button className="border-0" onClick={toggleFavourites}>
            {props.favourited ? (
              <FavoriteOutlinedIcon className="favourite text-Dred text-xxs" />
            ) : (
              <FavoriteBorderIcon className="unfavourite text-white text-xxs" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Note;
