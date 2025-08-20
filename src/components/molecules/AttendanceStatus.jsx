import React from "react";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";

const AttendanceStatus = ({ status }) => {
  const statusConfig = {
    present: {
      variant: "success",
      icon: "Check",
      text: "Present"
    },
    absent: {
      variant: "danger",
      icon: "X",
      text: "Absent"
    },
    late: {
      variant: "warning",
      icon: "Clock",
      text: "Late"
    },
    excused: {
      variant: "primary",
      icon: "FileText",
      text: "Excused"
    }
  };

  const config = statusConfig[status] || statusConfig.absent;

  return (
    <Badge variant={config.variant} className="flex items-center space-x-1">
      <ApperIcon name={config.icon} className="h-3 w-3" />
      <span>{config.text}</span>
    </Badge>
  );
};

export default AttendanceStatus;