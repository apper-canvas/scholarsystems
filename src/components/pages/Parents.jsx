import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import SearchBar from "@/components/molecules/SearchBar";
import ParentForm from "@/components/organisms/ParentForm";
import CommunicationLog from "@/components/organisms/CommunicationLog";
import { parentService } from "@/services/api/parentService";
import { studentService } from "@/services/api/studentService";
import { communicationService } from "@/services/api/communicationService";
import { toast } from "react-toastify";

const Parents = ({ searchValue }) => {
  const [searchParams] = useSearchParams();
  const [parents, setParents] = useState([]);
  const [students, setStudents] = useState([]);
  const [filteredParents, setFilteredParents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [showCommunications, setShowCommunications] = useState(false);
  const [editingParent, setEditingParent] = useState(null);
  const [selectedParent, setSelectedParent] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadParents();
    loadStudents();
  }, []);

  useEffect(() => {
    const studentId = searchParams.get('student');
    if (studentId && parents.length > 0) {
      const studentParents = parents.filter(parent => 
        parent.studentIds.includes(parseInt(studentId))
      );
      setFilteredParents(studentParents);
    } else {
      filterParents();
    }
  }, [searchValue, searchTerm, parents, searchParams]);

  const loadParents = async () => {
    try {
      setLoading(true);
      const data = await parentService.getAll();
      setParents(data);
    } catch (err) {
      setError("Failed to load parents");
      toast.error("Failed to load parents");
    } finally {
      setLoading(false);
    }
  };

  const loadStudents = async () => {
    try {
      const data = await studentService.getAll();
      setStudents(data);
    } catch (err) {
      console.error("Failed to load students:", err);
    }
  };

  const filterParents = () => {
    let filtered = parents;
    const term = searchValue || searchTerm;
    
    if (term) {
      filtered = parents.filter(parent => 
        parent.firstName.toLowerCase().includes(term.toLowerCase()) ||
        parent.lastName.toLowerCase().includes(term.toLowerCase()) ||
        parent.email.toLowerCase().includes(term.toLowerCase()) ||
        parent.phone.includes(term)
      );
    }
    
    setFilteredParents(filtered);
  };

  const handleAddParent = () => {
    setEditingParent(null);
    setShowForm(true);
  };

  const handleEditParent = (parent) => {
    setEditingParent(parent);
    setShowForm(true);
  };

  const handleDeleteParent = async (parentId) => {
    if (!window.confirm("Are you sure you want to delete this parent record?")) {
      return;
    }

    try {
      await parentService.delete(parentId);
      await loadParents();
      toast.success("Parent deleted successfully");
    } catch (err) {
      toast.error("Failed to delete parent");
    }
  };

  const handleViewCommunications = (parent) => {
    setSelectedParent(parent);
    setShowCommunications(true);
  };

  const handleSubmitParent = async (parentData) => {
    try {
      if (editingParent) {
        await parentService.update(editingParent.Id, parentData);
        toast.success("Parent updated successfully");
      } else {
        await parentService.create(parentData);
        toast.success("Parent created successfully");
      }
      await loadParents();
      setShowForm(false);
      setEditingParent(null);
    } catch (err) {
      toast.error(editingParent ? "Failed to update parent" : "Failed to create parent");
    }
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingParent(null);
  };

  const handleCloseCommunications = () => {
    setShowCommunications(false);
    setSelectedParent(null);
  };

  const getStudentNames = (studentIds) => {
    return studentIds.map(id => {
      const student = students.find(s => s.Id === id);
      return student ? `${student.firstName} ${student.lastName}` : `Student ${id}`;
    }).join(", ");
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadParents} />;

  if (showForm) {
    return (
      <ParentForm
        parent={editingParent}
        students={students}
        onSubmit={handleSubmitParent}
        onCancel={handleCancelForm}
      />
    );
  }

  if (showCommunications) {
    return (
      <CommunicationLog
        parent={selectedParent}
        students={students}
        onClose={handleCloseCommunications}
      />
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-display text-gray-900">Parents</h1>
          <p className="text-gray-600 mt-1">Manage parent contacts and communication logs</p>
        </div>
        <Button onClick={handleAddParent} className="flex items-center gap-2">
          <ApperIcon name="UserPlus" size={16} />
          Add Parent
        </Button>
      </div>

      <div className="mb-6">
        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Search parents by name, email, or phone..."
        />
      </div>

      {filteredParents.length === 0 ? (
        <Empty
          title="No Parents Found"
          description="No parent records match your search criteria."
          actionLabel="Add Parent"
          onAction={handleAddParent}
        />
      ) : (
        <div className="grid gap-6">
          {filteredParents.map((parent) => (
            <Card key={parent.Id} className="p-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-600 rounded-full flex items-center justify-center">
                      <ApperIcon name="User" className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold font-display text-gray-900">
                        {parent.firstName} {parent.lastName}
                      </h3>
                      <p className="text-gray-600 capitalize">{parent.relationship}</p>
                      <div className="mt-2 space-y-1">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <ApperIcon name="Mail" size={14} />
                          {parent.email}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <ApperIcon name="Phone" size={14} />
                          {parent.phone}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <ApperIcon name="Users" size={14} />
                          Students: {getStudentNames(parent.studentIds)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewCommunications(parent)}
                    className="flex items-center gap-2"
                  >
                    <ApperIcon name="MessageCircle" size={14} />
                    Communications
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditParent(parent)}
                    className="flex items-center gap-2"
                  >
                    <ApperIcon name="Edit" size={14} />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteParent(parent.Id)}
                    className="flex items-center gap-2 text-red-600 border-red-300 hover:bg-red-50"
                  >
                    <ApperIcon name="Trash2" size={14} />
                    Delete
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Parents;