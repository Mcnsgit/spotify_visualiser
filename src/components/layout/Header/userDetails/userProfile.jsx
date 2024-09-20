import React from 'react';

const UserProfile = ({ user }) => {
  return (
    <div className="media">
      <div className="pull-left">
        <img className="media-object" width="150" src={user.images[0]?.url} alt="Profile" />
      </div>
      <div className="media-body">
        <dl className="dl-horizontal">
          <dt>Display name</dt>
          <dd className="clearfix">{user.display_name}</dd>
          <dt>Id</dt>
          <dd>{user.id}</dd>
          <dt>Email</dt>
          <dd>{user.email}</dd>
          <dt>Spotify URI</dt>
          <dd><a href={user.external_urls.spotify}>{user.external_urls.spotify}</a></dd>
          <dt>Link</dt>
          <dd><a href={user.href}>{user.href}</a></dd>
          <dt>Profile Image</dt>
          <dd className="clearfix"><a href={user.images[0]?.url}>{user.images[0]?.url}</a></dd>
          <dt>Country</dt>
          <dd>{user.country}</dd>
        </dl>
      </div>
    </div>
  );
};

export default UserProfile;