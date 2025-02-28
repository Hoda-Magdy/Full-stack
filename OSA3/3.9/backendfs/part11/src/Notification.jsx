import React from 'react';
import './Notification.css';
const Notification = ({ message, type }) => {
    if (message === null) {
      return null;
    }
  
    const messageStyle = type === 'error' ? 'error' : 'success';
  
    return (
      <div className={messageStyle}>
        {message}
      </div>
    );
  };
  
  export default Notification;
  