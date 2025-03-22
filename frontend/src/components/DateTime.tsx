import React from "react";

interface DateTimeProps {
  darkMode: boolean; // Add a prop to receive the darkMode state
}

const DateTime: React.FC<DateTimeProps> = ({ darkMode }) => {
  const [currentTime, setCurrentTime] = React.useState(new Date());

  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-w-[120px] text-sm font-semibold">
      <p
        className={`w-full text-center ${darkMode ? 'text-white' : 'text-[#2b9bda]'}`}
      >
        {currentTime.toLocaleTimeString()}
      </p>
      <p
        className={`w-full text-center ${darkMode ? 'text-white' : 'text-[#2b9bda]'}`}
      >
        {currentTime.toLocaleDateString()}
      </p>
    </div>
  );
};

export default DateTime;