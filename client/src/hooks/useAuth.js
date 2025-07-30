// src/hooks/useAuth.js
import { useContext } from "react";
// Change this line:
// import AuthContext from "../context/AuthContext";
// To this:
import { AuthContext } from "../context/AuthContext"; // <--- CHANGE THE IMPORT HERE

export const useAuth = () => {
  return useContext(AuthContext);
};