// components/Balance.tsx

import { FC } from "react";

interface BalanceProps {
  balance: string;
}

const Balance: FC<BalanceProps> = ({ balance }) => {
  return (
    <div className="flex items-center space-x-2 mb-4">
      <p className="text-xl font-semibold text-gray-800">
        Подписка: {balance === "Активна" ? "Активна" : "Неактивна"}
      </p>
    </div>
  );
};

export default Balance;
