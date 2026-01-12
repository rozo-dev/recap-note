import React, { useState, useEffect } from "react";
import { useParams, Navigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Menu from "../components/Menu";
import Ad from "../components/Ad";
import AccountMobile from "../components/AccountMobile";
import Button from "@mui/material/Button";
import { useNote } from "../contexts/NoteContext";
import { useUser } from "../contexts/UserContext";
import { useAuth } from "../contexts/AuthContext";

import "../styles.css";
const api_base = process.env.REACT_APP_API_URL;

export default function EditNote() {
  const { userID } = useUser();
  const { jwtToken } = useAuth();

  const { noteId } = useParams();
  const { notes } = useNote();
  const [noteData, setNoteData] = useState({
    title: "",
    content: "",
  });
  const [updateSuccess, setSuccess] = useState(false);

  useEffect(() => {
    const noteEdited = async (noteId) => {
      if (jwtToken) {
        const response = await fetch(api_base + `/edit/${noteId}/${userID}`, {
          method: "GET",
          credentials: "include",
          headers: { Authorization: `Bearer ${jwtToken}` },
        });

        if (!response.ok) {
          throw new Error("Network Error failed to fetch.");
        }
        const data = response.json();
        return data;
      }
    };

    noteEdited(noteId)
      .then((data) => {
        setNoteData(data);
      })
      .catch((err) => console.error(err));
  }, [noteId, userID, jwtToken]);

  const handleClick = async (event) => {
    event.preventDefault();
    try {
      if (jwtToken) {
        const headers = {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwtToken}`,
        };

        await fetch(api_base + `/edit/${noteId}/${userID}`, {
          method: "PUT",
          credentials: "include",
          headers,
          body: JSON.stringify(noteData),
        });
      }
    } catch (error) {
      setSuccess(false);
      console.error("Error:", error.message);
    }
    setSuccess(true);
  };

  function handleChange(event) {
    const { name, value } = event.target;

    setNoteData((prevValue) => ({
      ...prevValue,
      [name]: value,
    }));
  }

  return (
    <>
      <div className="grid-container">
        <Header />
        <AccountMobile />
        <Menu />
        <Ad notes={notes} />
        <Footer />
        <div className="container">
          <form
            className="edit-form w-400 md:w-full lg:w-full h-50 md:h-full lg:h-full bg-white shadow-md rounded-md p-2.5 my-5 mx-auto"
            method="Post"
          >
            <input
              onChange={handleChange}
              name="title"
              type="text"
              value={noteData.title}
              className="w-full h-12 pl-2.5 block border-1 border-blue rounded-md mb-7"
            />
            <textarea
              onChange={handleChange}
              rows="3"
              name="content"
              value={noteData.content}
              className="block border-1 border-blue rounded-md  w-full h-80 pl-2.5"
            />
            <Button
              onClick={handleClick}
              variant="contained"
              size="small"
              className="update-btn w-full py-1.5 px-0 text-base font-normal text-white cursor-pointer font-poppins"
            >
              Update
            </Button>
          </form>
        </div>
      </div>
      {updateSuccess && <Navigate to="/home" replace={true} />}
    </>
  );
}
