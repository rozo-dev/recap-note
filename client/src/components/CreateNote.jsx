import React, { useState, useEffect } from "react";
import AddButton from "./AddButton";
import CancelButton from "./CancelButton";
import { useNote } from "../contexts/NoteContext";
import { useUser } from "../contexts/UserContext";
import addNote from "../apis/addNotes";

export default function CreateNote(props) {
  const { setNotes, setNotesUpdated } = useNote();
  const { userInfo } = useUser();
  const [note, setNote] = useState({
    title: "",
    content: "",
  });

  const [isExpanded, setExpand] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [showMessage, setShowMessage] = useState(false);

  async function submitNote(event) {
    event.preventDefault();
    const message = await addNote(userInfo, setNotes, note);
    setStatusMessage(message);
    setShowMessage(true);
    setNotesUpdated(true);
    setNote({
      title: "",
      content: "",
    });
  }

  useEffect(() => {
    if (showMessage) {
      const timer = setTimeout(() => {
        setShowMessage(false);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [showMessage]);

  function handleChange(event) {
    const { name, value } = event.target;

    setNote((prevValue) => ({
      ...prevValue,
      [name]: value,
    }));
  }

  function expand() {
    setExpand(true);
  }

  function close() {
    setExpand(false);
  }

  return (
    <>
      <div className="absolute w-full max-w-screen max-h-screen h-screen flex flex-col items-center justify-center overflow-hidden">
        {isExpanded && (
          <form
            className="w-80 lg:w-1/2 md:w-1/3 h-auto bg-white rounded-md shadow-md flex flex-col pt-4 px-0 pb-0 absolute right-auto left-auto top-auto z-50 overflow-auto"
            onSubmit={submitNote}
          >
            {showMessage &&
              (statusMessage.includes("Successfully") ? (
                <p className="text-green ml-2">{statusMessage}</p>
              ) : (
                <p className="text-red ml-2">{statusMessage}</p>
              ))}
            <CancelButton click={close} />
            <input
              onChange={handleChange}
              name="title"
              type="text"
              placeholder="title"
              value={note.title}
              className="border-0 mb-3 mt-4 ml-2 p-2.5 block"
            />
            <textarea
              rows="8"
              onChange={handleChange}
              name="content"
              placeholder="note.."
              value={note.content}
              className="border-0 mb-3 ml-2 p-2.5 block overflow-hidden"
            />
            <button
              type="submit"
              className="submitNote-btn w-full py-1.5 px-0 text-base font-normal text-white cursor-pointer font-poppins"
            >
              Add
            </button>
          </form>
        )}
      </div>

      <AddButton click={expand} />
    </>
  );
}
