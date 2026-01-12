import React, { useState, useEffect } from "react";
import AddButton from "./AddButton";
import Button from "@mui/material/Button";
import { useNote } from "../contexts/NoteContext";
import { useUser } from "../contexts/UserContext";
import addCollection from "../apis/addCollection";
import CloseIcon from "@mui/icons-material/Close";

export default function CreateNote() {
  const { setCollectionUpdated, setCollections } = useNote();
  const { userInfo } = useUser();
  const [collectionName, setCollectionName] = useState("");

  const [isExpanded, setExpand] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [showMessage, setShowMessage] = useState(false);

  async function submitCollection(event) {
    event.preventDefault();
    try {
      await addCollection(
        userInfo,
        setCollections,
        collectionName,
        setStatusMessage
      );

      setShowMessage(true);
    } catch (error) {
      console.error(error);
    }
    setCollectionUpdated(true);
    setCollectionName("");
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowMessage(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, [showMessage]);

  function expand() {
    setExpand(true);
  }

  function close() {
    setExpand(false);
  }

  return (
    <>
      <div className="absolute w-full max-w-screen max-h-screen h-screen flex flex-col items-center justify-center ">
        {isExpanded && (
          <form
            className="w-80 lg:w-1/2 md:w-1/3 h-auto bg-white rounded-md shadow-md flex flex-col pt-4 px-0 pb-0 absolute right-auto left-auto top-auto z-50 overflow-auto"
            onSubmit={submitCollection}
          >
            <div className="w-full h-auto flex flex-row justify-center px-2">
              <div className="w-3/4 text-left">
                {showMessage &&
                  (statusMessage.includes("Successfully") ? (
                    <p className="text-xs lg:text-sm mt-1 text-green">
                      {statusMessage}
                    </p>
                  ) : (
                    <p className="text-sm lg:text-sm mt-1 text-red">
                      {statusMessage}
                    </p>
                  ))}
              </div>
              <div className="w-1/4 text-right h-auto">
                <button onClick={close}>
                  <CloseIcon />
                </button>
              </div>
            </div>

            <input
              onChange={(e) => setCollectionName(e.target.value)}
              name="name"
              type="text"
              placeholder="collection name"
              value={collectionName}
              autoComplete={collectionName}
              className="border-0 mb-3 mt-4 ml-2 p-2.5 block"
            />
            <Button
              type="submit"
              variant="contained"
              size="small"
              className="submitNote-btn w-full py-1.5 px-0 text-base font-normal text-white cursor-pointer font-poppins"
            >
              Add
            </Button>
          </form>
        )}
      </div>

      <AddButton click={expand} />
    </>
  );
}
