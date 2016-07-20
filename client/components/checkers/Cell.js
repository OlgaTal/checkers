/* eslint-disable jsx-quotes, react/prop-types, max-len, no-underscore-dangle */

import React from 'react';
const black = 'http://www.bgshop.com/img/v152005-main.jpg';
const red = 'http://www.bgshop.com/img/v152008-main.jpg';

export default (props) => {
  let src = props.cell.isP1 ? red : '';
  if (src === '') {
    src = props.cell.isP2 ? black : '';
  }

  const cell = `${props.cell.x} - ${props.cell.y}`;
  const data = JSON.stringify(props.cell);

  const img = <img data-cell={data} onClick={props.onClick} alt={cell} src={src} height='60' />

  return (
    <div className='cell'>
      {img}
    </div>
  );
};
