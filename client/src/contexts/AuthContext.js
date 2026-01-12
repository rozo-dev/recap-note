import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider(props) {
  // Check if there's an authentication state stored in localStorage
  const initialIsAuthenticated =
    localStorage.getItem("isAuthenticated") === "true";

  const initialJwtToken = JSON.parse(localStorage.getItem("jwtToken"));

  const tokenJWT = initialJwtToken ? initialJwtToken : "";

  const [jwtToken, setJwtToken] = useState(tokenJWT);

  const [isAuthenticated, setIsAuthenticated] = useState(
    initialIsAuthenticated
  );

  useEffect(() => {
    localStorage.setItem("jwtToken", JSON.stringify(jwtToken));
  }, [jwtToken]);

  // Use useEffect to update localStorage when isAuthenticated changes
  useEffect(() => {
    localStorage.setItem("isAuthenticated", isAuthenticated.toString());
  }, [isAuthenticated]);

  const values = { isAuthenticated,     setIsAuthenticated, jwtToken, setJwtToken };

  return (
    <AuthContext.Provider value={values}>{props.children}</AuthContext.Provider>
  );
}
