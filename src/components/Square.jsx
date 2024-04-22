import React from 'react';

const Square = ({ id }) => {
  // Construye la ruta de la imagen utilizando el prop 'id'
  const imagePath = `/imagenes/${id}.png`;

  return (
    <div style={{ width: '75px', height: '75px', margin: '2px' }}>
      {/* Utiliza la ruta de la imagen como el valor del atributo 'src' */}
      <img src={imagePath} alt={`Square ${id}`} style={{ width: '100%', height: '100%' }} />
    </div>
  );
};

export default Square;
