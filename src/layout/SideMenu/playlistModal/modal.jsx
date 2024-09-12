import React, { useState, useEffect, useCallback,useContext } from 'react';
import { GlobalStateContext } from '../../../context/GlobalStateContext';
import axios from '../../utils/axios';
import track from '../../assets/images/profile.png';
import './modal.scss';

const Modal = () => {
  const [{ playlists, user, showModal, editMode }, { setModal, fetchPlaylistsMenu, updatePlaylist }] = useContext(GlobalStateContext);
  const [header, setHeader] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(track);
  const [btn, setBtn] = useState('');
  const [error, setError] = useState(false);
  
  const playlist = playlists.find(p => p.id === editMode) || { images: [] };
  const userId = user?.id;
  const initialize = useCallback(() => {
    if (editMode) {
      setHeader('Edit Playlist Details');
      setTitle(playlist.name || '');
      setDescription(playlist.description || '');
      setImage(playlist.images.length ? playlist.images[0].url : track);
      setBtn('Save');
      setError(false);
    } else {
      setHeader('Create Playlist');
      setTitle('New Playlist');
      setDescription('');
      setImage(track);
      setBtn('Create');
      setError(false);
    }
  }, [editMode, playlist]);

  useEffect(() => {
    if (showModal) {
      initialize();
    }
  }, [showModal, initialize]);

  const handleChange = (input, event) => {
    if (input === 'title') {
      setTitle(event.target.value);
    } else {
      setDescription(event.target.value);
    }
  };

  const validate = () => {
    if (!title.replace(/\s/g, '').length) {
      setError(true);
      return false;
    }
    return true;
  };

  const onCancel = () => {
    setModal(false);
  };

  const onSubmitNew = async () => {
    if (validate()) {
      try {
        await axios.post(`/users/${userId}/playlists`, {
          name: title,
          description,
        });
        setModal(false);
        fetchPlaylistsMenu();
      } catch (error) {
        console.error('Error creating playlist:', error);
      }
    }
  };

  const onSubmitPlaylist = async () => {
    const changeTitle = playlist.name !== title;
    const changeDescription = playlist.description !== description;

    if (!changeTitle && !changeDescription) {
      return;
    }

    let updatedPlaylist = {};
    if (changeTitle) {
      updatedPlaylist.name = title;
    }
    if (description && changeDescription) {
      updatedPlaylist.description = description;
    }

    if (validate()) {
      try {
        await axios.put(`/playlists/${playlist.id}`, updatedPlaylist);
        setModal(false);
        updatePlaylist(updatedPlaylist);
        if (changeTitle) {
          fetchPlaylistsMenu();
        }
      } catch (error) {
        console.error('Error updating playlist:', error);
      }
    }
  };

  return (
    <div>
      <div className={`playlist-Modal ${showModal ? 'active' : ''}`}>
        <div className="modal-content">
          <div className="modal-title">
            <h4>{header}</h4>
          </div>
          <div className="modal-body">
            <div className="title-input">
              <span>Name</span>
              <input
                value={title}
                onChange={(event) => handleChange('title', event)}
                placeholder="Playlist name"
                maxLength="100"
              />
              <div className="counter">{`${title.length}/100`}</div>
              <div className="description">
                <div className="image">
                  <span>Image</span> <img alt="track" src={image} />
                </div>
                <div className="text">
                  <span>Description</span>
                  <div className="counter">{`${description.length}/300`}</div>
                  <textarea
                    value={description}
                    onChange={(event) => handleChange('description', event)}
                    placeholder="Give your playlist a catchy description."
                    maxLength="300"
                  />
                </div>
              </div>
              <div className={`error-message ${error ? 'active' : ''}`}>
                <i className="fa fa-exclamation" aria-hidden="true" />
                <span>You must give your playlist a name.</span>
              </div>
              <div className="btn-section">
                <button className="cancel-btn" onClick={onCancel}>
                  Cancel
                </button>
                <button
                  className="save-btn"
                  onClick={editMode ? onSubmitPlaylist : onSubmitNew}
                >
                  {btn}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={`overlay ${showModal ? 'active' : ''}`} onClick={onCancel} />
    </div>
  );
};

export default Modal;