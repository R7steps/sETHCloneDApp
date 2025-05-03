const { ethers } = require("hardhat");

async function main() {
    // Адрес владельца, который будет указан в контракте
    const ownerAddress = "0xE9e0aD4CAB08D2Bd450695b347BdC1Eb966Ede1C"; 

    // Получаем фабрику для контракта
    const SyntheticETH = await ethers.getContractFactory("SyntheticETH");

    // Разворачиваем контракт, передавая адрес владельца
    const syntheticETH = await SyntheticETH.deploy(ownerAddress);

    console.log("SyntheticETH deployed to:", syntheticETH.address);
}

// Запуск скрипта
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
