// FormGroup.jsx
export function FormGroup({ children, className = "" }) {
    return (
      <div className={`mb-4 ${className}`}>{children}</div>
    );
  }

  export default FormGroup;