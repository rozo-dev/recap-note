import React from "react";
import { Route, Routes } from "react-router-dom";
import App from "../components/App";
import EditNote from "../pages/EditNote";
import Favourites from "../pages/Favourites";
import Collections from "../pages/Collections";
import View from "../pages/View";
import Register from "../pages/Register";
import Login from "../pages/Login";
import Welcome from "../pages/Welcome";
import ViewCollection from "../pages/ViewCollection";
import Page404 from "../pages/Page404";
import PrivateRoute from "./PrivateRoute";

export default function MainRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Welcome />} />
      <Route element={<PrivateRoute />}>
        <Route path="/home" element={<App />} />
        <Route path="/collections" element={<Collections />} />
        <Route path="/edit/:noteId" element={<EditNote />} />
        <Route path="/view/:noteId" element={<View />} />
        <Route path="/favourites" element={<Favourites />} />
        <Route
          path="/view-collection/:collectionId"
          element={<ViewCollection />}
        />
      </Route>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/404" element={<Page404 />} />
      <Route path="*" element={<Page404 />} />
    </Routes>
  );
}
