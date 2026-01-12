import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useNote } from "../contexts/NoteContext";
import { useUser } from "../contexts/UserContext";
import { useAuth } from "../contexts/AuthContext";
import LogoutIcon from "@mui/icons-material/Logout";
import CloseIcon from "@mui/icons-material/Close";

import "../styles.css";

const api_base = process.env.REACT_APP_API_URL;

export default function AccountMobile() {
  const [showAccountInfo, setShowAccountInfo] = useState(false);
  const { notes, collections, favouriteNotes } = useNote();
  const { userInfo } = useUser();

  const navigate = useNavigate();
  const { setJwtToken } = useAuth();

  const openAccountInfo = () => {
    setShowAccountInfo(true);
  };
  const closeAccountInfo = () => {
    setShowAccountInfo(false);
  };

  const handleLogOut = async () => {
    try {
      const response = await fetch(api_base + "/logout", {
        method: "POST",
      });

      if (response.ok) {
        localStorage.clear();
        setJwtToken("");
        navigate("/", { replace: true });
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      {showAccountInfo && (
        <div className=" mobile-menu md:invisible lg:invisible absolute top-0 right-0 z-50 max-w-50vw w-vw40 h-auto bg-white">
          <div className="top w-full h-auto py-.5 px-0 m-0 text-blue flex flex-row justify-start">
            <CloseIcon onClick={closeAccountInfo} />
          </div>
          <div className="w-full">
            <div className="w-full shadow-md mb-2 flex flex-col justify-center">
              <img
                className="w-30 h-30"
                src="https://img.freepik.com/free-vector/isolated-young-handsome-man-different-poses-white-background-illustration_632498-859.jpg?size=626&ext=jpg&ga=GA1.1.243834695.1695278669&semt=ais"
                alt="profile"
              />

              <div>
                <h3 className="text-center text-sm font-semibold text-blue">
                  {userInfo.firstName + " " + userInfo.lastName}
                </h3>
              </div>
            </div>
          </div>
          <div className="w-full h-auto bg-blue px-2.5 py-1">
            <button className="text-md text-white" onClick={handleLogOut}>
              Log out <LogoutIcon className="ml-2 text-sm" />
            </button>
          </div>
        </div>
      )}
      <div className="account-mobile shadow-md  mt-0 py-2 px-3 w-full flex flex-row h-auto bg-white md:invisible lg:invisible z-10">
        <div className="account-items mobile w-3/4 h-auto flex flex-row m-0">
          <div>
            <p>Notes:</p>
            <p>{notes.length}</p>
          </div>
          <div>
            <p>Collections:</p>
            <p>{collections.length}</p>
          </div>
          <div>
            <p>Favourites:</p>
            <p>{favouriteNotes.length}</p>
          </div>
        </div>
        <div className="w-1/4 h-auto relative m-0 text-right">
          <div
            onClick={openAccountInfo}
            className="rounded-full w-6 h-6 absolute right-1"
            style={{
              backgroundImage: `url(
              "https://www.pngfind.com/pngs/m/610-6104451_image-placeholder-png-user-profile-placeholder-image-png.png"
            )`,
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
            }}
          ></div>
        </div>
      </div>
    </>
  );
}
