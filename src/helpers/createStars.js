import React from 'react';

const createStars = (rating) => {
  if (rating === '?') {
    return <i className="fas fa-question"></i>;
  }
  const ratingDisplay = [];
  for (let i = 1; i < rating + 1; i += 1) {
    ratingDisplay.push(<i key={i} className="fas fa-star"></i>);
  }
  for (let m = rating + 1; m < 6; m += 1) {
    ratingDisplay.push(<i key={m} className="far fa-star"></i>);
  }
  return ratingDisplay;
};

export default createStars;
