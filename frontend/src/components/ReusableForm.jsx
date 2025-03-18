import React, { useEffect, useState } from "react";

const ReusableForm = ({ fields, onSubmit, onCancel, readOnly }) => {
  const [formData, setFormData] = useState({});

  // Set the formData when fields are passed (for viewing or editing)
  useEffect(() => {
    const initialData = fields.reduce((acc, field) => {
      acc[field.name] = field.value || ""; // Initialize formData with the field values
      return acc;
    }, {});
    setFormData(initialData);
  }, [fields]);

  const handleChange = (e) => {
    if (!readOnly) {
      // Only allow change if not in read-only mode
      setFormData({
        ...formData,
        [e.target.name]: e.target.value,
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!readOnly) {
      onSubmit(formData); // Only submit if not in read-only mode
    }
  };

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl max-w-lg w-full">
      <form onSubmit={handleSubmit} className="space-y-6">
        {fields.map((field) => (
          <div key={field.name} className="flex items-center gap-4">
            <label className="font-semibold min-w-[120px] text-gray-700">
              {field.label}
            </label>
            {field.type === "select" ? (
              <select
                name={field.name}
                value={formData[field.name] || ""}
                onChange={handleChange}
                disabled={readOnly} // Disable the select if read-only
                className="flex-1 border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400"
              >
                <option value="">Select {field.label}</option>
                {field.options.map((option, index) => (
                  <option key={index} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type={field.type}
                name={field.name}
                value={formData[field.name] || ""}
                onChange={handleChange}
                placeholder={field.placeholder}
                disabled={readOnly} // Disable the input if read-only
                className="flex-1 border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400"
              />
            )}
          </div>
        ))}
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            type="submit"
            hidden={readOnly} // Disable submit button in read-only mode
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            {readOnly ? "Close" : "Submit"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReusableForm;
