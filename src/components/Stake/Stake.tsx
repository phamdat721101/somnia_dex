'use client'
/* eslint-disable */
import { useEffect, useRef, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import UpDownIcon from "@/assets/icon/UpDownIcon"
import { useWeb3Modal } from '@web3modal/wagmi/react'
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useReadContract } from 'wagmi';
import Image from "next/image"
import { stake_abi } from '@/abi/stake_abi'
import { abi } from '@/abi/abi'
import { parseEther } from "viem"
import { Loader2 } from "lucide-react"
import Link from "next/link"

export default function StakeCard() {
  const [activeTab, setActiveTab] = useState("Stake")
  const { open } = useWeb3Modal();
  const { isConnected, address } = useAccount();
  const [amountAInput, setAmountAInput] = useState("");
  const [amountBInput, setAmountBInput] = useState("");
  const [tokenA, setTokenA] = useState(process.env.NEXT_PUBLIC_TOKEN_NAME);
  const [tokenB, setTokenB] = useState(process.env.NEXT_PUBLIC_STAKE_TOKEN_NAME);
  const amountAInputRef = useRef<HTMLInputElement>(null);
  const [maxGold, setMaxGold] = useState(0)
  const stake_contract = process.env.NEXT_PUBLIC_STAKE_CONTRACT as `0x${string}` ?? "0x42a2F4e5389F6e7466D97408724Dba38812f184E"
  const gold_contract = process.env.NEXT_PUBLIC_XAU_CONTRACT as `0x${string}` ?? "0xd4c4d35Af5b77F0f66e80e507cFbCC23240bDb32"

  const changeActiveTab = () => {
    if (activeTab == "Stake") {
      setActiveTab("Unstake");
      setTokenA(process.env.NEXT_PUBLIC_STAKE_TOKEN_NAME);
      setTokenB(process.env.NEXT_PUBLIC_TOKEN_NAME);
    }
    else {
      setActiveTab("Stake");
      setTokenA(process.env.NEXT_PUBLIC_TOKEN_NAME);
      setTokenB(process.env.NEXT_PUBLIC_STAKE_TOKEN_NAME);
    }
  }

  useEffect(() => {
    if (activeTab == "Unstake") {
      setTokenA(process.env.NEXT_PUBLIC_STAKE_TOKEN_NAME);
      setTokenB(process.env.NEXT_PUBLIC_TOKEN_NAME);
    }
    else {
      setTokenA(process.env.NEXT_PUBLIC_TOKEN_NAME);
      setTokenB(process.env.NEXT_PUBLIC_STAKE_TOKEN_NAME);
    }
  },[activeTab])

  const { writeContract, isPending, data: hash } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  const balanceOf = useReadContract({
    abi: abi,
    address: gold_contract,
    functionName: "balanceOf",
    args: [address || "0x0"],
  });

  const calculateReward = useReadContract({
    abi: stake_abi,
    address: stake_contract,
    functionName: "calculateReward",
    args: [address || "0x0"],
  });

  function truncateAddress(address: string) {
    return `${address.slice(0, 6)}...${address.slice(-6)}`;
  }

  useEffect(() => {
    setTokenA(process.env.NEXT_PUBLIC_TOKEN_NAME);
    setTokenB(process.env.NEXT_PUBLIC_STAKE_TOKEN_NAME);
  }, [])


  useEffect(() => {
    console.log("address:", address);
    console.log("balanceOf:", balanceOf);
    console.log("calculateReward:", calculateReward);
    setMaxGold(parseFloat(balanceOf?.data?.toString() ?? "0") / (10 ** 18));
  }, [address, balanceOf])

  const handleStake = async () => {
    try {
      writeContract({
        abi: abi,
        address: gold_contract,
        functionName: "approve",
        args: [stake_contract, BigInt(1000000000000000000000000000000000000000000000)]
      });
    } catch (error) {
      console.error("Approve failed: ", error)
    }
    try {
      if (activeTab == "Stake") {
        writeContract({
          abi: stake_abi,
          address: stake_contract,
          functionName: "stake",
          args: [parseEther(amountAInput)]
        });
      }
      else {
        writeContract({
          abi: stake_abi,
          address: stake_contract,
          functionName: "unstake",
          args: [parseEther(amountAInput)]
        });
      }

    } catch (error) {
      console.error('Stake failed:', error);
    }
  };

  const amountInputAChange = () => {
    const numericValue = amountAInputRef.current?.value;

    if (numericValue && +numericValue > 0) {
      setAmountAInput(numericValue);
      setAmountBInput(numericValue);
    } else {
      setAmountAInput("");
      setAmountBInput("");
    }
  };

  return (
    <div className="flex items-center justify-center">
      <div className="w-full max-w-md">
        <h1 className="text-4xl font-bold text-center text-white mb-8">{activeTab}</h1>

        <Tabs defaultValue="Stake" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full bg-[#1C1D1F] rounded-3xl border-[1px] border-[#FF8100]">
            <TabsTrigger
              value="Stake"
              className="w-full rounded-3xl border-gray-900 data-[state=active]:border-2 data-[state=active]:text-white data-[state=active]:bg-gradient-to-l data-[state=active]:from-[#f09819] data-[state=active]:to-[#ff512f]"
            >
              Stake
            </TabsTrigger>
            <TabsTrigger
              value="Unstake"
              className="w-full rounded-3xl border-gray-900 data-[state=active]:border-2 data-[state=active]:text-white data-[state=active]:bg-gradient-to-l data-[state=active]:from-[#f09819] data-[state=active]:to-[#ff512f]"
            >
              Unstake
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="container col-span-1 md:col-span-2 rounded-xl shadow-sm">
          <div className="boxed">
            <div className="w-full mx-0.25 my-0.25 text-white">
              <Card className="bg-[#171C23] border-[#171C23] rounded-2xl">
                <CardContent className="p-6 space-y-6 bg-[#171C23] rounded-xl">
                  <div className="space-y-4">
                    <div className="relative h-20">
                      <Input
                        type="text"
                        placeholder="0.0000"
                        className="coin-swap h-20"
                        onChange={amountInputAChange}
                        ref={amountAInputRef}
                      />
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        <Button variant="secondary" className="bg-gray-700 hover:bg-gray-600 text-white">
                          {tokenA}
                        </Button>
                      </div>
                      <div className="absolute right-3 top-14 mt-1 text-sm text-gray-400">
                        Max: {maxGold}
                      </div>
                    </div>

                    <div className="flex justify-center">
                      <div className="bg-[#1C1D1F] p-2 rounded-md" onClick={changeActiveTab}>
                        <UpDownIcon />
                      </div>
                    </div>

                    <div className="relative">
                      <Input
                        type="text"
                        placeholder="0.00"
                        className="coin-swap h-16"
                        value={amountBInput}
                        readOnly={true}
                      />
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        <Button variant="secondary" className="bg-gray-700 hover:bg-gray-600 text-white">
                          {tokenB}
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between text-gray-400">
                      <span>You will receive</span>
                      <span className="flex items-center gap-2">
                        <Image
                          className="dark:invert rounded-full"
                          src="https://s2.coinmarketcap.com/static/img/coins/64x64/5705.png"
                          alt="Next.js logo"
                          width={32}
                          height={32}
                        />
                        {amountAInput} {tokenB}
                      </span>
                    </div>
                    <div className="flex justify-between text-gray-400">
                      <span>Your {tokenA} balance</span>
                      <span>{100 + amountAInput} {tokenA}</span>
                    </div>
                    <div className="flex justify-between text-gray-400">
                      <span>Your {tokenB} balance</span>
                      <span>{50 + amountAInput} {tokenB}</span>
                    </div>
                    <div className="flex justify-between text-gray-400">
                      <span>Your share of the pool</span>
                      <span>0.0000025%</span>
                    </div>
                  </div>
                  {
                    !isConnected && (
                      <Button className="w-full btn-grad h-12" onClick={() => open()}>
                        Connect Wallet
                      </Button>
                    )
                  }
                  {
                    isConnected && (
                      // <Button className="w-full btn-grad h-12" onClick={() => handleStake()}>
                      //   {isPending ? (activeTab == "Stake" ? "Staking..." : "Unstaking...") : activeTab}
                      // </Button>

                      isPending ? (
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
                          onClick={() => handleStake()}
                          disabled={!isConnected}
                          className={`${isConnected && +amountAInput > 0 && "touch"
                            } btn-grad h-[54px] w-full flex items-center justify-center`}
                        >
                          {isConnected ? activeTab : "Connect Wallet"}
                        </Button>
                      )
                    )
                  }
                  {isConfirmed && (
                    <div className="mt-2 text-white text-xs">
                      <h3>Transaction confirmed!</h3>
                      <span>
                        Hash:{" "}
                        <Link
                          href={`https://sepolia-explorer.metisdevops.link/tx/${hash}`}
                          className="font-bold"
                          target="_blank"
                        >
                          {hash && truncateAddress(hash)}
                        </Link>
                      </span>
                    </div>
                  )}

                </CardContent>
              </Card>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

