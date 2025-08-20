import React, { useState, useEffect } from "react";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import FormField from "@/components/molecules/FormField";
import ApperIcon from "@/components/ApperIcon";
import { toast } from "react-toastify";

const ParentForm = ({ parent, students, onSubmit, onCancel }) => {
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    relationship: "",
    occupation: "",
    workPhone: "",
    studentIds: [],
    isPrimary: true,
    emergencyContact: false
  });

  useEffect(() => {
    if (parent) {
      setFormData({
        firstName: parent.firstName || "",
        lastName: parent.lastName || "",
        email: parent.email || "",
        phone: parent.phone || "",
        address: parent.address || "",
        relationship: parent.relationship || "",
        occupation: parent.occupation || "",
        workPhone: parent.workPhone || "",
        studentIds: parent.studentIds || [],
        isPrimary: parent.isPrimary ?? true,
        emergencyContact: parent.emergencyContact ?? false
      });
    }
  }, [parent]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === "studentIds") {
      const studentId = parseInt(value);
      setFormData(prev => ({
        ...prev,
        studentIds: checked 
          ? [...prev.studentIds, studentId]
          : prev.studentIds.filter(id => id !== studentId)
      }));
    } else {
      setFormData(prev => ({ 
        ...prev, 
        [name]: type === "checkbox" ? checked : value 
      }));
    }
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    if (!formData.relationship.trim()) newErrors.relationship = "Relationship is required";
    if (formData.studentIds.length === 0) newErrors.studentIds = "At least one student must be selected";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <Card className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold font-display text-gray-900">
          {parent ? "Edit Parent Contact" : "Add New Parent Contact"}
        </h2>
        <p className="text-gray-600 mt-1">
          {parent ? "Update parent contact information" : "Enter parent contact details and relationship information"}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            label="First Name"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            error={errors.firstName}
            required
          />
          <FormField
            label="Last Name"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            error={errors.lastName}
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            required
          />
          <FormField
            label="Phone"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
            error={errors.phone}
            required
          />
        </div>

        <FormField
          label="Address"
          name="address"
          value={formData.address}
          onChange={handleChange}
          error={errors.address}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            label="Relationship to Student"
            name="relationship"
            type="select"
            value={formData.relationship}
            onChange={handleChange}
            error={errors.relationship}
            required
          >
            <option value="">Select Relationship</option>
            <option value="mother">Mother</option>
            <option value="father">Father</option>
            <option value="stepmother">Stepmother</option>
            <option value="stepfather">Stepfather</option>
            <option value="grandmother">Grandmother</option>
            <option value="grandfather">Grandfather</option>
            <option value="aunt">Aunt</option>
            <option value="uncle">Uncle</option>
            <option value="guardian">Legal Guardian</option>
            <option value="other">Other</option>
          </FormField>
          <FormField
            label="Occupation"
            name="occupation"
            value={formData.occupation}
            onChange={handleChange}
            error={errors.occupation}
          />
        </div>

        <FormField
          label="Work Phone (Optional)"
          name="workPhone"
          type="tel"
          value={formData.workPhone}
          onChange={handleChange}
          error={errors.workPhone}
        />

        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold font-display text-gray-900 mb-4">Student Association</h3>
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700">
              Students (Select all that apply) *
            </label>
            {errors.studentIds && (
              <p className="text-sm text-red-600">{errors.studentIds}</p>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-48 overflow-y-auto border border-gray-200 rounded-lg p-4">
              {students.map((student) => (
                <label key={student.Id} className="flex items-center space-x-3 p-2 rounded hover:bg-gray-50">
                  <input
                    type="checkbox"
                    name="studentIds"
                    value={student.Id}
                    checked={formData.studentIds.includes(student.Id)}
                    onChange={handleChange}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-600 rounded-full flex items-center justify-center">
                      <ApperIcon name="User" className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-sm text-gray-900">
                      {student.firstName} {student.lastName}
                      <span className="text-gray-500 ml-1">({student.grade})</span>
                    </span>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold font-display text-gray-900 mb-4">Contact Settings</h3>
          <div className="space-y-4">
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                name="isPrimary"
                checked={formData.isPrimary}
                onChange={handleChange}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <div>
                <span className="text-sm font-medium text-gray-900">Primary Contact</span>
                <p className="text-xs text-gray-500">This person should be contacted first regarding the student</p>
              </div>
            </label>
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                name="emergencyContact"
                checked={formData.emergencyContact}
                onChange={handleChange}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <div>
                <span className="text-sm font-medium text-gray-900">Emergency Contact</span>
                <p className="text-xs text-gray-500">This person can be contacted in case of emergencies</p>
              </div>
            </label>
          </div>
        </div>

        <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">
            {parent ? "Update Parent" : "Add Parent"}
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default ParentForm;