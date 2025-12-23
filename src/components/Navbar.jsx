import React from "react";
import { Link, useNavigate } from "react-router-dom";
import Profile from "./Profile";
import axiosInstance from "../utils/axiosInstance";
import { signOutSuccess } from "../redux/slice/userSlice";
import { useDispatch } from "react-redux";
import SearchBar from "./SearchBar";

const Navbar = ({
  searchQuery,
  setSearchQuery,
  onSearchNote,
  handleClearSearch,
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onLogout = async () => {
    try {
      // Attempt to call backend signout (optional)
      await axiosInstance.post("/user/signout");
    } catch (error) {
      console.error("Signout API failed:", error);
      // Continue logout even if API fails
    } finally {
      // Clear Redux state
      dispatch(signOutSuccess());

      // Clear localStorage
      localStorage.removeItem("currentUser");

      // Redirect to login
      navigate("/login");
    }
  };

  const handleSearch = () => {
    if (searchQuery) {
      onSearchNote(searchQuery);
    }
  };

  const onClearSearch = () => {
    handleClearSearch();
    setSearchQuery("");
  };

  return (
    <div className="bg-white flex items-center justify-between px-10 py-2 drop-shadow sticky top-0 z-10">
      <Link to={"/"}>
        <h1 className="font-bold text-2xl sm:text-2xl flex flex-wrap">
          <span className="text-blue-400">Travel</span>
          <span className="text-blue-800">Diary</span>
        </h1>
      </Link>

      <SearchBar
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        handleSearch={handleSearch}
        onClearSearch={onClearSearch}
      />

      <Profile onLogout={onLogout} />
    </div>
  );
};

export default Navbar;
