'use client'
/* eslint-disable */
import { useEffect, useState } from "react";
import { ArrowRightLeft, Coins, ExternalLink } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import { useAccount } from "wagmi";
import Link from "next/link";

const EmptyState = () => (
  <div className="flex flex-col items-center justify-center py-12 text-center">
    <div className="text-gray-400 mb-4">
      <ArrowRightLeft className="w-12 h-12 mx-auto mb-4 opacity-50" />
      <p className="text-lg">No transactions found</p>
      <p className="text-sm">Your staking history will appear here</p>
    </div>
  </div>
);

const TableSkeleton = () => (
  <>
    {[...Array(6)].map((_, index) => (
      <TableRow key={index}>
        <TableCell>
          <Skeleton className="h-8 w-20 bg-gray-200" />
        </TableCell>
        <TableCell>
          <div className="flex items-center space-x-4">
            <Skeleton className="h-6 w-6 rounded-full bg-gray-200" />
            <Skeleton className="h-4 w-16 bg-gray-200" />
            <Skeleton className="h-4 w-4 bg-gray-200" />
            <Skeleton className="h-6 w-6 rounded-full bg-gray-200" />
            <Skeleton className="h-4 w-16 bg-gray-200" />
          </div>
        </TableCell>
        <TableCell>
          <Skeleton className="h-4 w-32 bg-gray-200" />
        </TableCell>
        <TableCell>
          <Skeleton className="h-6 w-20 bg-gray-200" />
        </TableCell>
        <TableCell className="text-right">
          <Skeleton className="h-8 w-16 ml-auto bg-gray-200" />
        </TableCell>
      </TableRow>
    ))}
  </>
);

export default function History() {
  const [filter, setFilter] = useState("all");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { address } = useAccount();

  const filteredData = data.filter((tx:any) => {
    if (filter === "all") return true;
    return tx.type.toLowerCase() === filter.toLowerCase();
  });

  const StakeToken = {
    symbol: process.env.NEXT_PUBLIC_STAKE_TOKEN_NAME as string,
    logo_url: "https://s2.coinmarketcap.com/static/img/coins/64x64/5705.png",
  };

  const Token = {
    symbol: process.env.NEXT_PUBLIC_TOKEN_NAME as string,
    logo_url: "https://s2.coinmarketcap.com/static/img/coins/64x64/5705.png",
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!address) {
        setLoading(false);
        setData([]);
        return;
      }

      setLoading(true);
      const API_URL = `${process.env.NEXT_PUBLIC_BACK_END_ADDRESS}/v1/token/stake_tx?addr=${address}`;
      try {
        const res = await fetch(API_URL);
        if (!res.ok) {
          throw new Error(`Failed to fetch: ${res.status}`);
        }
        const result = await res.json();
        setData(result);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [address]);

  return (
    <Card className="p-0 w-full bg-transparent border-0">
      <CardHeader className="py-4 px-0">
        <CardTitle className="text-2xl font-bold text-gray-50">
          Stake History
        </CardTitle>
      </CardHeader>
      <CardContent className="px-0">
        <div className="flex justify-between items-center mb-5">
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter transactions" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Transactions</SelectItem>
              <SelectItem value="stake">Stake</SelectItem>
              <SelectItem value="unstake">UnStake</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">Export CSV</Button>
        </div>
        <div className="rounded-lg bg-[#282e3a]">
          <div className="flex flex-col">
            <div className="border-b border-gray-700">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-white bg-[#282e3a]">Type</TableHead>
                    <TableHead className="text-white bg-[#282e3a]">Assets</TableHead>
                    <TableHead className="text-white bg-[#282e3a]">Date</TableHead>
                    <TableHead className="text-white bg-[#282e3a]">Status</TableHead>
                    <TableHead className="text-right text-white bg-[#282e3a]">Action</TableHead>
                  </TableRow>
                </TableHeader>
              </Table>
            </div>
            <div className="max-h-[500px] overflow-y-auto scrollbar-hide">
              <Table>
                <TableBody>
                  {loading ? (
                    <TableSkeleton />
                  ) : !address ? (
                    <TableRow>
                      <TableCell colSpan={5}>
                        <EmptyState />
                      </TableCell>
                    </TableRow>
                  ) : filteredData.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5}>
                        <EmptyState />
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredData.map((tx: any) => (
                      <TableRow key={tx.id}>
                        <TableCell>
                          <Badge variant={tx.type === "unstake" ? "secondary" : "default"}>
                            {tx.type === "unstake" ? (
                              <ArrowRightLeft className="w-4 h-4 mr-1" />
                            ) : (
                              <Coins className="w-4 h-4 mr-1" />
                            )}
                            {tx.type}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2 text-white">
                            {tx.type == "stake" ? (
                              <>
                                <Avatar className="w-6 h-6">
                                  <Image src={Token.logo_url} alt={Token.symbol} width={40} height={40} />
                                </Avatar>
                                <span>{Token.symbol}</span>
                                <ArrowRightLeft className="w-4 h-4" />
                                <Avatar className="w-6 h-6">
                                  <Image src={StakeToken.logo_url} alt={StakeToken.symbol} width={40} height={40} />
                                </Avatar>
                                <span>{StakeToken.symbol}</span>
                              </>
                            ) : (
                              <>
                                <Avatar className="w-6 h-6">
                                  <Image src={StakeToken.logo_url} alt={StakeToken.symbol} width={40} height={40} />
                                </Avatar>
                                <span>{StakeToken.symbol}</span>
                                <ArrowRightLeft className="w-4 h-4" />
                                <Avatar className="w-6 h-6">
                                  <Image src={Token.logo_url} alt={Token.symbol} width={40} height={40} />
                                </Avatar>
                                <span>{Token.symbol}</span>
                              </>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-white">
                          {new Date(tx.timestamp).toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <Badge variant="default">
                            Completed
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right text-white">
                          <Link
                            href={`https://sepolia-explorer.metisdevops.link/tx/${tx.tx_hash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Button variant="ghost" size="sm">
                              <ExternalLink className="w-4 h-4 mr-1" />
                              View
                            </Button>
                          </Link>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
        <style jsx global>{`
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
          .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `}</style>
      </CardContent>
    </Card>
  );
}