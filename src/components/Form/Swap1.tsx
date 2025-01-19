"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import {
  useAccount,
  useBalance,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import { formatUnits, parseEther } from "ethers";
import { abi } from "@/abi/abi";
import { Button } from "../ui/button";
import { ArrowDownUp, Loader2 } from "lucide-react";

interface Token {
  name: string;
  logoUrl: string;
  balance: string;
  price: number;
}

export const SwapForm: React.FC = () => {
  const [tokenAInput, setTokenAInput] = useState<Token>({
    name: "XION",
    logoUrl: "/xion.png",
    balance: "0",
    price: 0,
  });
  const [tokenBInput, setTokenBInput] = useState<Token>({
    name: "GOLD",
    logoUrl: "https://s2.coinmarketcap.com/static/img/coins/64x64/5705.png",
    balance: "0",
    price: 0,
  });
  const [amountAInput, setAmountAInput] = useState("0");
  const [amountBInput, setAmountBInput] = useState("0");
  const [amountA, setAmountA] = useState("");
  const [amountB, setAmountB] = useState("");
  const [priceA, setPriceA] = useState(0);
  const [priceB, setPriceB] = useState(0);
  const [exchangeRate, setExchangeRate] = useState(0);
  const { isConnected, address } = useAccount();

  const tokenABalance = useBalance({
    address,
  });

  const { writeContract, isPending, data: hash } = useWriteContract();

  useEffect(() => {
    const fetchAPrice = async () => {
      try {
        const response = await fetch(
          "https://api.diadata.org/v1/assetQuotation/Metis/0xDeadDeAddeAddEAddeadDEaDDEAdDeaDDeAD0000"
        );

        if (response.ok) {
          const result = await response.json();
          setPriceA(result.Price);
        }
      } catch (error) {
        console.log("Error message: ", error)
      }
    };

    const fetchBPrice = async () => {
      try {
        const response = await fetch(
          "https://dgt-dev.vercel.app/v1/token/price"
        );

        if (response.ok) {
          const result = await response.json();
          setPriceB(result.price * 10 ** 10);
        }
      } catch (error) {
        console.log("Error message: ", error)
      }
    };

    fetchAPrice();
    fetchBPrice();

    if (priceA && priceB) {
      const rate = priceA / priceB;
      setExchangeRate(rate);
    }

    if (tokenABalance.data?.value) {
      setAmountA(formatUnits(tokenABalance.data?.value));
    }
  }, [tokenABalance, priceA, priceB]);

  const amountInputAChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const numericValue = event.target.value;

    if (+numericValue >= 0) {
      setAmountAInput(numericValue);
      setAmountBInput((+numericValue * exchangeRate).toString());
    }
  };

  function truncateAddress(address: string) {
    return `${address.slice(0, 6)}...${address.slice(-6)}`;
  }

  const swapHandler = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (+amountAInput > 0) {
      writeContract({
        abi,
        address: "0xd4c4d35Af5b77F0f66e80e507cFbCC23240bDb32",
        functionName: "buyGold",
        args: [],
        value: parseEther(amountAInput),
      });
    }
  };

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  const handleSwap = () => {
    // Swap tokens
    const tempToken = { ...tokenAInput };
    setTokenAInput({ ...tokenBInput });
    setTokenBInput(tempToken);

    // Swap amounts
    const tempAmountInput = amountAInput;
    setAmountAInput(amountBInput);
    setAmountBInput(tempAmountInput);

    // Swap balances
    const tempAmount = amountA;
    setAmountA(amountB);
    setAmountB(tempAmount);

    // Update exchange rate
    if (priceA && priceB) {
      const newRate = priceB / priceA;
      setExchangeRate(newRate);
    }
  };

  return (
    <>
      <form onSubmit={swapHandler} className="">
        <div className="space-y-2">
          <div className="flex items-center gap-1">
            <label className="text-sm text-gray-400 mb-1 block font-semibold">
              From
            </label>
            <Image
              className="dark:invert rounded-full"
              src={tokenAInput.logoUrl}
              alt={`${tokenAInput.name} logo`}
              width={32}
              height={32}
            />
            <span className="text-white bold">{tokenAInput.name}</span>
          </div>
          <div className="space-y-2">
            <div className="p-3 coin-input-text">
              <div className="flex flex-col md:flex-row p-1">
                <div className="md:w-1/2 items-center coin-input-text flex">
                  <Image
                    className="dark:invert rounded-full mr-1"
                    src={tokenAInput.logoUrl}
                    alt={tokenAInput.name}
                    width={32}
                    height={32}
                  />
                  <span className="text-white bold">{tokenAInput.name}</span>
                </div>
                <div className="md:w-1/2 items-center p-1">
                  <Input
                    type="number"
                    placeholder="0"
                    className="coin-input-22"
                    onChange={amountInputAChange}
                    step="any"
                    max={amountA}
                    min={0}
                    value={amountAInput}
                  />
                </div>
              </div>
              <div className="num-dollar p-1 flex items-center justify-between">
                <div className="flex gap-1 items-center">
                  <Image
                    className="dark:invert rounded-full mr-1"
                    src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACkAAAAoCAYAAABjPNNTAAAACXBIWXMAABYlAAAWJQFJUiTwAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAGPSURBVHgB7ZixTsMwEIb/RB3oWLbABhsdmRm7MjKy9hl4AkZeAXiNjjAy0rHdYGzHdgv/CRfFLrFbKT07aj7plNhOpF/2+ew7oOOIyEIflGU54OOM1oceyyzLZptGr+4rirvkY0S7gD4fNL9IChRxIyRC7nZQ4A0SEihYM0mBp7AFrmlvtDkOz7huwF3uIe2k0n6iAy+hACeodsxd7mHlfa4lMIQrclB51ww5XnLPWGHCUHR6gfE7Cn3n8xu69M0ESVBfWCcOBx5gL3lsJhQ5ydECfCLXSASfT4ofPtPOoecCEqNv3U7vxqE/yGzOoIS5cW2JbL1PJkMnsilaITJ0LDYOd7CEtKLSNWUUWfn+URdJrmBfrB9pXpGdTzZFjOWWdPUvZ9rl9q8u0ojaKy3pfLIpfCKTTcSqvlKYYkF0XJFTp32fglB3d0t4kNNgU8WQkt+YQiVkLHB4/nUxS6ScoRT0ArsuI7fla0Rka+OY4uUrUk/EKPSTM/qF36WXJD1qLh4sRwsmQYrByiSD6fMDCC1lTEFX9xwAAAAASUVORK5CYII="
                    alt="Dollar sign"
                    width={16}
                    height={20}
                  />
                  <p>Coin Value: {amountA ? amountA.slice(0, 6) : "0.0"}</p>
                </div>
                <div className="text-right">
                  ${(+amountAInput * priceA).toFixed(2)}
                </div>
              </div>
            </div>
            <div className="flex justify-center -my-1.5">
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8 rounded-full bg-[#282e3a] swap"
                onClick={handleSwap}
              >
                <ArrowDownUp className="h-4 w-4" />
              </Button>
            </div>
            <div className="p-3 coin-input-text">
              <div className="flex flex-col md:flex-row p-1">
                <div className="md:w-1/2 items-center coin-input-text flex">
                  <Image
                    className="dark:invert rounded-full mr-1"
                    src={tokenBInput.logoUrl}
                    alt={tokenBInput.name}
                    width={32}
                    height={32}
                  />
                  <span className="text-white font-medium">
                    {tokenBInput.name}
                  </span>
                </div>
                <div className="md:w-1/2 items-center p-1">
                  <Input
                    type="number"
                    placeholder="0"
                    className="coin-input-22"
                    readOnly
                    value={amountBInput}
                  />
                </div>
              </div>
              <div className="num-dollar p-1 flex items-center justify-between">
                <div className="flex gap-1 items-center">
                  <Image
                    className="dark:invert mr-1"
                    src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACkAAAAoCAYAAABjPNNTAAAACXBIWXMAABYlAAAWJQFJUiTwAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAGPSURBVHgB7ZixTsMwEIb/RB3oWLbABhsdmRm7MjKy9hl4AkZeAXiNjjAy0rHdYGzHdgv/CRfFLrFbKT07aj7plNhOpF/2+ew7oOOIyEIflGU54OOM1oceyyzLZptGr+4rirvkY0S7gD4fNL9IChRxIyRC7nZQ4A0SEihYM0mBp7AFrmlvtDkOz7huwF3uIe2k0n6iAy+hACeodsxd7mHlfa4lMIQrclB51ww5XnLPWGHCUHR6gfE7Cn3n8xu69M0ESVBfWCcOBx5gL3lsJhQ5ydECfCLXSASfT4ofPtPOoecCEqNv3U7vxqE/yGzOoIS5cW2JbL1PJkMnsilaITJ0LDYOd7CEtKLSNWUUWfn+URdJrmBfrB9pXpGdTzZFjOWWdPUvZ9rl9q8u0ojaKy3pfLIpfCKTTcSqvlKYYkF0XJFTp32fglB3d0t4kNNgU8WQkt+YQiVkLHB4/nUxS6ScoRT0ArsuI7fla0Rka+OY4uUrUk/EKPSTM/qF36WXJD1qLh4sRwsmQYrByiSD6fMDCC1lTEFX9xwAAAAASUVORK5CYII="
                    alt="Dollar sign"
                    width={16}
                    height={16}
                  />
                  <p>Coin Value: {amountB ? amountB.slice(0, 6) : "0.0"}</p>
                </div>
                <div className="text-right">
                  ${(+amountBInput * priceB).toFixed(2)}
                </div>
              </div>
            </div>
          </div>
          <div className="space-y-1">
            <div className="p-1 text-white swap text-sm">
              <div>
                1 {tokenAInput.name} ={" "}
                {exchangeRate ? exchangeRate.toFixed(5) : ""} {tokenBInput.name}{" "}
                ($
                {priceB.toFixed(2)})
              </div>
              <div>Fee: 0.00025 {tokenAInput.name}</div>
            </div>
            {isPending ? (
              <Button
                disabled
                className="btn-grad h-[54px] w-full flex items-center justify-center"
              >
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </Button>
            ) : isConfirming ? (
              <Button
                disabled
                className="btn-grad h-[54px] w-full flex items-center justify-center"
              >
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Waiting for confirmation...
              </Button>
            ) : (
              <Button
                type="submit"
                disabled={!isConnected}
                className={`${
                  isConnected && +amountAInput > 0 && "touch"
                } btn-grad h-[54px] w-full flex items-center justify-center`}
              >
                {isConnected ? "Swap" : "Connect Wallet"}
              </Button>
            )}
          </div>
        </div>
        {/* <TokenSelect /> */}
      </form>
      {isConfirmed && (
        <div className="mt-2 text-white text-xs">
          <h3>Transaction confirmed!</h3>
          <span>Hash: {hash && truncateAddress(hash)}</span>
        </div>
      )}
    </>
  );
};
