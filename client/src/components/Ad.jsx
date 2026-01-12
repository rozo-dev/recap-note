import React from "react";
import { useNavigate } from "react-router-dom";
import { useNote } from "../contexts/NoteContext";
import { useUser } from "../contexts/UserContext";
import { useAuth } from "../contexts/AuthContext";
import LogoutIcon from "@mui/icons-material/Logout";

const api_base = process.env.REACT_APP_API_URL;

export default function Ad() {
  const { notes, collections, favouriteNotes } = useNote();
  const { userInfo } = useUser();
  const { setJwtToken } = useAuth();

  const navigate = useNavigate();

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
    <div className="ad flex flex-col p-1 overflow-hidden h-max invisible md:visible lg:visible bg-white mt-5 shadow-md">
      <div className="w-full shadow-md mb-5 flex flex-col justify-center">
        <div>
          <img
            src="https://img.freepik.com/free-vector/isolated-young-handsome-man-different-poses-white-background-illustration_632498-859.jpg?size=626&ext=jpg&ga=GA1.1.243834695.1695278669&semt=ais"
            alt="profile"
          />
        </div>
        <div>
          <h3 className="mx-3 md:mr-1 lg:text-base lg:ml-4 md:text-xs font-semibold text-blue">
            {userInfo && userInfo.firstName + " " + userInfo.lastName}
          </h3>
        </div>
      </div>
      <h2 className="account-info text-white px-2 text-lg md:text-base font-extrabold">
        Account
      </h2>
      <div className="account-items w-full shadow-md mb-5 pl-2 flex flex-col justify-center">
        <div>
          <p>Notes:</p>
          <p>{notes.length}</p>
        </div>
        <div>
          <p>Collections:</p>
          <p>{collections.length}</p>
        </div>
        <div>
          <p>Favourites</p>
          <p>{favouriteNotes.length}</p>
        </div>
      </div>
      <div className="w-full h-auto bg-blue px-2.5 py-1 mt-0 z-10">
        <button
          className="text-xl text-white md:text-sm"
          onClick={handleLogOut}
        >
          Log out <LogoutIcon className="ml-2 text-sm md:text-xs" />
        </button>
      </div>
    </div>
  );
}
