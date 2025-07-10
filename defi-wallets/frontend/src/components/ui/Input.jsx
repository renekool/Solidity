import React from "react";

/**
 * Componente Input reutilizable con label y validación
 * @param {Object} props - Propiedades del componente
 * @param {string} props.label - Etiqueta del campo
 * @param {string} props.name - Nombre del campo (para formularios)
 * @param {string} props.type - Tipo de input (text, number, etc.)
 * @param {string} props.value - Valor del campo
 * @param {Function} props.onChange - Función para manejar cambios
 * @param {string} [props.placeholder=''] - Texto de placeholder
 * @param {boolean} [props.error=false] - Si hay error en el campo
 * @param {string} [props.errorText=''] - Mensaje de error
 * @param {string} [props.className=''] - Clases adicionales
 * @param {string} [props.suffix=''] - Texto que aparece a la derecha del input
 * @returns {JSX.Element} - Elemento input con label
 */
const Input = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder = "",
  error = false,
  errorText = "",
  className = "",
  suffix,
  ...props
}) => {
  return (
    <div className={className}>
      {label && (
        <label
          htmlFor={name}
          className="block text-sm font-medium text-gray-400 mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`w-full bg-[#2d3748]/70 border ${
            error ? "border-red-500" : "border-[#4a5568]"
          } rounded-lg px-4 py-3 ${
            suffix ? "pr-16" : ""
          } focus:ring-2 focus:ring-[#1eb980] focus:border-transparent transition-all duration-200 appearance-none`} // Añadí appearance-none aquí
          style={type === "number" ? { MozAppearance: "textfield" } : {}} // Y este estilo para Firefox
          {...props}
        />
        {type === "number" && (
          <style>{`
            input[type="number"]::-webkit-outer-spin-button,
            input[type="number"]::-webkit-inner-spin-button {
              -webkit-appearance: none;
              margin: 0;
            }
          `}</style>
        )}
        {suffix && (
          <div className="absolute inset-y-0 right-0 flex items-center">
            <div className="h-full px-3 flex items-center justify-center bg-gray-700/50 border-l border-[#4a5568] rounded-r-lg group-hover:bg-gray-600/50 transition-colors duration-200">
              <div className="flex items-center space-x-1">
                <svg
                  className="w-4 h-4 text-gray-300"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20ZM12.31 11.14C10.54 10.69 9.97 10.2 9.97 9.47C9.97 8.63 10.76 8.04 12.07 8.04C13.45 8.04 13.97 8.7 14.01 9.68H15.72C15.67 8.34 14.85 7.11 13.23 6.71V5H10.9V6.69C9.39 7.01 8.18 7.99 8.18 9.5C8.18 11.29 9.67 12.19 11.84 12.71C13.79 13.17 14.18 13.86 14.18 14.58C14.18 15.11 13.79 16 12.08 16C10.48 16 9.85 15.29 9.76 14.38H8.04C8.14 16.03 9.4 17.01 10.9 17.31V19H13.24V17.33C14.76 17.04 15.96 16.17 15.97 14.56C15.96 12.36 14.07 11.6 12.31 11.14Z"
                    fill="currentColor"
                  />
                </svg>
                <span className="text-gray-300 font-medium">{suffix}</span>
              </div>
            </div>
          </div>
        )}
      </div>
      {error && errorText && (
        <p className="mt-1 text-xs text-red-400">{errorText}</p>
      )}
    </div>
  );
};

export default Input;
