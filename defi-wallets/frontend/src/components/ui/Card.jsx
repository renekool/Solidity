import React from "react";

/**
 * Componente Card reutilizable para contener información
 * @param {Object} props - Propiedades del componente
 * @param {React.ReactNode} props.children - Contenido de la tarjeta
 * @param {string} [props.className=''] - Clases adicionales
 * @returns {JSX.Element} - Elemento div estilizado como tarjeta
 */
const Card = ({ children, className = "", ...props }) => {
  return (
    <div
      className={`bg-[#2d3748]/70 rounded-lg p-5 shadow-inner ${className}`}
      {...props}>
      {children}
    </div>
  );
};

export default Card;
