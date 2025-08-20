import React, { useState, useEffect } from "react";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import FormField from "@/components/molecules/FormField";
import GradeBadge from "@/components/molecules/GradeBadge";
import { toast } from "react-toastify";

const GradeForm = ({ grade, students, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    studentId: "",
    subject: "",
    score: "",
    maxScore: "100",
    term: "",
    date: new Date().toISOString().split("T")[0]
  });

  const [errors, setErrors] = useState({});
  const [previewGrade, setPreviewGrade] = useState(null);

  const subjects = [
    "Mathematics",
    "English Language Arts",
    "Science",
    "Social Studies",
    "History",
    "Geography",
    "Biology",
    "Chemistry",
    "Physics",
    "Art",
    "Music",
    "Physical Education",
    "Computer Science",
    "Foreign Language"
  ];

  const terms = [
    "First Quarter",
    "Second Quarter",
    "Third Quarter",
    "Fourth Quarter",
    "First Semester",
    "Second Semester",
    "Final Exam",
    "Mid-term Exam"
  ];

  useEffect(() => {
    if (grade) {
      setFormData({
        studentId: grade.studentId || "",
        subject: grade.subject || "",
        score: grade.score?.toString() || "",
        maxScore: grade.maxScore?.toString() || "100",
        term: grade.term || "",
        date: grade.date || new Date().toISOString().split("T")[0]
      });
    }
  }, [grade]);

  useEffect(() => {
    if (formData.score && formData.maxScore) {
      const score = parseFloat(formData.score);
      const maxScore = parseFloat(formData.maxScore);
      if (!isNaN(score) && !isNaN(maxScore) && maxScore > 0) {
        setPreviewGrade({ score, maxScore });
      } else {
        setPreviewGrade(null);
      }
    } else {
      setPreviewGrade(null);
    }
  }, [formData.score, formData.maxScore]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.studentId) newErrors.studentId = "Student is required";
    if (!formData.subject.trim()) newErrors.subject = "Subject is required";
    if (!formData.score) newErrors.score = "Score is required";
    else {
      const score = parseFloat(formData.score);
      const maxScore = parseFloat(formData.maxScore);
      if (isNaN(score) || score < 0) newErrors.score = "Score must be a valid number";
      else if (score > maxScore) newErrors.score = "Score cannot exceed maximum score";
    }
    if (!formData.maxScore) newErrors.maxScore = "Maximum score is required";
    else if (isNaN(parseFloat(formData.maxScore)) || parseFloat(formData.maxScore) <= 0) {
      newErrors.maxScore = "Maximum score must be a positive number";
    }
    if (!formData.term) newErrors.term = "Term is required";
    if (!formData.date) newErrors.date = "Date is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const gradeData = {
        ...formData,
        score: parseFloat(formData.score),
        maxScore: parseFloat(formData.maxScore)
      };
      onSubmit(gradeData);
      toast.success(grade ? "Grade updated successfully!" : "Grade added successfully!");
    }
  };

  const selectedStudent = students.find(s => s.Id === parseInt(formData.studentId));

  return (
    <Card className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold font-display text-gray-900">
          {grade ? "Edit Grade" : "Add New Grade"}
        </h2>
        <p className="text-gray-600 mt-1">
          {grade ? "Update grade information" : "Enter grade details to record student performance"}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <FormField
          label="Student"
          name="studentId"
          type="select"
          value={formData.studentId}
          onChange={handleChange}
          error={errors.studentId}
          required
        >
          <option value="">Select Student</option>
          {students.map((student) => (
            <option key={student.Id} value={student.Id}>
              {student.firstName} {student.lastName} - {student.grade}
            </option>
          ))}
        </FormField>

        {selectedStudent && (
          <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
            <h4 className="font-medium text-blue-900 mb-2">Student Information</h4>
            <div className="text-sm text-blue-700">
              <p><span className="font-medium">Name:</span> {selectedStudent.firstName} {selectedStudent.lastName}</p>
              <p><span className="font-medium">Grade:</span> {selectedStudent.grade}</p>
              <p><span className="font-medium">Email:</span> {selectedStudent.email}</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            label="Subject"
            name="subject"
            type="select"
            value={formData.subject}
            onChange={handleChange}
            error={errors.subject}
            required
          >
            <option value="">Select Subject</option>
            {subjects.map((subject) => (
              <option key={subject} value={subject}>
                {subject}
              </option>
            ))}
          </FormField>
          <FormField
            label="Term"
            name="term"
            type="select"
            value={formData.term}
            onChange={handleChange}
            error={errors.term}
            required
          >
            <option value="">Select Term</option>
            {terms.map((term) => (
              <option key={term} value={term}>
                {term}
              </option>
            ))}
          </FormField>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            label="Score"
            name="score"
            type="number"
            min="0"
            step="0.1"
            value={formData.score}
            onChange={handleChange}
            error={errors.score}
            required
          />
          <FormField
            label="Maximum Score"
            name="maxScore"
            type="number"
            min="1"
            step="0.1"
            value={formData.maxScore}
            onChange={handleChange}
            error={errors.maxScore}
            required
          />
        </div>

        <FormField
          label="Date"
          name="date"
          type="date"
          value={formData.date}
          onChange={handleChange}
          error={errors.date}
          required
        />

        {previewGrade && (
          <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
            <h4 className="font-medium text-green-900 mb-2">Grade Preview</h4>
            <GradeBadge score={previewGrade.score} maxScore={previewGrade.maxScore} />
          </div>
        )}

        <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">
            {grade ? "Update Grade" : "Add Grade"}
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default GradeForm;