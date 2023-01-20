import React from "react";
import PropTypes from "prop-types";
 
const Popup = ({formattedLikes, handleClose}) => {

  Popup.propTypes = {
    handleClose: PropTypes.func,
    formattedLikes: PropTypes.object,
  }

  return (
    <div className="popup-box">
      <div className="box">
        <span className="close-icon" onClick={handleClose}>x</span>
        <p>Likes: {formattedLikes.likes}</p>
        <p>&#x1F49A;: {formattedLikes.hearts}</p>
        <p>&#x1F525;: {formattedLikes.fires}</p>
        <p>&#x1F621;: {formattedLikes.angrys}</p>
      </div>
    </div>
  );
};
 
export default Popup;