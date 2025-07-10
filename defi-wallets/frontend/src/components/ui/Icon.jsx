import React from "react";

/**
 * Componente Icon para renderizar íconos SVG con consistencia
 * @param {Object} props - Propiedades del componente
 * @param {React.ReactNode} props.children - Contenido SVG del ícono
 * @param {string} [props.size='md'] - Tamaño del ícono (sm, md, lg)
 * @param {string} [props.className=''] - Clases adicionales
 * @returns {JSX.Element} - Elemento div con el SVG dentro
 */
const Icon = ({ children, size = "md", className = "", ...props }) => {
  // Mapear tamaños a dimensiones específicas
  const sizeMap = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6",
    xl: "h-8 w-8",
  };

  // Obtener las clases de tamaño o usar md por defecto
  const sizeClass = sizeMap[size] || sizeMap.md;

  return (
    <div className={`${sizeClass} ${className}`} {...props}>
      {children}
    </div>
  );
};

export default Icon;
