import React from "react";
import { NavLink } from "react-router-dom";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";


export default function Page404() {
  return (
    <div className="bg-white max-h-screen max-w-screen w-screen h-screen flex flex-col lg:flex-row justify-center items-center px-6 py-4">
      <div className="w-full lg:w-1/2">
        <img className="w-96 lg:w-full" src="assets/404.png" alt="laptop" />
      </div>
      <div className="w-full lg:w-1/2 flex flex-col justify-center">
        <div className="my-6 text-center">
          <h1 className="inline text-xl text-blue font-semibold">
            Opssie, You Landed In The Wrong Place.
            <br /> <span className="text-red">PAGE NOT FOUND!</span>
          </h1>
        </div>
        <div className="flex flex-row justify-center">
          <NavLink
            className="bg-blue text-white text-sm lg:text-2xl text-center font-semibold rounded-md py-2 px-8"
            to="/"
          >
            <ArrowRightAltIcon className="transform -scale-x-150 mr-1" />
            Home
          </NavLink>
        </div>
      </div>
    </div>
  );
}
