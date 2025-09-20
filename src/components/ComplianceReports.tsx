import React from 'react';

export const ComplianceReports: React.FC = () => {
  console.log('ComplianceReports component rendered - simplified version');
  
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Compliance Reports</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 border rounded-lg">
          <h3 className="font-semibold">Total Reports</h3>
          <p className="text-2xl">5</p>
        </div>
        <div className="p-4 border rounded-lg">
          <h3 className="font-semibold">Violations</h3>
          <p className="text-2xl text-red-600">2</p>
        </div>
        <div className="p-4 border rounded-lg">
          <h3 className="font-semibold">Pending Reviews</h3>
          <p className="text-2xl text-yellow-600">3</p>
        </div>
      </div>
    </div>
  );
};