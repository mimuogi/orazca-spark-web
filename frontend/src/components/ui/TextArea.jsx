// TextArea.jsx
export function TextArea({ id, name, placeholder = "", value, onChange, className = "" }) {
    return (
      <textarea
        id={id}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`p-2 border rounded-2xl shadow w-full ${className}`}
      />
    );
  }

  export default TextArea;