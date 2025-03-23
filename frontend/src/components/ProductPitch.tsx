import React, { Component } from 'react';

interface ProductPitchProps {
  darkMode: boolean;
}

class ProductPitch extends Component<ProductPitchProps> {
  public render(): React.JSX.Element {
    const { darkMode } = this.props;

    return (
      <div className="flex items-center justify-center min-h-screen">
        <section
          className={`p-8 w-[700px] rounded-lg px-30 h-[480px] ${darkMode ? "": 'bg-[#d3f3f8]'}`}
          style={{
            backgroundImage: darkMode ? "url('./boarder.png')" :"url('./boarderLight.png')",
            backgroundSize: '100%', // Scales the background image
            backgroundPosition: 'top  ',
            backgroundRepeat: 'no-repeat',
          }}
        >
          <div className={`max-w-4xl mx-auto ${
            darkMode ? '' : ''
          }`}>
            <h2 
              className="text-xl font-bold" 
              style={{ color: darkMode ? 'white' : '#d3f3f8' }}
            >
              About Us
            </h2>
            <p 
              className={`text-lg leading-relaxed ${
                darkMode ? 'text-white' : 'text-[#2b9bda]'
              }`} 
              style={{ fontFamily: 'sans-serif' }}
            >
              What if you could easily track how housing and employment growth are shaping the future of Hamilton and Toronto—all in one place?
              Regional planners, real estate investors, and policymakers often struggle with fragmented data, making informed decisions difficult.
              The Metropolitan Housing and Employment Growth Index simplifies this by integrating housing statistics and employment trends into an
              intuitive platform with Line Charts and Radar Charts, enabling quick comparisons and insights. Imagine a city planner aligning development
              plans with real-time data—saving time and ensuring balanced growth. By transforming complex data into clear visuals, our tool boosts productivity,
              supports data-driven decisions, and maximizes ROI.
            </p>
          </div>
        </section>
      </div>
    );
  }
}

export default ProductPitch;
