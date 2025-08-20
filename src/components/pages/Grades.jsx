import React, { useState, useEffect } from "react";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import GradeForm from "@/components/organisms/GradeForm";
import GradeBadge from "@/components/molecules/GradeBadge";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { gradeService } from "@/services/api/gradeService";
import { studentService } from "@/services/api/studentService";
import { toast } from "react-toastify";
import { format } from "date-fns";

const Grades = () => {
  const [grades, setGrades] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingGrade, setEditingGrade] = useState(null);

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [gradesData, studentsData] = await Promise.all([
        gradeService.getAll(),
        studentService.getAll()
      ]);
      
      setGrades(gradesData);
      setStudents(studentsData.filter(s => s.status === "active"));
    } catch (err) {
      setError(err.message || "Failed to load grades data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAddGrade = () => {
    setEditingGrade(null);
    setShowForm(true);
  };

  const handleEditGrade = (grade) => {
    setEditingGrade(grade);
    setShowForm(true);
  };

  const handleDeleteGrade = async (gradeId) => {
    if (!window.confirm("Are you sure you want to delete this grade?")) {
      return;
    }

    try {
      await gradeService.delete(gradeId);
      setGrades(prev => prev.filter(g => g.Id !== gradeId));
      toast.success("Grade deleted successfully!");
    } catch (err) {
      toast.error(err.message || "Failed to delete grade");
    }
  };

  const handleSubmitGrade = async (gradeData) => {
    try {
      if (editingGrade) {
        const updatedGrade = await gradeService.update(editingGrade.Id, gradeData);
        setGrades(prev => prev.map(g => g.Id === editingGrade.Id ? updatedGrade : g));
      } else {
        const newGrade = await gradeService.create(gradeData);
        setGrades(prev => [...prev, newGrade]);
      }
      setShowForm(false);
      setEditingGrade(null);
    } catch (err) {
      toast.error(err.message || "Failed to save grade");
    }
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingGrade(null);
  };

  const getStudentName = (studentId) => {
    const student = students.find(s => s.Id === studentId);
    return student ? `${student.firstName} ${student.lastName}` : "Unknown Student";
  };

  const getStudentGrade = (studentId) => {
    const student = students.find(s => s.Id === studentId);
    return student ? student.grade : "";
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadData} />;

  if (showForm) {
    return (
      <GradeForm
        grade={editingGrade}
        students={students}
        onSubmit={handleSubmitGrade}
        onCancel={handleCancelForm}
      />
    );
  }

  if (grades.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold font-display text-gray-900">
              Grades Management
            </h1>
            <p className="mt-2 text-gray-600">
              Record and track student academic performance
            </p>
          </div>
          <Button onClick={handleAddGrade} className="mt-4 sm:mt-0">
            <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
            Add Grade
          </Button>
        </div>
        
        <Empty
          title="No grades recorded yet"
          description="Start recording student grades to track academic progress and performance."
          icon="BookOpen"
          action={handleAddGrade}
          actionLabel="Add First Grade"
        />
      </div>
    );
  }

  // Group grades by student
  const gradesByStudent = grades.reduce((acc, grade) => {
    if (!acc[grade.studentId]) {
      acc[grade.studentId] = [];
    }
    acc[grade.studentId].push(grade);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold font-display text-gray-900">
            Grades Management
          </h1>
          <p className="mt-2 text-gray-600">
            Record and track student academic performance
          </p>
        </div>
        <Button onClick={handleAddGrade} className="mt-4 sm:mt-0">
          <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
          Add Grade
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-r from-primary-50 to-primary-100 p-4 rounded-lg">
          <div className="flex items-center">
            <div className="p-2 bg-primary-500 rounded-lg">
              <ApperIcon name="BookOpen" className="h-5 w-5 text-white" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-primary-600">Total Grades</p>
              <p className="text-2xl font-bold text-primary-900">{grades.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg">
          <div className="flex items-center">
            <div className="p-2 bg-green-500 rounded-lg">
              <ApperIcon name="Users" className="h-5 w-5 text-white" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-green-600">Students Graded</p>
              <p className="text-2xl font-bold text-green-900">
                {Object.keys(gradesByStudent).length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg">
          <div className="flex items-center">
            <div className="p-2 bg-blue-500 rounded-lg">
              <ApperIcon name="BookMarked" className="h-5 w-5 text-white" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-blue-600">Subjects</p>
              <p className="text-2xl font-bold text-blue-900">
                {new Set(grades.map(g => g.subject)).size}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-lg">
          <div className="flex items-center">
            <div className="p-2 bg-purple-500 rounded-lg">
              <ApperIcon name="Award" className="h-5 w-5 text-white" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-purple-600">Avg. Score</p>
              <p className="text-2xl font-bold text-purple-900">
                {(grades.reduce((sum, g) => sum + (g.score / g.maxScore * 100), 0) / grades.length).toFixed(1)}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Grades Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Student
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Subject
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Grade
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Term
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {grades
                .sort((a, b) => new Date(b.date) - new Date(a.date))
                .map((grade) => (
                <tr key={grade.Id} className="hover:bg-gradient-to-r hover:from-gray-50 hover:to-blue-50 transition-colors duration-200">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {getStudentName(grade.studentId)}
                      </div>
                      <div className="text-sm text-gray-500">
                        {getStudentGrade(grade.studentId)}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {grade.subject}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <GradeBadge score={grade.score} maxScore={grade.maxScore} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {grade.term}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {format(new Date(grade.date), "MMM dd, yyyy")}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditGrade(grade)}
                      >
                        <ApperIcon name="Edit" className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteGrade(grade.Id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <ApperIcon name="Trash2" className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default Grades;