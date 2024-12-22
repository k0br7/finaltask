// components/SubscriptionForm.tsx

import { FC } from "react";

interface SubscriptionFormProps {
  duration: string;
  onDurationChange: (duration: string) => void;
}

const SubscriptionForm: FC<SubscriptionFormProps> = ({ duration, onDurationChange }) => {
  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-700 mb-2">Длительность подписки (в месяцах)</label>
      <input
        type="number"
        value={duration}
        onChange={(e) => onDurationChange(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded"
        min="1"
      />
    </div>
  );
};

export default SubscriptionForm;
