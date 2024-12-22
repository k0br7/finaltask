// components/SubscriptionStatus.tsx

import { FC } from "react";

interface SubscriptionStatusProps {
  status: boolean; // Если статус подписки активен, передаем true
}

const SubscriptionStatus: FC<SubscriptionStatusProps> = ({ status }) => {
  return (
    <div className="mt-4">
      <h2 className="text-lg font-semibold text-black">Статус подписки</h2> {/* Изменено на text-black */}
      <p className={status ? "text-green-500" : "text-red-500"}>
        {status ? "Активна" : "Неактивна"}
      </p>
    </div>
  );
};

export default SubscriptionStatus;
