import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Menu from "../components/Menu";
import Ad from "../components/Ad";
import AccountMobile from "../components/AccountMobile";
import Note from "../components/Note";
import { useNote } from "../contexts/NoteContext";
import { useUser } from "../contexts/UserContext";
import { useAuth } from "../contexts/AuthContext";
import AddToCollection from "../apis/AddToCollection";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import Zoom from "@mui/material/Zoom";

import "../styles.css";

const api_base = process.env.REACT_APP_API_URL;

export default function ViewCollection() {
  const { userInfo } = useUser();
  const { jwtToken } = useAuth();

  const { collectionId } = useParams();
  const {
    notes,
    setNotes,
    setCollectionNotesUpdated,
    collectionNotesUpdated,
    setShowCollectionPane,
    showCollectionPane,
  } = useNote();

  const [statusMessage, setStatusMessage] = useState("");
  const [showMessage, setShowMessage] = useState(false);
  const [collectionNotes, setCollectionNotes] = useState([]);
  const [viewedCollection, setviewedCollection] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (jwtToken) {
          const response = await fetch(
            api_base + `/view-collection/${collectionId}/${userInfo._id}`,
            {
              method: "GET",
              credentials: "include",
              headers: { Authorization: `Bearer ${jwtToken}` },
            }
          );
          if (response.ok) {
            const data = await response.text();
            const returnedCollection = JSON.parse(data);
            const notes = returnedCollection.notes;
            setviewedCollection(returnedCollection);
            setCollectionNotes(notes);
            setCollectionNotesUpdated(false);
          }
        }
      } catch (error) {
        console.error("Error fetching collection notes: " + error.message);
      }
    };

    fetchData();
  }, [
    jwtToken,
    collectionId,
    userInfo._id,
    collectionNotesUpdated,
    setCollectionNotesUpdated,
  ]);

  useEffect(() => {
    if (!userInfo) {
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
        }
      } catch (error) {
        console.error("Error" + error.message);
      }
    };
    loadNotes();
    // eslint-disable-next-line
  }, [userInfo]);

  //Collection

  async function AddNoteToCollection(nid) {
    const message = await AddToCollection(collectionId, nid, userInfo._id);
    setStatusMessage(message);
    setShowMessage(true);
    setCollectionNotesUpdated(!collectionNotesUpdated);
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
  function openCollectionPane() {
    setShowCollectionPane(true);
  }

  return (
    <>
      {showCollectionPane && (
        <div className="rounded-md shadow-md absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col p-0 max-h-50vh h-60 max-w-50vw w-60 bg-white text-blue z-50">
          <div className="relative flex flex-row justify-center w-full h-auto bg-blue">
            <div className="w-full 3/4 pl-1">
              <h2 className="text-white text-xl font-semibold">Notes</h2>
            </div>
            <div className="w-full 1/4 text-right pr-1">
              <button className="text-white mr-0">
                <CloseIcon onClick={closeCollectionPane} />
              </button>
            </div>
          </div>
          <div className="w-full h-full overflow-y-scroll">
            {notes.map((note) => {
              return (
                <div key={note._id} className="w-full">
                  <h3
                    className="my-1 px-2 text-xl cursor-pointer bg-blue bg-opacity-50 text-white"
                    onClick={() => AddNoteToCollection(note._id)}
                  >
                    {note.title}
                  </h3>
                </div>
              );
            })}
          </div>
        </div>
      )}
      {showMessage &&
        (statusMessage.includes("exist") ? (
          <p className="text-base text-red font-semibold absolute transform -translate-x-1/2 -translate-y-1/2 top-16 right-1/4 z-50">
            {statusMessage}
          </p>
        ) : (
          <p className="text-base text-green font-semibold absolute transform -translate-x-1/2 -translate-y-1/2 top-16 right-1/4 z-50">
            {statusMessage}
          </p>
        ))}
      <div className="grid-container">
        <Header />
        <AccountMobile />
        <Menu />
        <Ad />
        <Zoom in={true}>
          <button
            onClick={openCollectionPane}
            className="w-10 h-10 rounded-full bg-blue text-white fixed right-9 bottom-20  lg:right-32 lg:bottom-12 md:right-20 md:bottom-12 z-50"
          >
            <AddIcon />
          </button>
        </Zoom>
        <Footer />
        <div className="container view-collection w-full h-full mt-5 overflow-y-scroll overflow-x-hidden  flex flex-row flex-wrap content-start px-2">
          <h2 className="font-jost text-3xl text-blue">
            {viewedCollection.name}
          </h2>
          <hr className="w-full h-1 border-0" />
          {collectionNotes.length === 0 ? (
            <h2 className="transform -translate-x-1/2 -translate-y-1/2 text-base font-bold text-blue bg-white absolute top-1/2 left-1/2">
              You don't have any Notes in this collection.
            </h2>
          ) : (
            <>
              {collectionNotes &&
                collectionNotes.map((note) => (
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
                ))}
            </>
          )}
        </div>
      </div>
    </>
  );
}
