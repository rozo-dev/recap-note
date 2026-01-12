import React, { useState, createContext, useContext } from "react";

const NoteContext = createContext();

export function useNote() {
  return useContext(NoteContext);
}

export function NoteProvider(props) {
  const [notes, setNotes] = useState([]);
  const [notesUpdated, setNotesUpdated] = useState(false);
  const [favouriteNotes, setFavouriteNotes] = useState([]);
  const [updateFavourites, setUpdateFavourites] = useState(false);
  const [collections, setCollections] = useState([]);
  const [collectionUpdated, setCollectionUpdated] = useState(false);
  const [showCollectionPane, setShowCollectionPane] = useState(false);
  const [collectionNotesUpdated, setCollectionNotesUpdated] = useState(false);
  const [collectionId, setCollectionId] = useState("");
  const [noteId, setNoteId] = useState("");

  const values = {
    notes,
    setNotes,
    notesUpdated,
    setNotesUpdated,
    favouriteNotes,
    setFavouriteNotes,
    updateFavourites,
    setUpdateFavourites,
    collections,
    setCollections,
    collectionUpdated,
    setCollectionUpdated,
    showCollectionPane,
    setShowCollectionPane,
    collectionId,
    setCollectionId,
    noteId,
    setNoteId,
    collectionNotesUpdated,
    setCollectionNotesUpdated,
  };

  return (
    <NoteContext.Provider value={values}>
      {props.children}{" "}
    </NoteContext.Provider>
  );
}
