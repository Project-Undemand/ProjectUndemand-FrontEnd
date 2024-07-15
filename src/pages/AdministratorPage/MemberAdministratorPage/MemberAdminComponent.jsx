import React from "react";
import { Link, useLocation } from "react-router-dom";

export const MenuItem = ({ link, iconSrc, text }) => {
  const location = useLocation();
  const isActive = location.pathname === link;

  return (
    <li
      className={`menu-item ${isActive ? "active" : ""}`}
      style={{
        borderLeft: isActive ? "5px solid purple" : "none",
      }}
    >
      <Link to={link}>
        <img src={iconSrc} alt={`${text} icon`} className="menu-icon-img" />
        <span className="menu-icon-text">{text}</span>
      </Link>
    </li>
  );
};
