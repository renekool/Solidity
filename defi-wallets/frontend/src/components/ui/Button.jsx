import React from "react";

/**
 * Componente Button reutilizable con diferentes variantes
 * @param {Object} props - Propiedades del componente
 * @param {string} [props.variant='primary'] - Variante del botón (primary, secondary, outline, danger)
 * @param {boolean} [props.disabled=false] - Si el botón está deshabilitado
 * @param {Function} props.onClick - Función a ejecutar al hacer clic
 * @param {React.ReactNode} props.children - Contenido del botón
 * @param {string} [props.className=''] - Clases adicionales
 * @returns {JSX.Element} - Elemento button estilizado
 */
const Button = ({
  variant = "primary",
  disabled = false,
  onClick,
  children,
  className = "",
  ...props
}) => {
  // Definir las clases base y variantes
  const baseClasses =
    "px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200";

  // Determinar las clases según la variante
  let variantClasses = "";

  switch (variant) {
    case "primary":
      variantClasses = disabled
        ? "bg-[#2d3748] text-gray-500 cursor-not-allowed"
        : "bg-[#1eb980] text-[#1e293b] shadow-md hover:shadow-lg hover:bg-[#1eb980]/90";
      break;
    case "secondary":
      variantClasses = disabled
        ? "bg-[#2d3748] text-gray-500 cursor-not-allowed"
        : "bg-[#1e293b] border border-[#1eb980] text-[#1eb980] shadow-inner hover:bg-[#1e293b]/80";
      break;
    case "danger":
      variantClasses = disabled
        ? "bg-[#2d3748] text-gray-500 cursor-not-allowed"
        : "bg-red-500 hover:bg-red-400 text-white shadow-md";
      break;
    default:
      variantClasses = disabled
        ? "bg-[#2d3748] text-gray-500 cursor-not-allowed"
        : "bg-[#1eb980] text-[#1e293b] shadow-md hover:shadow-lg hover:bg-[#1eb980]/90";
  }

  // Combinar todas las clases
  const buttonClasses = `${baseClasses} ${variantClasses} ${className}`;

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={buttonClasses}
      {...props}>
      {children}
    </button>
  );
};

export default Button;
