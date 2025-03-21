import React from "react";

const DateTime: React.FC = () => {
  const [currentTime, setCurrentTime] = React.useState(new Date());

  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="text-sm font-semibold text-gray-700">
      <p>Time: {currentTime.toLocaleTimeString()}</p>
      <p>Date: {currentTime.toLocaleDateString()}</p>
    </div>
  );
};

export default DateTime;