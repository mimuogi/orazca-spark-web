// Input.jsx
export function Input({ id, name, type = "text", placeholder = "", value, onChange, className = "" }) {
    return (
      <input
        id={id}
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`p-2 border rounded-2xl shadow w-full ${className}`}
      />
    );
  }

  export default Input;