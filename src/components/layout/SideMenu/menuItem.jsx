// src/components/layoutComponents/SideMenu/menuItem.jsx
import React from "react";
import propTypes from "prop-types";
import "./SideMenu.scss";

const MenuItem = ({ title, active, onClick }) => (
	<li className={`menu-item ${active ? "active" : ""}`} onClick={onClick}>
		{title}
	</li>
);

MenuItem.propTypes = {
	title: propTypes.string.isRequired,
	active: propTypes.bool.isRequired,
	onClick: propTypes.func.isRequired
};

export default MenuItem;
