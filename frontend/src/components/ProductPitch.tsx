import React from 'react';

const ProductPitch: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent pb-2">
          Here's our product pitch
        </h2>
        <div className="w-24 h-1 bg-blue-600 mx-auto rounded-full mt-2"></div>
      </div>
      
      <div className="space-y-4 text-gray-700 leading-relaxed">
        <p className="text-lg">
          What if you could easily track how housing and employment growth are shaping the future of Hamilton and Toronto—all in one place?
        </p>
        
        <p className="text-lg">
          Regional planners, real estate investors, and policymakers often struggle with fragmented data, making informed decisions difficult. The Metropolitan Housing and Employment Growth Index simplifies this by integrating housing statistics and employment trends into an intuitive platform with Line Charts and Radar Charts, enabling quick comparisons and insights.
        </p>
        
        <p className="text-lg">
          Imagine a city planner aligning development plans with real-time data—saving time and ensuring balanced growth. By transforming complex data into clear visuals, our tool boosts productivity, supports data-driven decisions, and maximizes ROI.
        </p>
      </div>
    </div>
  );
};

export default ProductPitch;