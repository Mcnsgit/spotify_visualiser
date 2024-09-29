import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { CgProfile } from "react-icons/cg";
import { FaCaretDown } from "react-icons/fa";
import axios from "axios";
import { AuthContext } from "../../../../AuthContext"; // Import the useAuth hook
import api from "../../../../utils/axios";

export default function UserDetails() {
  const [dropdown, setDropdown] = useState(false);
  const [profileImage, setProfileImage] = useState("");
  const [displayName, setDisplayName] = useState("");
  const navigate = useNavigate();
  const { accessToken } = useContext(AuthContext); // Use useContext to access accessToken

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        // Use the access token in the request headers
        const response = await axios.get("https://api.spotify.com/v1/me", {
          headers: {
            Authorization: `Bearer ${accessToken}`, // Include the access token
          },
        });

        if (response.status === 200) {
          console.log(response.data);
          setProfileImage(response.data.images?.[0]?.url || "");
          setDisplayName(response.data.display_name || "Unknown User");
        }
      } catch (error) {
        console.error("Error fetching profile image:", error);
        navigate("/login");
        // Optional: Provide user feedback here, e.g., set an error state
      }
    };

    if (accessToken) {
      fetchUserProfile(); // Fetch user profile only if access token is available
    } else {
      navigate("/login"); // Redirect to login if no access token
    }
  }, [navigate, accessToken]);

  const handleDropdown = () => setDropdown((prev) => !prev);
  const handleLogout = () => {
    api.logout();
    navigate("/login");
  };

  return (
    <div className="details-container">
      <div className="user-icon">
        {profileImage ? (
          <img alt="user" className="user-image" src={profileImage} />
        ) : (
          <CgProfile />
        )}
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