import React from "react";
import Label from "@/components/atoms/Label";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import { cn } from "@/utils/cn";

const FormField = ({ 
  label, 
  type = "text", 
  error, 
  required = false, 
  children,
  className,
  ...props 
}) => {
  const inputProps = {
    error,
    ...props
  };

  return (
    <div className={cn("space-y-2", className)}>
      {label && <Label required={required}>{label}</Label>}
      {type === "select" ? (
        <Select error={error} {...props}>
          {children}
        </Select>
      ) : (
        <Input type={type} {...inputProps} />
      )}
      {error && (
        <p className="text-sm text-red-600 font-medium">{error}</p>
      )}
    </div>
  );
};

export default FormField;