import React from "react";
import { Link } from "react-router-dom";

export const MenuItem = ({ link, iconSrc, text, active, onClick }) => {
  return (
    <li
      className={`menu-item overview ${active ? "active" : ""}`}
      onClick={onClick}
      style={{
        borderLeft: active ? "5px solid purple" : "none",
      }}
    >
      <Link to={link}>
        <img src={iconSrc} alt="default-image" className="menu-icon-img" />
        <span>{text}</span>
      </Link>
    </li>
  );
};
