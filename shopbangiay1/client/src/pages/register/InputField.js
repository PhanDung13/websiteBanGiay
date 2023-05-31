import React from "react";
import { ErrorMessage } from "formik";
import { Input } from "antd";
const InputField = (props) => {
  const { field, label, placeholder, form, type, disabled, min, icon } = props;
  const { name } = field;
  const { errors, touched } = form;
  const showError = errors[name] && touched[name];
  return (
    <div>
      <label htmlFor={name}>{label}</label>
      <Input
        prefix={icon}
        id={name}
        {...field}
        placeholder={placeholder}
        type={type}
        disabled={disabled}
        invalid={showError}
        min={min}
      />
      {showError && (
        <p style={{ color: "red", fontSize: "14px" }}>
          <ErrorMessage name={name} />
        </p>
      )}
    </div>
  );
};

export default InputField;
