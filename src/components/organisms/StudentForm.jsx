import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import FormField from "@/components/molecules/FormField";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import Select from "@/components/atoms/Select";

const StudentForm = ({ student, onSubmit, onCancel, onViewParents }) => {
const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    grade: "",
    enrollmentDate: "",
    email: "",
    phone: "",
    address: "",
    guardianName: "",
    guardianPhone: "",
    guardianEmail: "",
    emergencyContactName: "",
    emergencyContactPhone: "",
    emergencyContactRelationship: "",
    status: "active"
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
if (student) {
      setFormData({
        firstName: student.firstName || "",
        lastName: student.lastName || "",
        dateOfBirth: student.dateOfBirth || "",
        grade: student.grade || "",
        enrollmentDate: student.enrollmentDate || "",
        email: student.email || "",
        phone: student.phone || "",
        address: student.address || "",
        guardianName: student.guardianName || "",
        guardianPhone: student.guardianPhone || "",
        guardianEmail: student.guardianEmail || "",
        emergencyContactName: student.emergencyContactName || "",
        emergencyContactPhone: student.emergencyContactPhone || "",
        emergencyContactRelationship: student.emergencyContactRelationship || "",
        status: student.status || "active"
      });
    }
  }, [student]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.dateOfBirth) newErrors.dateOfBirth = "Date of birth is required";
    if (!formData.grade) newErrors.grade = "Grade is required";
    if (!formData.enrollmentDate) newErrors.enrollmentDate = "Enrollment date is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    if (!formData.guardianName.trim()) newErrors.guardianName = "Guardian name is required";
    if (!formData.guardianPhone.trim()) newErrors.guardianPhone = "Guardian phone is required";
    if (formData.guardianEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.guardianEmail)) {
      newErrors.guardianEmail = "Please enter a valid guardian email address";
    }
    if (!formData.emergencyContactName.trim()) newErrors.emergencyContactName = "Emergency contact name is required";
    if (!formData.emergencyContactPhone.trim()) newErrors.emergencyContactPhone = "Emergency contact phone is required";
    if (!formData.emergencyContactRelationship.trim()) newErrors.emergencyContactRelationship = "Emergency contact relationship is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
      toast.success(student ? "Student updated successfully!" : "Student added successfully!");
    }
  };

  return (
<Card className="p-6">
      <div className="mb-6 flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold font-display text-gray-900">
            {student ? "Edit Student" : "Add New Student"}
          </h2>
          <p className="text-gray-600 mt-1">
            {student ? "Update student information" : "Enter student details to add them to the system"}
          </p>
        </div>
        {student && onViewParents && (
          <Button 
            variant="outline" 
            onClick={() => onViewParents(student)}
            className="flex items-center gap-2"
          >
            <ApperIcon name="Users2" size={16} />
            View Parents
          </Button>
        )}
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
            label="Date of Birth"
            name="dateOfBirth"
            type="date"
            value={formData.dateOfBirth}
            onChange={handleChange}
            error={errors.dateOfBirth}
            required
          />
          <FormField
            label="Grade"
            name="grade"
            type="select"
            value={formData.grade}
            onChange={handleChange}
            error={errors.grade}
            required
          >
            <option value="">Select Grade</option>
            <option value="Kindergarten">Kindergarten</option>
            <option value="1st Grade">1st Grade</option>
            <option value="2nd Grade">2nd Grade</option>
            <option value="3rd Grade">3rd Grade</option>
            <option value="4th Grade">4th Grade</option>
            <option value="5th Grade">5th Grade</option>
            <option value="6th Grade">6th Grade</option>
            <option value="7th Grade">7th Grade</option>
            <option value="8th Grade">8th Grade</option>
            <option value="9th Grade">9th Grade</option>
            <option value="10th Grade">10th Grade</option>
            <option value="11th Grade">11th Grade</option>
            <option value="12th Grade">12th Grade</option>
          </FormField>
        </div>

        <FormField
          label="Enrollment Date"
          name="enrollmentDate"
          type="date"
          value={formData.enrollmentDate}
          onChange={handleChange}
          error={errors.enrollmentDate}
          required
        />

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

        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold font-display text-gray-900 mb-4">Guardian Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              label="Guardian Name"
              name="guardianName"
              value={formData.guardianName}
              onChange={handleChange}
              error={errors.guardianName}
              required
            />
            <FormField
              label="Guardian Phone"
              name="guardianPhone"
              type="tel"
              value={formData.guardianPhone}
              onChange={handleChange}
              error={errors.guardianPhone}
              required
            />
          </div>
          <div className="mt-6">
            <FormField
              label="Guardian Email (Optional)"
              name="guardianEmail"
              type="email"
              value={formData.guardianEmail}
              onChange={handleChange}
              error={errors.guardianEmail}
            />
          </div>
        </div>

        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold font-display text-gray-900 mb-4">Emergency Contact</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              label="Emergency Contact Name"
              name="emergencyContactName"
              value={formData.emergencyContactName}
              onChange={handleChange}
              error={errors.emergencyContactName}
              required
            />
            <FormField
              label="Emergency Contact Phone"
              name="emergencyContactPhone"
              type="tel"
              value={formData.emergencyContactPhone}
              onChange={handleChange}
              error={errors.emergencyContactPhone}
              required
            />
          </div>
          <div className="mt-6">
            <FormField
              label="Relationship to Student"
              name="emergencyContactRelationship"
              type="select"
              value={formData.emergencyContactRelationship}
              onChange={handleChange}
              error={errors.emergencyContactRelationship}
              required
            >
              <option value="">Select Relationship</option>
              <option value="Parent">Parent</option>
              <option value="Grandparent">Grandparent</option>
              <option value="Aunt">Aunt</option>
              <option value="Uncle">Uncle</option>
              <option value="Sibling">Sibling</option>
              <option value="Family Friend">Family Friend</option>
              <option value="Other">Other</option>
            </FormField>
          </div>
        </div>

        <FormField
          label="Status"
          name="status"
          type="select"
          value={formData.status}
          onChange={handleChange}
          error={errors.status}
          required
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="graduated">Graduated</option>
        </FormField>

        <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">
            {student ? "Update Student" : "Add Student"}
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default StudentForm;