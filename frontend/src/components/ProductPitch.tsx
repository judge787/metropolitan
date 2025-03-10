import React, { Component } from 'react';

class ProductPitch extends Component {
  public render(): React.JSX.Element {
    return (
      <div className="flex items-start flex justify-center items-center min-h-screen">
      <section className="bg-[#d3f3f8] p-8 w-200 h-80 rounded-lg shadow-md">
        <div className="max-w-4xl mx-auto">
          <p className="text-lg text-black font-black leading-relaxed" style={{ fontFamily: 'Fab, sans-serif' , fontWeight: 'bold' }}>
            What if you could easily track how housing and employment growth are shaping the future of Hamilton and Toronto—all in one place?
            Regional planners, real estate investors, and policymakers often struggle with fragmented data, making informed decisions difficult.
            The Metropolitan Housing and Employment Growth Index simplifies this by integrating housing statistics and employment trends into an
            intuitive platform with Line Charts and Radar Charts, enabling quick comparisons and insights. Imagine a city planner aligning development
            plans with real-time data—saving time and ensuring balanced growth. By transforming complex data into clear visuals, our tool boosts productivity,
            supports data-driven decisions, and maximizes ROI.
          </p>

          {/* Optional: Add more content sections here if needed */}
          {/* Example: */}
          {/* <div className="mt-8">
            <h3 className="text-2xl font-bold mb-4 text-gray-800">Key Features</h3>
            <ul className="list-disc pl-6 text-gray-700 leading-relaxed">
              <li>Interactive Line Charts</li>
              <li>Comparative Radar Charts</li>
              <li>Real-time Data Updates</li>
            </ul>
          </div> */}
        </div>
      </section>
      </div>
    );
  }
}

export default ProductPitch;