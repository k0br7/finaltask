// components/ActionButton.tsx

import { FC } from "react";

interface ActionButtonProps {
  label: string;
  onClick: () => void;
  color: string;
}

const ActionButton: FC<ActionButtonProps> = ({ label, onClick, color }) => {
  return (
    <button
      onClick={onClick}
      className={`w-full py-2 mt-4 ${color} text-white font-semibold rounded-lg`}
    >
      {label}
    </button>
  );
};

export default ActionButton;
