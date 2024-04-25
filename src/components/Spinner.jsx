import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import './Spinner.css' // Archivo CSS para la animación

const Spinner = () => {
  return (
    <div className="spinner-container">
      <FontAwesomeIcon icon={faSpinner} spin />
    </div>
  );
};

export default Spinner;
