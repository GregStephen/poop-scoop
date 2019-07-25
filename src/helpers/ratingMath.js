const ratingMath = (ratings) => {
  const total = ratings.reduce((acc, c) => acc + c, 0);
  return Math.round(total / ratings.length);
};

export default ratingMath;
