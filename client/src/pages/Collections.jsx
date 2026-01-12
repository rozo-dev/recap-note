import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Menu from "../components/Menu";
import Ad from "../components/Ad";
import AccountMobile from "../components/AccountMobile";
import RenderCollection from "../components/RenderCollection";
import CreateCollection from "../components/CreateCollection";
import AddToCollection from "../apis/AddToCollection";
import { useNote } from "../contexts/NoteContext";
import { useUser } from "../contexts/UserContext";
import { useAuth } from "../contexts/AuthContext";
import CloseIcon from "@mui/icons-material/Close";

import "../styles.css";

const api_base = process.env.REACT_APP_API_URL;

export default function Collections() {
  const { userInfo } = useUser();
  const { jwtToken } = useAuth();

  const {
    notes,
    setNotes,
    collections,
    setCollections,
    collectionUpdated,
    setCollectionUpdated,
    collectionId,
    setShowCollectionPane,
    showCollectionPane,
  } = useNote();
  const [statusMessage, setStatusMessage] = useState("");
  const [showMessage, setShowMessage] = useState(false);

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
            setCollectionUpdated(false);
          })
          .catch((error) => console.error("Error" + error.message));
      }
    };
    loadCollections();
    // eslint-disable-next-line
  }, [userInfo, collectionUpdated, setCollections]);

  //loadNotes

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
  //collection Pane

  function closeCollectionPane() {
    setShowCollectionPane(false);
  }

  //Add note to your collection
  async function AddNoteToCollection(nid) {
    const message = await AddToCollection(collectionId, nid, userInfo._id);
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

  return (
    <>
      <CreateCollection />
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
        <Ad notes={notes} />
        <Footer />
        <div className="container w-full h-full mt-5 overflow-y-scroll overflow-x-hidden  flex flex-row flex-wrap content-start px-2 ">
          {collections.length === 0 ? (
            <h2 className="transform -translate-x-1/2 -translate-y-1/2 text-base font-bold text-blue bg-white absolute top-1/2 left-1/2">
              You don't have any collections yet. Click the + button to start
              adding.
            </h2>
          ) : (
            collections &&
            collections.map((collection) => (
              <div
                key={collection._id}
                className="w-1/2 h-auto flex justify-center sm:w-1/2 md:w-1/2 lg:w-1/3 xl:w-1/4 p-0 m-0"
              >
                <RenderCollection
                  key={collection._id}
                  id={collection._id}
                  name={collection.name}
                  date={collection.createdAt}
                  img={collection.image}
                />
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}
