import React from "react";
import Badge from "@/components/atoms/Badge";

const GradeBadge = ({ score, maxScore = 100 }) => {
  const percentage = (score / maxScore) * 100;
  
  const getGrade = (percentage) => {
    if (percentage >= 90) return "A";
    if (percentage >= 80) return "B";
    if (percentage >= 70) return "C";
    if (percentage >= 60) return "D";
    return "F";
  };

  const grade = getGrade(percentage);

  return (
    <div className="flex items-center space-x-2">
      <Badge variant={`grade-${grade}`}>
        {grade}
      </Badge>
      <span className="text-sm text-gray-600">
        {score}/{maxScore} ({percentage.toFixed(1)}%)
      </span>
    </div>
  );
};

export default GradeBadge;