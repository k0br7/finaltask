"use client";

import { useState, useEffect } from "react";
import { useAccount, usePublicClient, useWalletClient } from "wagmi";
import Balance from "../components/Balance";
import ActionButton from "../components/ActionButton";
import SubscriptionForm from "../components/SubscriptionForm";
import SubscriptionStatus from "../components/SubscriptionStatus";

const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

const CONTRACT_ABI = [
  {
    inputs: [{ internalType: "address", name: "user", type: "address" }],
    name: "subscriptions",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "months", type: "uint256" }],
    name: "purchaseSubscription",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [],
    name: "checkSubscription",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
];

const Page = () => {
  const { address, isConnected } = useAccount();
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();

  const [subscriptionDuration, setSubscriptionDuration] = useState<string>("1");
  const [balance, setBalance] = useState<string>("0");

  const fetchBalance = async () => {
    if (!publicClient || !address) {
      console.log("Нет подключенного адреса");
      return;
    }

    try {
      const userSubscription = await publicClient.readContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: "checkSubscription", // Используем функцию для получения статуса подписки
      });
      console.log("Статус подписки пользователя:", userSubscription);
      setBalance(userSubscription ? "Активна" : "Неактивна");
    } catch (error) {
      console.error("Ошибка получения статуса подписки:", error);
      alert("Не удалось получить статус подписки.");
    }
  };

  const handlePurchaseSubscription = async () => {
    if (!walletClient || !subscriptionDuration) return;

    try {
      const tx = await walletClient.writeContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: "purchaseSubscription",
        args: [parseInt(subscriptionDuration)],
        overrides: {
          value: BigInt(parseInt(subscriptionDuration) * 0.01 * 10 ** 18), // Сумма в Wei
        },
      });

      const receipt = await publicClient.waitForTransactionReceipt(tx.hash);
      console.log("Транзакция подтверждена:", receipt);

      alert("Подписка успешно приобретена!");
      fetchBalance(); // Обновляем статус подписки
    } catch (error) {
      console.error("Ошибка при покупке подписки:", error);
      alert("Не удалось приобрести подписку.");
    }
  };

  useEffect(() => {
    if (address) {
      fetchBalance(); // Проверяем статус подписки при подключении кошелька
    }
  }, [address]);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold text-center text-black mb-8">Subscription Manager</h1>

      {isConnected ? (
        <div className="max-w-md mx-auto bg-white shadow-md rounded-lg p-6">
          <Balance balance={balance} />
          <SubscriptionForm duration={subscriptionDuration} onDurationChange={setSubscriptionDuration} />
          <ActionButton label="Купить подписку" onClick={handlePurchaseSubscription} color="bg-green-500" />
          <SubscriptionStatus status={balance === "Активна"} />
        </div>
      ) : (
        <p className="text-center text-gray-500">Подключите ваш кошелек, чтобы взаимодействовать с контрактом.</p>
      )}
    </div>
  );
};

export default Page;
