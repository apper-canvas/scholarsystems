import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Button from "@/components/atoms/Button";
import StudentTable from "@/components/organisms/StudentTable";
import StudentForm from "@/components/organisms/StudentForm";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { studentService } from "@/services/api/studentService";
import { toast } from "react-toastify";

const Students = ({ searchValue }) => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);

  const loadStudents = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await studentService.getAll();
      setStudents(data);
      setFilteredStudents(data);
    } catch (err) {
      setError(err.message || "Failed to load students");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStudents();
  }, []);

  useEffect(() => {
    if (!searchValue?.trim()) {
      setFilteredStudents(students);
    } else {
      const searchTerm = searchValue.toLowerCase();
      const filtered = students.filter(student => 
        student.firstName.toLowerCase().includes(searchTerm) ||
        student.lastName.toLowerCase().includes(searchTerm) ||
        student.email.toLowerCase().includes(searchTerm) ||
        student.grade.toLowerCase().includes(searchTerm)
      );
      setFilteredStudents(filtered);
    }
  }, [searchValue, students]);

  const handleAddStudent = () => {
    setEditingStudent(null);
    setShowForm(true);
  };

  const handleEditStudent = (student) => {
    setEditingStudent(student);
    setShowForm(true);
  };

  const handleDeleteStudent = async (studentId) => {
    if (!window.confirm("Are you sure you want to delete this student?")) {
      return;
    }

    try {
      await studentService.delete(studentId);
      setStudents(prev => prev.filter(s => s.Id !== studentId));
      toast.success("Student deleted successfully!");
    } catch (err) {
      toast.error(err.message || "Failed to delete student");
    }
  };

const navigate = useNavigate();

  const handleViewStudent = (student) => {
    // For now, just show the edit form in view mode
    setEditingStudent(student);
    setShowForm(true);
  };

  const handleViewParents = (student) => {
    navigate(`/parents?student=${student.Id}`);
  };
  const handleSubmitStudent = async (studentData) => {
    try {
      if (editingStudent) {
        const updatedStudent = await studentService.update(editingStudent.Id, studentData);
        setStudents(prev => prev.map(s => s.Id === editingStudent.Id ? updatedStudent : s));
      } else {
        const newStudent = await studentService.create(studentData);
        setStudents(prev => [...prev, newStudent]);
      }
      setShowForm(false);
      setEditingStudent(null);
    } catch (err) {
      toast.error(err.message || "Failed to save student");
    }
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingStudent(null);
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadStudents} />;

if (showForm) {
    return (
      <StudentForm
        student={editingStudent}
        onSubmit={handleSubmitStudent}
        onCancel={handleCancelForm}
        onViewParents={handleViewParents}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold font-display text-gray-900">
            Students
          </h1>
          <p className="mt-2 text-gray-600">
            Manage your student roster and academic records
          </p>
        </div>
        <Button onClick={handleAddStudent} className="mt-4 sm:mt-0">
          <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
          Add Student
        </Button>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-gradient-to-r from-primary-50 to-primary-100 p-4 rounded-lg">
          <div className="flex items-center">
            <div className="p-2 bg-primary-500 rounded-lg">
              <ApperIcon name="Users" className="h-5 w-5 text-white" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-primary-600">Total Students</p>
              <p className="text-2xl font-bold text-primary-900">{students.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg">
          <div className="flex items-center">
            <div className="p-2 bg-green-500 rounded-lg">
              <ApperIcon name="UserCheck" className="h-5 w-5 text-white" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-green-600">Active</p>
              <p className="text-2xl font-bold text-green-900">
                {students.filter(s => s.status === "active").length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg">
          <div className="flex items-center">
            <div className="p-2 bg-blue-500 rounded-lg">
              <ApperIcon name="Search" className="h-5 w-5 text-white" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-blue-600">
                {searchValue ? "Search Results" : "All Students"}
              </p>
              <p className="text-2xl font-bold text-blue-900">{filteredStudents.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Students Table */}
      {filteredStudents.length === 0 ? (
        <Empty
          title={searchValue ? "No students found" : "No students added yet"}
          description={
            searchValue 
              ? "Try adjusting your search terms or clear the search to see all students."
              : "Get started by adding your first student to the system."
          }
          icon="Users"
          action={!searchValue ? handleAddStudent : undefined}
          actionLabel="Add First Student"
        />
      ) : (
        <StudentTable
          students={filteredStudents}
          onEdit={handleEditStudent}
          onDelete={handleDeleteStudent}
          onView={handleViewStudent}
        />
      )}
    </div>
  );
};

export default Students;