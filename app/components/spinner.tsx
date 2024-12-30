import React from "react";

interface SpinnerOverlayProps {
  show: boolean;
}

const SpinnerOverlay: React.FC<SpinnerOverlayProps> = ({ show }) => {
  if (!show) return;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-solid"></div>
    </div>
  );
};

export default SpinnerOverlay;