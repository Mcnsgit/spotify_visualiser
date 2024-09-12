import React from 'react';

import Message from '../message/message';

const NoResults = ({ query }) => (
  <Message
    icon="fa-flag-o"
    title={`No results found for "${query}"`}
    description="Please make sure your words are spelled correctly or use less or
    different keywords."
  />
);

export default NoResults;
