import { ethers } from "hardhat";
import { expect } from "chai";
import { SubscriptionManager } from "../typechain-types";

describe("SubscriptionManager Contract", function () {
  let subscriptionManager: SubscriptionManager;
  let owner: any;
  let user: any;
  let otherUser: any;

  // Перед каждым тестом развёртываем новый экземпляр контракта
  beforeEach(async () => {
    const subscriptionManagerFactory = await ethers.getContractFactory("SubscriptionManager");
    subscriptionManager = await subscriptionManagerFactory.deploy();
    await subscriptionManager.waitForDeployment(); // Используем waitForDeployment вместо deployed()

    [owner, user, otherUser] = await ethers.getSigners();
  });

  it("Should allow users to purchase a subscription", async () => {
    const months = 3;
    const payment = ethers.parseEther("0.03");

    await subscriptionManager.connect(user).purchaseSubscription(months, { value: payment });

    const expiration = await subscriptionManager.subscriptions(user.address);
    expect(expiration).to.be.above(Math.floor(Date.now() / 1000)); // Проверка на правильность даты окончания подписки
  });

  it("Should reject subscription purchases with incorrect payment", async () => {
    const months = 2;
    const incorrectPayment = ethers.parseEther("0.015");

    await expect(
      subscriptionManager.connect(user).purchaseSubscription(months, { value: incorrectPayment })
    ).to.be.revertedWith("Incorrect payment amount");
  });

  it("Should reject subscription purchases with zero duration", async () => {
    await expect(
      subscriptionManager.connect(user).purchaseSubscription(0, { value: ethers.parseEther("0") })
    ).to.be.revertedWith("Subscription duration must be at least 1 month");
  });

  it("Should allow users to check their subscription status", async () => {
    const months = 1;
    const payment = ethers.parseEther("0.01");

    await subscriptionManager.connect(user).purchaseSubscription(months, { value: payment });

    const isActive = await subscriptionManager.connect(user).checkSubscription();
    expect(isActive).to.be.true;
  });

  it("Should return false for expired subscriptions", async () => {
    const months = 1;
    const payment = ethers.parseEther("0.01");

    await subscriptionManager.connect(user).purchaseSubscription(months, { value: payment });

    // Симулируем время после окончания подписки
    await ethers.provider.send("evm_increaseTime", [31 * 24 * 60 * 60]); // +31 день
    await ethers.provider.send("evm_mine", []);

    const isActive = await subscriptionManager.connect(user).checkSubscription();
    expect(isActive).to.be.false;
  });

  it("Should emit SubscriptionPurchased event", async () => {
    const months = 2;
    const payment = ethers.parseEther("0.02");

    // Рассчитываем ожидаемую дату окончания подписки
    const expectedExpiration = (await ethers.provider.getBlock("latest")).timestamp + months * 30 * 24 * 60 * 60;

    await expect(subscriptionManager.connect(user).purchaseSubscription(months, { value: payment }))
      .to.emit(subscriptionManager, "SubscriptionPurchased")
      .withArgs(user.address, months, expectedExpiration);

    // Добавляем проверку на разницу в пределах 1 секунды (с допуском в 2 секунды)
    const actualExpiration = await subscriptionManager.subscriptions(user.address);
    expect(actualExpiration).to.be.closeTo(expectedExpiration, 2); // проверка с допуском в 2 секунды
  });

  it("Should emit SubscriptionChecked event", async () => {
    const months = 1;
    const payment = ethers.parseEther("0.01");

    await subscriptionManager.connect(user).purchaseSubscription(months, { value: payment });

    await expect(subscriptionManager.connect(user).logSubscriptionCheck())
      .to.emit(subscriptionManager, "SubscriptionChecked")
      .withArgs(user.address, true);
  });
});
