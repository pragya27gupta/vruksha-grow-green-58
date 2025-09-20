import React from 'react';

export const RegulatoryAnalytics: React.FC = () => {
  console.log('RegulatoryAnalytics component rendered - simplified version');
  
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Regulatory Analytics</h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 border rounded-lg">
          <h3 className="font-semibold">Compliance Rate</h3>
          <p className="text-2xl text-green-600">96.8%</p>
        </div>
        <div className="p-4 border rounded-lg">
          <h3 className="font-semibold">Active Violations</h3>
          <p className="text-2xl text-red-600">5</p>
        </div>
        <div className="p-4 border rounded-lg">
          <h3 className="font-semibold">Inspections</h3>
          <p className="text-2xl">99</p>
        </div>
        <div className="p-4 border rounded-lg">
          <h3 className="font-semibold">Response Time</h3>
          <p className="text-2xl">2.3 days</p>
        </div>
      </div>
    </div>
  );
};