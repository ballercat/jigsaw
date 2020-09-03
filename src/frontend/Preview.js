import PropTypes from 'prop-types';
import React from 'react';

export const Preview = ({ source }) => {
  return <img src={source} alt="Puzzle Image Preview" />;
};

Preview.propTypes = {
  source: PropTypes.string.isRequired,
};
