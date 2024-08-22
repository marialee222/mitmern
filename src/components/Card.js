import React from 'react';
import PropTypes from 'prop-types';

function Card({ bgcolor, txtcolor, header, title, text, body, status }) {
  function classes() {
    const bg = bgcolor ? ' bg-' + bgcolor : '';
    const txt = txtcolor ? ' text-' + txtcolor : ' text-white';
    return 'card mb-3' + bg + txt;
  }

  return (
    <div className={classes()} style={{ maxWidth: '18rem' }}>
      <div className="card-header">{header}</div>
      <div className="card-body">
        {title && <h5 className="card-title">{title}</h5>}
        {text && <p className="card-text">{text}</p>}
        {body}
        {status && <div id="createStatus">{status}</div>}
      </div>
    </div>
  );
}

Card.propTypes = {
  bgcolor: PropTypes.string,
  txtcolor: PropTypes.string,
  header: PropTypes.string,
  title: PropTypes.string,
  text: PropTypes.string,
  body: PropTypes.node,
  status: PropTypes.string,
};

export default Card;
