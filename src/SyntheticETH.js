import { useEffect, useState } from "react";
import { ethers } from "ethers";
import SyntheticETHABI from "./abi/SyntheticETH.json"; // Путь к ABI вашего контракта
import { Button, Input } from "@/components/ui";

const contractAddress = "0xEeCbD49c0Da5c2aA852fD88daFE8e0F91412a070"; // Адрес вашего контракта

export default function SyntheticETH() {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [balance, setBalance] = useState("0");
  const [price, setPrice] = useState("0");
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false); // состояние для отображения загрузки
  const [error, setError] = useState(null); // состояние для отображения ошибок

  useEffect(() => {
    const init = async () => {
      if (window.ethereum) {
        const _provider = new ethers.providers.Web3Provider(window.ethereum);
        await _provider.send("eth_requestAccounts", []); // Запрашиваем доступ к аккаунту пользователя
        const _signer = _provider.getSigner();
        const _contract = new ethers.Contract(contractAddress, SyntheticETHABI, _signer);

        setProvider(_provider);
        setSigner(_signer);
        setContract(_contract);

        const userAddress = await _signer.getAddress();
        const bal = await _contract.balanceOf(userAddress);
        const currentPrice = await _contract.getPrice(); // Используйте правильный метод для получения цены

        setBalance(ethers.utils.formatUnits(bal, 18)); // Форматируем баланс
        setPrice(ethers.utils.formatUnits(currentPrice, 18)); // Форматируем цену
      } else {
        alert("Please install MetaMask!");
      }
    };
    init();
  }, []);

  const mint = async () => {
    try {
      setLoading(true); // Включаем состояние загрузки
      setError(null); // Очищаем ошибки перед операцией
      const tx = await contract.mint(await signer.getAddress(), ethers.utils.parseUnits("1000", 18));
      await tx.wait();
      alert("Minted 1000 sETH");

      // Обновляем баланс после mint
      const userAddress = await signer.getAddress();
      const bal = await contract.balanceOf(userAddress);
      setBalance(ethers.utils.formatUnits(bal, 18));
    } catch (error) {
      setError("Error minting sETH: " + error.message); // Показываем ошибку
    } finally {
      setLoading(false); // Отключаем состояние загрузки
    }
  };

  const transfer = async () => {
    try {
      setLoading(true); // Включаем состояние загрузки
      setError(null); // Очищаем ошибки перед операцией
      const tx = await contract.transfer(recipient, ethers.utils.parseUnits(amount, 18));
      await tx.wait();
      alert(`Transferred ${amount} sETH to ${recipient}`);

      // Обновляем баланс после перевода
      const userAddress = await signer.getAddress();
      const bal = await contract.balanceOf(userAddress);
      setBalance(ethers.utils.formatUnits(bal, 18));
    } catch (error) {
      setError("Error transferring sETH: " + error.message); // Показываем ошибку
    } finally {
      setLoading(false); // Отключаем состояние загрузки
    }
  };

  return (
    <div className="p-4 space-y-4 max-w-md mx-auto bg-white shadow-xl rounded-2xl">
      <h2 className="text-xl font-bold">SyntheticETH Dashboard</h2>
      <p><strong>Balance:</strong> {balance} sETH</p>
      <p><strong>Original sETH Price:</strong> {price} ETH</p>

      <Button onClick={mint} disabled={loading}>Mint 1000 sETH</Button>

      <div className="space-y-2 mt-4">
        <Input
          placeholder="Recipient Address"
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
        />
        <Input
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <Button onClick={transfer} disabled={loading}>Transfer</Button>
      </div>

      {loading && <p>Loading...</p>} {/* Показываем индикатор загрузки */}
      {error && <p className="text-red-500">{error}</p>} {/* Показываем ошибку, если она есть */}
    </div>
  );
}
