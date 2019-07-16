const seperateRatings = () => {
  const { reviews } = this.state;
  const { restroomTypes } = this.props;
  restroomTypes.forEach((type) => {
    if (type.id === 'restroom0') {
      const unisexRatings = [];
      const unisexRatingsMatch = reviews.filter(review => review.restroomType === type.id);
      unisexRatingsMatch.forEach((match) => {
        const justRatings = ((match.decor + match.cleanliness) / 2);
        unisexRatings.push(justRatings);
      });
      this.setState({ unisexRatings });
    } else if (type.id === 'restroom1') {
      const maleRatings = [];
      const maleRatingsMatch = reviews.filter(review => review.restroomType === type.id);
      maleRatingsMatch.forEach((match) => {
        const justRatings = ((match.decor + match.cleanliness) / 2);
        maleRatings.push(justRatings);
      });
      this.setState({ maleRatings });
    } else if (type.id === 'restroom2') {
      const femaleRatings = [];
      const femaleRatingsMatch = reviews.filter(review => review.restroomType === type.id);
      femaleRatingsMatch.forEach((match) => {
        const justRatings = ((match.decor + match.cleanliness) / 2);
        femaleRatings.push(justRatings);
      });
      this.setState({ femaleRatings });
    }
  });
};

export default seperateRatings;
