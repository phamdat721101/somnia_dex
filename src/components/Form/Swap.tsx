"use client";
/* eslint-disable */

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import {
  useAccount,
  useBalance,
  useReadContract,
  useWaitForTransactionReceipt,
  useWriteContract,
  useSwitchChain
} from "wagmi";
import { formatUnits, parseEther, parseUnits } from "ethers";
import { abi } from "@/abi/abi";
import { Button } from "../ui/button";
import { ArrowDownUp, Search, Loader2, Fuel } from "lucide-react";
import { Token } from "@/types";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { chainData } from "@/data/chainData";
import { base_splx_abi } from '@/abi/base_slpx_abi'
//require('dotenv').config();

type TokenType = {
  tokenSymbol: string;
  tokenName: string;
  contractAddress: string;
  decimals: number;
  chainId: number;
  logoURI: string;
  price: number;
};

interface TokenSelectorProps {
  onSelect: (token: TokenType) => void;
  selectedToken: TokenType;
  title: string;
}

export const SwapForm: React.FC = () => {
  const [tokenAInput, setTokenAInput] = useState<Token>({
    name: "Somnia",
    logo_url: "/somnia.png",
    unit: "Somnia",
    price: 45.78
  });
  const [tokenBInput, setTokenBInput] = useState<Token>({
    name: "GOLD",
    logo_url: "https://s2.coinmarketcap.com/static/img/coins/64x64/5705.png",
    unit: "Ounce",
    price: 2611.17
  });

  let xau_contract = process.env.NEXT_PUBLIC_XAU_CONTRACT as `0x${string}` ?? "0xd4c4d35Af5b77F0f66e80e507cFbCC23240bDb32"
  let base_contract = '0xFa0EeA22012ceAE7188547995f4c8cfC2F233ba7' as `0x${string}`

  const [explorer_url, setExplorerUrl] = useState(""); 
  const [amountAInput, setAmountAInput] = useState("");
  const [amountBInput, setAmountBInput] = useState("");
  const [amountA, setAmountA] = useState("");
  const [amountB, setAmountB] = useState("");
  const [priceA, setPriceA] = useState(0);
  const [priceB, setPriceB] = useState(0);
  const { isConnected, address } = useAccount();
  const amountAInputRef = useRef<HTMLInputElement>(null);
  const [selectedTokenA, setSelectedTokenA] = useState<TokenType>(chainData[0]);
  const [selectedTokenB, setSelectedTokenB] = useState<TokenType>(chainData[1]);
  const [searchQuery, setSearchQuery] = useState("");
  const { chains, switchChain } = useSwitchChain()
  console.log("Chain connected: ", chains)
  chains.map((chain) =>{
    switch (chain.id) {
      case 11155931:
        xau_contract = '0xA1F002bf7cAD148a639418D77b93912871901875'
        // explorer_url = "https://testnet-explorer.riselabs.xyz"
        console.log("Xau Rise contract: ", xau_contract, " -rise: ", process.env.NEXT_RISE_PUBLIC_XAU_CONTRACT)
        break;
      case 84532:
        // explorer_url = "https://sepolia-explorer.base.org"
        break;
      default:
        // explorer_url = "https://sepolia-explorer.metisdevops.link"
        break;
    }

  })

  const nativeBalance = useBalance({
    address,
  });

  const tokenBalance = useReadContract({
    abi,
    address: xau_contract,
    functionName: "balanceOf",
    args: [address || "0x0"],
  });

  const { writeContract, isPending, data: hash } = useWriteContract();

  const filteredTokens = chainData.filter(token =>
    token.tokenName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    token.tokenSymbol.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const TokenSelector = ({ onSelect, selectedToken, title }: TokenSelectorProps) => {
    const [localSearchQuery, setLocalSearchQuery] = useState("");
    const localFilteredTokens = chainData.filter(token =>
      token.tokenName.toLowerCase().includes(localSearchQuery.toLowerCase()) ||
      token.tokenSymbol.toLowerCase().includes(localSearchQuery.toLowerCase())
    );

    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="ghost" className="w-full justify-start p-2 hover:bg-gray-100/10 hover:text-gray-300">
            <Image
              className="rounded-full mr-2"
              src={selectedToken.logoURI}
              alt={selectedToken.tokenName}
              width={32}
              height={32}
            />
            <span>{selectedToken.tokenSymbol}</span>
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <div className="flex items-center border rounded-md p-2 mt-2" onClick={(e) => e.stopPropagation()}>
              <Search className="w-4 h-4 mr-2" />
              <input
                type="text"
                placeholder="Search tokens"
                className="bg-transparent outline-none w-full"
                value={localSearchQuery}
                onChange={(e) => setLocalSearchQuery(e.target.value)}
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </DialogHeader>
          <div className="max-h-[300px] overflow-y-auto">
            {localFilteredTokens.map((token) => (
              <Button
                key={token.tokenSymbol}
                variant="ghost"
                className="w-full justify-start p-2 hover:bg-gray-100/10"
                onClick={() => onSelect(token)}
              >
                <Image
                  className="rounded-full mr-2"
                  src={token.logoURI}
                  alt={token.tokenName}
                  width={32}
                  height={32}
                />
                <div className="flex flex-col items-start">
                  <span>{token.tokenSymbol}</span>
                  <span className="text-sm text-gray-400">{token.tokenName}</span>
                </div>
              </Button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const [responseA, responseB] = await Promise.all([
          fetch(
            "https://api.diadata.org/v1/assetQuotation/Metis/0xDeadDeAddeAddEAddeadDEaDDEAdDeaDDeAD0000"
          ),
          fetch("https://dgt-dev.vercel.app/v1/token/price"),
        ]);

        if (responseA.ok) {
          const resultA = await responseA.json();
          setPriceA(resultA.Price);
        }

        if (responseB.ok) {
          const resultB = await responseB.json();
          setPriceB(resultB.price * 10 ** 10);
        }
      } catch (error) {
        console.log("Error message: ", error)
      }
    };

    fetchPrices();

    if (nativeBalance.data?.value) {
      setAmountA(formatUnits(nativeBalance.data?.value));
    }
    if (tokenBalance.data) {
      setAmountB(`${formatUnits(tokenBalance.data?.toString())}`);
    }
  }, [address, nativeBalance.data?.value, tokenBalance.data]);

  const amountInputAChange = () => {
    const numericValue = amountAInputRef.current?.value;

    if (numericValue && +numericValue > 0) {
      setAmountAInput(numericValue);
      setAmountBInput(((+numericValue * tokenAInput.price) / tokenBInput.price).toString());
    } else {
      setAmountAInput("");
      setAmountBInput("");
    }
  };

  function truncateAddress(address: string) {
    return `${address.slice(0, 6)}...${address.slice(-6)}`;
  }

  const swapHandler = (event: React.FormEvent<HTMLFormElement>) => {
    console.log(+amountAInput > 0)
    event.preventDefault();
    if (+amountAInput > 0) {
      console.log(tokenBInput.name)
      switch (tokenAInput.name) {
        case "Somnia":
          setExplorerUrl("https://somnia-devnet.socialscan.io/")
          // xau_contract = process.env.NEXT_PUBLIC_XAU_CONTRACT as `0x${string}` ?? "0xd4c4d35Af5b77F0f66e80e507cFbCC23240bDb32"
          writeContract({
            abi,
            address: "0xA1F002bf7cAD148a639418D77b93912871901875" as `0x${string}`,
            functionName: "buyGold",
            args: [],
            value: parseEther(amountAInput),
          });
          break;        
        case "GOLD":
          setExplorerUrl("https://somnia-devnet.socialscan.io/")
          writeContract({
            abi,
            address: "0xA1F002bf7cAD148a639418D77b93912871901875" as `0x${string}`,
            functionName: "sellGold",
            args: [parseEther(amountAInput)],
          });
          break;
        default:
          setExplorerUrl("https://sepolia-explorer.metisdevops.link")
          xau_contract = process.env.NEXT_PUBLIC_XAU_CONTRACT as `0x${string}` ?? "0xd4c4d35Af5b77F0f66e80e507cFbCC23240bDb32"
          writeContract({
            abi,
            address: xau_contract,
            functionName: "buyGold",
            args: [],
            value: parseEther(amountAInput),
          });
          break;
      }
    }
  };

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  function clickHandler(event: React.MouseEvent<HTMLButtonElement, MouseEvent>): void {
    event.preventDefault();

    // Swap selected tokens
    const tempSelectedToken = selectedTokenA;
    setSelectedTokenA(selectedTokenB);
    setSelectedTokenB(tempSelectedToken);

    // Swap token inputs
    const tempTokenInput = tokenAInput;
    setTokenAInput(tokenBInput);
    setTokenBInput(tempTokenInput);

    // Swap balances
    const tempBalance = amountA;
    setAmountA(amountB);
    setAmountB(tempBalance);

    // Swap prices
    const tempPrice = priceA;
    setPriceA(priceB);
    setPriceB(tempPrice);

    // Swap input amounts if they exist
    if (amountAInput && amountBInput) {
      setAmountAInput(amountBInput);
      setAmountBInput(amountAInput);
      if (amountAInputRef.current) {
        amountAInputRef.current.value = amountBInput;
      }
    } else {
      setAmountAInput("");
      setAmountBInput("");
      if (amountAInputRef.current) {
        amountAInputRef.current.value = "";
      }
    }
  }

  return (
    <div className="w-full bg-[#171717] p-6 rounded-2xl">
      <form onSubmit={swapHandler} className="space-y-4 rounded-lg">
        <div className="flex items-center gap-1">
          <label className="text-sm text-gray-400 mb-1 block font-semibold">
            From
          </label>
          <Image
            className="dark:invert rounded-full"
            src={selectedTokenA.logoURI}
            alt="Next.js logo"
            width={32}
            height={32}
          />
          <span className="text-white bold">{selectedTokenA.tokenSymbol}</span>
        </div>
        <div className="p-3 coin-input-text">
          <div className="flex flex-col md:flex-row p-1">
            <div className="md:w-1/2 items-center coin-input-text flex">
              <Dialog>
                <TokenSelector
                  onSelect={(token) => {
                    setSelectedTokenA(token);
                    // Update tokenAInput if needed
                    setTokenAInput({
                      name: token.tokenName,
                      logo_url: token.logoURI,
                      unit: token.tokenSymbol,
                      price: token.price
                    });
                  }}
                  selectedToken={selectedTokenA}
                  title="Select token to swap from"
                />
              </Dialog>
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
                ref={amountAInputRef}
              />
            </div>
          </div>
          <div className="num-dollar p-1 flex items-center justify-between">
            <div className="flex gap-1 items-center">
              <Image
                className="dark:invert mr-1"
                src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACkAAAAoCAYAAABjPNNTAAAACXBIWXMAABYlAAAWJQFJUiTwAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAGPSURBVHgB7ZixTsMwEIb/RB3oWLbABhsdmRm7MjKy9hl4AkZeAXiNjjAy0rHdYGzHdgv/CRfFLrFbKT07aj7plNhOpF/2+ew7oOOIyEIflGU54OOM1oceyyzLZptGr+4rirvkY0S7gD4fNL9IChRxIyRC7nZQ4A0SEihYM0mBp7AFrmlvtDkOz7huwF3uIe2k0n6iAy+hACeodsxd7mHlfa4lMIQrclB51ww5XnLPWGHCUHR6gfE7Cn3n8xu69M0ESVBfWCcOBx5gL3lsJhQ5ydECfCLXSASfT4ofPtPOoecCEqNv3U7vxqE/yGzOoIS5cW2JbL1PJkMnsilaITJ0LDYOd7CEtKLSNWUUWfn+URdJrmBfrB9pXpGdTzZFjOWWdPUvZ9rl9q8u0ojaKy3pfLIpfCKTTcSqvlKYYkF0XJFTp32fglB3d0t4kNNgU8WQkt+YQiVkLHB4/nUxS6ScoRT0ArsuI7fla0Rka+OY4uUrUk/EKPSTM/qF36WXJD1qLh4sRwsmQYrByiSD6fMDCC1lTEFX9xwAAAAASUVORK5CYII="
                alt="Next.js logo"
                width={16}
                height={20}
              />
              <p>Coin Value: {amountA ? amountA.slice(0, 6) : "0.0"}</p>{" "}
            </div>
            {/* Display the coin value */}
            <div className="text-right">
              ${(+amountA * tokenAInput.price).toFixed(2)}
            </div>
          </div>
        </div>
        <div className="flex justify-center -my-1.5">
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8 rounded-full bg-[#282e3a] swap"
            onClick={clickHandler}
          >
            <ArrowDownUp className="h-4 w-4" />
          </Button>
        </div>
        <div className="p-3 coin-input-text">
          <div className="flex flex-col md:flex-row p-1">
            <div className="md:w-1/2 items-center coin-input-text flex">
              <Dialog>
                <DialogTrigger asChild>
                </DialogTrigger>
                <TokenSelector
                  onSelect={(token) => {
                    setSelectedTokenB(token);
                    // Update tokenBInput if needed
                    setTokenBInput({
                      name: token.tokenName,
                      logo_url: token.logoURI,
                      unit: token.tokenSymbol,
                      price: token.price
                    });
                  }}
                  selectedToken={selectedTokenB}
                  title="Select token to receive"
                />
              </Dialog>
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
                alt="Next.js logo"
                width={16}
                height={16}
              />
              <p>Coin Value: {amountB ? amountB.slice(0, 6) : "0.0"}</p>{" "}
            </div>
            {/* Display the coin value */}
            <div className="text-right">
              ${(+amountB * priceB).toFixed(2)}
            </div>
          </div>
        </div>
        <div className="p-1 text-[#9B9B9B] swap text-xs flex items-center justify-between">
          <div>
            1 {tokenAInput.unit} ={" "}
            {tokenAInput.price && tokenBInput.price ? (tokenAInput.price / tokenBInput.price).toFixed(5) : ""}{" "}
            {tokenBInput.unit}
            <span className="text-[#5e5e5e]"> (${tokenBInput.price.toFixed(2)})</span>
          </div>
          <div className="flex items-center gap-1">
            <Fuel width={14} height={14} />
            <div>0.00025 XION</div>
          </div>
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
            className={`${isConnected && +amountAInput > 0 && "touch"
              } btn-grad h-[54px] w-full flex items-center justify-center`}
          >
            {isConnected ? "Swap" : "Connect Wallet"}
          </Button>
        )}
      </form>
      {isConfirmed && (
        <div className="mt-2 text-white text-xs">
          <h3>Transaction confirmed!</h3>
          <span>
            Hash:{" "}
            <Link
              href={`${explorer_url}/tx/${hash}`}
              className="font-bold"
              target="_blank"
            >
              {hash && truncateAddress(hash)}
            </Link>
          </span>
        </div>
      )}
    </div>
  );
};