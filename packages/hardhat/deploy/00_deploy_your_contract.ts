import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

/**
 * Скрипт для развертывания контракта SubscriptionManager.
 */
const deploySubscriptionManager: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  console.log("Разворачиваем контракт SubscriptionManager...");

  const deployment = await deploy("SubscriptionManager", {
    from: deployer,
    args: [], 
    log: true,
    autoMine: true, // Для локальной сети
  });

  console.log(`Контракт SubscriptionManager развернут по адресу: ${deployment.address}`);
};

export default deploySubscriptionManager;
deploySubscriptionManager.tags = ["SubscriptionManager"];
