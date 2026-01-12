import React, { useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Menu from "../components/Menu";
import Ad from "../components/Ad";
import AccountMobile from "../components/AccountMobile";
import Note from "../components/Note";
import AddToCollection from "../apis/AddToCollection";
import { useNote } from "../contexts/NoteContext";
import { useUser } from "../contexts/UserContext";
import { useAuth } from "../contexts/AuthContext";
import CloseIcon from "@mui/icons-material/Close";
import "../styles.css";

const api_base = process.env.REACT_APP_API_URL;

export default function Favourites() {
  const { userInfo } = useUser();
  const { jwtToken } = useAuth();

  const {
    notes,
    favouriteNotes,
    setFavouriteNotes,
    updateFavourites,
    setUpdateFavourites,
    collections,
    noteId,
    setShowCollectionPane,
    showCollectionPane,
  } = useNote();

  //triggers loadNotes
  useEffect(() => {
    if (!userInfo) {
      return;
    }
    const loadFavourites = async () => {
      if (jwtToken) {
        await fetch(api_base + `/favourites/${userInfo._id}`, {
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
            setFavouriteNotes(data);
            setUpdateFavourites(false);
          })
          .catch((error) => console.error("Error" + error.message));
      }
    };

    loadFavourites();
    // eslint-disable-next-line
  }, [userInfo, updateFavourites, setFavouriteNotes]);

  function AddNoteToCollection(cid) {
    AddToCollection(cid, noteId, userInfo._id);
  }

  function closeCollectionPane() {
    setShowCollectionPane(false);
  }
  return (
    <>
      {showCollectionPane && (
        <div className="rounded-md shadow-md absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col p-0 max-h-50vh h-60 max-w-50vw w-60 bg-white text-blue z-50">
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
                <div className="w-full">
                  <h3
                    className="my-1 px-2 text-xl cursor-pointer bg-blue bg-opacity-50 text-white"
                    key={collection._id}
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
      <div className="grid-container">
        <Header />
        <AccountMobile />
        <Menu />
        <Ad notes={notes} />
        <Footer />
        <div className="container w-full h-full mt-5 overflow-y-scroll overflow-x-hidden  flex flex-row flex-wrap content-start px-2">
          {favouriteNotes.length === 0 ? (
            <h2 className="transform -translate-x-1/2 -translate-y-1/2 text-base font-bold text-blue bg-white absolute top-1/2 left-1/2">
              You don't have any favourites yet.
            </h2>
          ) : (
            favouriteNotes &&
            favouriteNotes.map((note) => (
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
