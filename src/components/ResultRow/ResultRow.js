import React from 'react';

import yelpDataShape from '../../helpers/propz/yelpDataShape';
import './ResultRow.scss';

class ResultRow extends React.Component {
  static propTypes = {
    result: yelpDataShape.yelpDataShape,
  }

  render() {
    const { result } = this.props;
    return (
      <li className="ResultRow">
        {result.name}
      </li>
    );
  }
}

export default ResultRow;
