import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthService from "../../../services/AuthService";
import instance from "../../../utils/axios";
import { CgProfile } from "react-icons/cg";
import { FaCaretDown } from "react-icons/fa";
// import { GlobalStateContext } from "../../../context/GlobalStateContext";
import axios from "axios";
export default function UserDetails() {
  const [dropdown, setDropdown] = useState(false);
  const [profileImage, setProfileImage] = useState("");
  const [displayName, setDisplayName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      const accessToken = AuthService.currentToken.get();

      if (!accessToken) {
        console.error("No access token found");
        return;
      }

      try {
        const response = await instance.get("/me", {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        if (response.data) {
          setProfileImage(response.data.images?.[0]?.url || "");
          setDisplayName(response.data.display_name || "Unknown User");
        }
      } catch (error) {
        console.error("Error fetching profile image:", error);
      }
    };

    fetchUserProfile();
  }, []);

  const handleDropdown = () => setDropdown(!dropdown);
  const handleLogout = () => {
    AuthService.logout();
    navigate("/login");
  };

  return (
    <div className="details-container">
      <div className="user-icon">
        {profileImage ? <img alt="user" className="user-image" src={profileImage} /> : <CgProfile />}
      </div>
      <p className="user-name">{displayName}</p>
      <div className="dropdown">
        <button onClick={handleDropdown} className="dropdown-btn">
          <FaCaretDown />
        </button>
        {dropdown && (
          <div className="dropdown-content">
            <ul>
              <li>
                <button type="button" onClick={() => navigate("/profile")}>
                  Profile
                </button>
              </li>
              <li>
                <button type="button" onClick={() => navigate("/settings")}>
                  Settings
                </button>
              </li>
              <li>
                <button onClick={handleLogout}>Logout</button>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}