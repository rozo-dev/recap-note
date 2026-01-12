import React, { useEffect, useState } from "react";
import Header from "./Header";
import Note from "./Note";
import Footer from "./Footer";
import CreateNote from "./CreateNote";
import Menu from "./Menu";
import Ad from "./Ad";
import AccountMobile from "./AccountMobile";
import AddToCollection from "../apis/AddToCollection";
import CloseIcon from "@mui/icons-material/Close";
import { useUser } from "../contexts/UserContext";
import { useNote } from "../contexts/NoteContext";
import { useAuth } from "../contexts/AuthContext";

import "../styles.css";

const api_base = process.env.REACT_APP_API_URL;

export default function App() {
  const {
    notes,
    setNotes,
    notesUpdated,
    setNotesUpdated,
    collections,
    setCollections,
    noteId,
    setShowCollectionPane,
    showCollectionPane,
  } = useNote();

  const { jwtToken } = useAuth();
  const { userInfo, userID, setUserInfo } = useUser();
  
  const [userInfoFetched, setUserInfoFetched] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [showMessage, setShowMessage] = useState(false);

  //fetch userInfo
  useEffect(() => {
    if (!userID) {
      return;
    }
    const getUserInfo = async () => {
      try {
        if (jwtToken) {
          const response = await fetch(api_base + `/user/${userID}`, {
            method: "GET",
            credentials: "include",
            headers: { Authorization: `Bearer ${jwtToken}` },
          });

          if (response.ok) {
            const data = await response.json();
            setUserInfo(data);
            localStorage.setItem("userInfo", JSON.stringify(data));
            setUserInfoFetched(true);
          }
        }
      } catch (error) {
        console.error(error);
      }
    };
    getUserInfo();
  }, [userID, setUserInfo, jwtToken]);
  //loadNotes

  useEffect(() => {
    if (!userInfoFetched) {
      return;
    }
    const loadNotes = async () => {
      try {
        if (jwtToken) {
          const response = await fetch(api_base + `/notes/${userInfo._id}`, {
            method: "GET",
            credentials: "include",
            headers: { Authorization: `Bearer ${jwtToken}` },
          });

          if (!response.ok) {
            throw new Error("Network Error failed to fetch.");
          }

          const data = await response.json();
          setNotes(data);
          setNotesUpdated(false);
        }
      } catch (error) {
        console.error("Error" + error.message);
      }
    };
    loadNotes();
    // eslint-disable-next-line
  }, [setNotes, userInfo, userInfoFetched, notesUpdated]);

  //load all collections
  useEffect(() => {
    if (!userInfo) {
      return;
    }

    const loadCollections = async () => {
      if (jwtToken) {
        await fetch(api_base + `/collections/${userInfo._id}`, {
          method: "GET",
          credentials: "include",
          headers: { Authorization: `Bearer ${jwtToken}` },
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error("Network Error failed to fetch.");
            }
            return response.json();
          })
          .then((data) => {
            setCollections(data);
          })
          .catch((error) => console.error("Error" + error.message));
      }
    };

    loadCollections();
    // eslint-disable-next-line
  }, [userInfo]);

  //CollectionPane

  async function AddNoteToCollection(cid) {
    const message = await AddToCollection(cid, noteId, userInfo._id);
    setStatusMessage(message);
    setShowMessage(true);
  }
  useEffect(() => {
    if (showMessage) {
      const timer = setTimeout(() => {
        setShowMessage(false);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [showMessage]);

  function closeCollectionPane() {
    setShowCollectionPane(false);
  }

  return (
    <>
      <CreateNote />
      {showCollectionPane && (
        <div className="cPane rounded-md shadow-md absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col p-0 max-h-50vh h-60 max-w-50vw w-60 bg-white text-blue z-50">
          <div className="relative flex flex-row justify-center w-full h-auto bg-blue">
            <div className="w-full 3/4 pl-1">
              <h2 className="text-white text-xl font-semibold">Collections</h2>
            </div>
            <div className="w-full 1/4 text-right pr-1">
              <button className="text-white mr-0">
                <CloseIcon onClick={closeCollectionPane} />
              </button>
            </div>
          </div>
          <div className="w-full h-full  overflow-y-scroll">
            {collections.map((collection) => {
              return (
                <div key={collection._id} className="w-full">
                  <h3
                    className="my-1 px-2 text-xl cursor-pointer bg-blue bg-opacity-50 text-white"
                    onClick={() => AddNoteToCollection(collection._id)}
                  >
                    {collection.name}
                  </h3>
                </div>
              );
            })}
          </div>
        </div>
      )}
      {showMessage &&
        (statusMessage.includes("exist") ? (
          <p className="text-red text-xxs whitespace-nowrap font-semibold absolute transform -translate-x-1/2 -translate-y-1/2 top-25 md:top-16 lg:top-16 left-1/2 z-50">
            {statusMessage}
          </p>
        ) : (
          <p className="text-green text-xxs whitespace-nowrap font-semibold absolute transform -translate-x-1/2 -translate-y-1/2 top-25 md:top-16 lg:top-16 left-1/2 z-50">
            {statusMessage}
          </p>
        ))}
      <div className="grid-container">
        <Header />
        <AccountMobile />
        <Menu />
        <Ad />
        <Footer />
        <div className="container w-full h-full mt-5 overflow-y-scroll overflow-x-hidden  flex flex-row flex-wrap content-start px-2">
          {notes.length === 0 ? (
            <h2 className="transform -translate-x-1/2 -translate-y-1/2 text-base font-bold text-blue bg-white absolute top-1/2 left-1/2">
              You don't have any notes yet. Click the + button to start adding
              notes.
            </h2>
          ) : (
            notes &&
            notes.map((note) => (
              <div
                key={note._id}
                className="w-1/2 h-auto flex justify-center sm:w-1/2 md:w-1/2 lg:w-1/3 xl:w-1/4 p-0 m-0"
              >
                <Note
                  key={note._id}
                  id={note._id}
                  title={note.title}
                  content={note.content}
                  date={note.createdAt}
                  favourited={note.favourited}
                />
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}
