import React from "react";
import { Link } from "react-router-dom";
import "../styling/header.css"; // Import header styles
import logo from "../Images/Logo.png"; // Adjust path if necessary

function Header() {
  return (
    <header className="header">
      <div className="logo">
        <img src={logo}></img>
      </div>
      <nav>
        <ul className="nav-links">
          <li>
            <Link to="/home">Home</Link>
          </li>
          <li>
            <Link to="/movies">Movies</Link>
          </li>
          <li>
            <Link to="/music">Music</Link>
          </li>
          <li>
            <Link to="/audiobooks">Audiobooks</Link>
          </li>
          <li>
            <Link to="/Games">Games</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;
