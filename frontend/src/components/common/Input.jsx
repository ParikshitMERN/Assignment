const Input = ({ label, error, className = "", ...props }) => {
  return (
    <div className="mb-4">
      {label && (
        <label className="block text-dark font-medium mb-2">{label}</label>
      )}
      <input
        className={`w-full px-4 py-3 border border-gray-200 focus:outline-none focus:border-primary-900 focus:ring-1 focus:ring-primary-900 transition-all duration-200 ${
          error ? "border-red-500" : ""
        } ${className}`}
        {...props}
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

export default Input;
