/* eslint-disable no-nested-ternary */
import React from 'react';

const forWhichBathroom = (restroomTypes, review) => {
  const restroom = restroomTypes.filter(type => type.id === review.restroomType);
  return (
    <p className="col-5 col-md-2 sex-symbol">{restroom[0].restroomType === 'Unisex' ? <i>&#x26A5;</i> : restroom[0].restroomType === 'Male' ? <i>&#x2642;</i> : <i>&#x2640;</i>}</p>
  );
};

export default forWhichBathroom;
