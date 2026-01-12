import React from "react";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="text-center bg-white shadow-md">
      <p className="text-blue my-1.5 mx-0">copyright @ {year}</p>
    </footer>
  );
}
