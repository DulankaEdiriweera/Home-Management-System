import React, { useEffect, useState } from "react";
import * as Yup from "yup";

const ReusableForm = ({ fields, onSubmit, onCancel, readOnly }) => {
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});

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

  // Define the validation schema using Yup
  const validationSchema = Yup.object(
    fields.reduce((acc, field) => {
      if (field.required) {
        acc[field.name] = Yup.string()
          .required(`${field.label} is required`)
          .positive(`${field.label} must be a positive number`)
          .min(1, `${field.label} must be at least 1 character`);
      }
      if (field.type === "text") {
        acc[field.name] = Yup.string()
          .required(`${field.label} is required`)
      }
      if (field.type === "number") {
        acc[field.name] = Yup.number()
          .required(`${field.label} is required`)
          .min(1, `${field.label} must be greater than 0`);
      }
      if (field.type === "select") {
        acc[field.name] = Yup.string()
          .required(`${field.label} is required`)
          .notOneOf([""], `${field.label} must be selected`);
      }
      if (field.name === "expiryDate") {
        acc[field.name] = Yup.date()
          .required("Expiry Date is required")
          .min(new Date(), "Expiry date cannot be in the past");
      }
      return acc;
    }, {})
  );

  // Validation function
  const validate = async () => {
    try {
      await validationSchema.validate(formData, { abortEarly: false });
      setErrors({});
      return true;
    } catch (err) {
      const newErrors = err.inner.reduce((acc, error) => {
        acc[error.path] = error.message;
        return acc;
      }, {});
      setErrors(newErrors);
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!readOnly && await validate()) {
      onSubmit(formData); // Only submit if not in read-only mode and validation passes
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
            ) : 
            field.name === "expiryDate" ? (
              <input
                type="date"
                name={field.name}
                value={formData[field.name] || ""}
                onChange={handleChange}
                placeholder={field.placeholder}
                disabled={readOnly} // Disable the input if read-only
                className="flex-1 border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400"
                min={new Date().toISOString().split("T")[0]} // Prevent past dates
              />
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
            {/* Show error message if validation fails */}
            {errors[field.name] && (
              <span className="text-red-500 text-sm">{errors[field.name]}</span>
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
