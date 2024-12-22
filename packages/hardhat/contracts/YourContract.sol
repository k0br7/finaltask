// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SubscriptionManager {
    // Событие для логирования подписки
    event SubscriptionPurchased(address indexed user, uint256 duration, uint256 expirationDate);
    event SubscriptionChecked(address indexed user, bool isActive);

    // Хранилище подписок
    mapping(address => uint256) public subscriptions;

    // Цена подписки за месяц (в Wei)
    uint256 public monthlyRate = 0.01 ether;

    // Покупка подписки на определённое количество месяцев
    function purchaseSubscription(uint256 months) public payable {
        require(months > 0, "Subscription duration must be at least 1 month");
        require(msg.value == months * monthlyRate, "Incorrect payment amount");

        uint256 currentExpiration = subscriptions[msg.sender];
        uint256 newExpiration = block.timestamp > currentExpiration
            ? block.timestamp + months * 30 days
            : currentExpiration + months * 30 days;

        subscriptions[msg.sender] = newExpiration;
        emit SubscriptionPurchased(msg.sender, months, newExpiration);
    }

    // Проверка активности подписки (только просмотр)
    function checkSubscription() public view returns (bool) {
        return block.timestamp < subscriptions[msg.sender];
    }

    // Логирование проверки подписки
    function logSubscriptionCheck() public {
        bool isActive = checkSubscription();
        emit SubscriptionChecked(msg.sender, isActive);
    }
}
