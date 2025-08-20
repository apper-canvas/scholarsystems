import React, { useState, useEffect } from "react";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import FormField from "@/components/molecules/FormField";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { communicationService } from "@/services/api/communicationService";
import { toast } from "react-toastify";

const CommunicationLog = ({ parent, students, onClose }) => {
  const [communications, setCommunications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    type: "",
    subject: "",
    notes: "",
    followUpRequired: false,
    followUpDate: ""
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    loadCommunications();
  }, [parent]);

  const loadCommunications = async () => {
    try {
      setLoading(true);
      const data = await communicationService.getByParentId(parent.Id);
      setCommunications(data);
    } catch (err) {
      setError("Failed to load communications");
      toast.error("Failed to load communications");
    } finally {
      setLoading(false);
    }
  };

  const handleAddCommunication = () => {
    setFormData({
      type: "",
      subject: "",
      notes: "",
      followUpRequired: false,
      followUpDate: ""
    });
    setErrors({});
    setShowForm(true);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.type) newErrors.type = "Communication type is required";
    if (!formData.subject.trim()) newErrors.subject = "Subject is required";
    if (!formData.notes.trim()) newErrors.notes = "Notes are required";
    if (formData.followUpRequired && !formData.followUpDate) {
      newErrors.followUpDate = "Follow-up date is required when follow-up is needed";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmitCommunication = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const communicationData = {
        ...formData,
        parentId: parent.Id,
        teacherId: 1, // Mock teacher ID
        studentIds: parent.studentIds
      };
      
      await communicationService.create(communicationData);
      await loadCommunications();
      setShowForm(false);
      toast.success("Communication logged successfully");
    } catch (err) {
      toast.error("Failed to log communication");
    }
  };

  const getTypeColor = (type) => {
    const colors = {
      meeting: "bg-blue-100 text-blue-800",
      phone: "bg-green-100 text-green-800",
      email: "bg-purple-100 text-purple-800",
      other: "bg-gray-100 text-gray-800"
    };
    return colors[type] || colors.other;
  };

  const getTypeIcon = (type) => {
    const icons = {
      meeting: "Calendar",
      phone: "Phone",
      email: "Mail",
      other: "MessageCircle"
    };
    return icons[type] || icons.other;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const getStudentNames = (studentIds) => {
    return studentIds.map(id => {
      const student = students.find(s => s.Id === id);
      return student ? `${student.firstName} ${student.lastName}` : `Student ${id}`;
    }).join(", ");
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadCommunications} />;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center gap-4 mb-4">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex items-center gap-2"
          >
            <ApperIcon name="ArrowLeft" size={16} />
            Back to Parents
          </Button>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-600 rounded-full flex items-center justify-center">
              <ApperIcon name="User" className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold font-display text-gray-900">
                {parent.firstName} {parent.lastName}
              </h1>
              <p className="text-gray-600">Communication Log</p>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <ApperIcon name="Users" size={14} />
              Students: {getStudentNames(parent.studentIds)}
            </div>
            <div className="flex items-center gap-1">
              <ApperIcon name="Mail" size={14} />
              {parent.email}
            </div>
            <div className="flex items-center gap-1">
              <ApperIcon name="Phone" size={14} />
              {parent.phone}
            </div>
          </div>
          <Button onClick={handleAddCommunication} className="flex items-center gap-2">
            <ApperIcon name="Plus" size={16} />
            Log Communication
          </Button>
        </div>
      </div>

      {showForm && (
        <Card className="p-6 mb-6">
          <div className="mb-4">
            <h3 className="text-lg font-semibold font-display text-gray-900">Log New Communication</h3>
            <p className="text-gray-600 text-sm">Record a parent-teacher interaction</p>
          </div>
          
          <form onSubmit={handleSubmitCommunication} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label="Communication Type"
                name="type"
                type="select"
                value={formData.type}
                onChange={handleChange}
                error={errors.type}
                required
              >
                <option value="">Select Type</option>
                <option value="meeting">In-Person Meeting</option>
                <option value="phone">Phone Call</option>
                <option value="email">Email</option>
                <option value="other">Other</option>
              </FormField>
              <FormField
                label="Subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                error={errors.subject}
                required
                placeholder="Brief subject of communication"
              />
            </div>
            
            <FormField
              label="Notes"
              name="notes"
              type="textarea"
              value={formData.notes}
              onChange={handleChange}
              error={errors.notes}
              required
              placeholder="Detailed notes about the communication..."
              rows={4}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
              <div>
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    name="followUpRequired"
                    checked={formData.followUpRequired}
                    onChange={handleChange}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <span className="text-sm font-medium text-gray-900">Follow-up required</span>
                </label>
              </div>
              {formData.followUpRequired && (
                <FormField
                  label="Follow-up Date"
                  name="followUpDate"
                  type="date"
                  value={formData.followUpDate}
                  onChange={handleChange}
                  error={errors.followUpDate}
                  required
                />
              )}
            </div>
            
            <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </Button>
              <Button type="submit">
                Log Communication
              </Button>
            </div>
          </form>
        </Card>
      )}

      {communications.length === 0 ? (
        <Empty
          title="No Communications Logged"
          description="No parent-teacher communications have been recorded yet."
          actionLabel="Log Communication"
          onAction={handleAddCommunication}
        />
      ) : (
        <div className="space-y-4">
          {communications.map((comm) => (
            <Card key={comm.Id} className="p-6">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <Badge className={`${getTypeColor(comm.type)} flex items-center gap-1`}>
                      <ApperIcon name={getTypeIcon(comm.type)} size={12} />
                      {comm.type.charAt(0).toUpperCase() + comm.type.slice(1)}
                    </Badge>
                    <span className="text-sm text-gray-500">
                      {formatDate(comm.createdAt)}
                    </span>
                    {comm.followUpRequired && (
                      <Badge className="bg-orange-100 text-orange-800">
                        Follow-up: {new Date(comm.followUpDate).toLocaleDateString()}
                      </Badge>
                    )}
                  </div>
                  
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">
                    {comm.subject}
                  </h4>
                  
                  <p className="text-gray-700 mb-3 leading-relaxed">
                    {comm.notes}
                  </p>
                  
                  <div className="text-sm text-gray-500">
                    Regarding: {getStudentNames(comm.studentIds)}
                  </div>
                </div>
                
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <ApperIcon name="User" size={14} />
                  Teacher #{comm.teacherId}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default CommunicationLog;