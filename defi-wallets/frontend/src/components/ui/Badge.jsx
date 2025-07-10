import React from "react";

/**
 * Componente Badge para mostrar etiquetas o estados
 * @param {Object} props - Propiedades del componente
 * @param {string} [props.variant='default'] - Variante (default, success, warning, danger)
 * @param {React.ReactNode} props.children - Contenido del badge
 * @param {string} [props.className=''] - Clases adicionales
 * @returns {JSX.Element} - Elemento span estilizado como badge
 */
const Badge = ({ variant = "default", children, className = "", ...props }) => {
  // Definir las clases según la variante
  let variantClasses = "";

  switch (variant) {
    case "success":
      variantClasses =
        "bg-green-500/20 text-green-400 border border-green-500/20";
      break;
    case "warning":
      variantClasses =
        "bg-yellow-500/20 text-yellow-400 border border-yellow-500/20";
      break;
    case "danger":
      variantClasses = "bg-red-500/20 text-red-400 border border-red-500/20";
      break;
    default:
      variantClasses = "bg-blue-500/20 text-blue-400 border border-blue-500/20";
  }

  return (
    <span
      className={`px-2 py-1 text-xs font-medium rounded-full ${variantClasses} ${className}`}
      {...props}>
      {children}
    </span>
  );
};

export default Badge;
