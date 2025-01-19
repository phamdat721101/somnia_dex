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
import Image from "next/image";
import { useAccount } from 'wagmi';
import Link from "next/link";
// Mock data for demonstration
const transactions = [
  {
    id: "1",
    type: "Sell",
    tokenFrom: {
      symbol: "MANTA",
      logo_url: "https://s2.coinmarketcap.com/static/img/coins/64x64/13631.png",
    },
    tokenTo: {
      symbol: "ETH",
      logo_url: "https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png",
    },
    amount: "0.5 MANTA",
    amountTo: "750 ETH",
    date: "2023-05-10T14:30:00Z",
    status: "Completed",
  },
  {
    id: "2",
    type: "Buy",
    tokenFrom: {
      symbol: "ETH",
      logo_url: "https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png",
    },
    tokenTo: {
      symbol: "MANTA",
      logo_url: "https://s2.coinmarketcap.com/static/img/coins/64x64/13631.png",
    },
    amount: "100 ETH",
    amountTo: "25 MANTA",
    date: "2023-05-09T10:15:00Z",
    status: "Completed",
  },
  {
    id: "3",
    type: "Sell",
    tokenFrom: {
      symbol: "MANTA",
      logo_url: "https://s2.coinmarketcap.com/static/img/coins/64x64/13631.png",
    },
    tokenTo: {
      symbol: "ETH",
      logo_url: "https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png",
    },
    amount: "2 MANTA",
    amountTo: "100 ETH",
    date: "2023-05-08T18:45:00Z",
    status: "Completed",
  },
];

export default function History() {
  const [filter, setFilter] = useState("all");
  const { address } = useAccount();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const MetisToken = {
    symbol: "XION",
    logo_url: "/xion.png",
  }
  const DGoldToken = {
    symbol: "DGOLD",
    logo_url: "https://s2.coinmarketcap.com/static/img/coins/64x64/5705.png",
  }
  const filteredTransactions = data.filter((tx:any) => {
    if (filter === "all") return true;
    return tx.type.toLowerCase() === filter;
  });



  useEffect(() => {
    const fetchData = async () => {
      const API_URL = `${process.env.NEXT_PUBLIC_BACK_END_ADDRESS}/v1/token/txs?addr=${address}`;
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
    <Card className="p-0 w-full bg-transparent	border-0">
      <CardHeader className="py-4 px-0">
        <CardTitle className="text-2xl font-bold text-gray-50">
          Transaction History
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
              <SelectItem value="buy">Buys</SelectItem>
              <SelectItem value="sell">Sells</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">Export CSV</Button>
        </div>
        <Table className="bg-[#282e3a] rounded-lg">
          <TableHeader>
            <TableRow>
              <TableHead className="text-white">Type</TableHead>
              <TableHead className="text-white">Assets</TableHead>
              {/* <TableHead className="text-white">Amount</TableHead> */}
              <TableHead className="text-white">Date</TableHead>
              <TableHead className="text-white">Status</TableHead>
              <TableHead className="text-right text-white">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTransactions.map((tx: any) => (
              <TableRow key={tx.tx_hash}>
                <TableCell>
                  <Badge variant={tx.type === "sell" ? "secondary" : "default"}>
                    {tx.type === "sell" ? (
                      <ArrowRightLeft className="w-4 h-4 mr-1" />
                    ) : (
                      <Coins className="w-4 h-4 mr-1" />
                    )}
                    {tx.type}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2 text-white">
                    {tx.type === "sell" ? (
                      <>
                        <Avatar className="w-6 h-6">
                          <Image
                            src={DGoldToken.logo_url}
                            alt={DGoldToken.symbol}
                            width={40}
                            height={40}
                          />
                        </Avatar>
                        <span>{DGoldToken.symbol}</span>
                        <ArrowRightLeft className="w-4 h-4" />
                        <Avatar className="w-6 h-6">
                          <Image
                            src={MetisToken.logo_url}
                            alt={MetisToken.symbol}
                            width={40}
                            height={40}
                          />
                        </Avatar>
                        <span>{MetisToken.symbol}</span>
                      </>

                    ) : (
                      <>
                        <Avatar className="w-6 h-6">
                          <Image
                            src={MetisToken.logo_url}
                            alt={MetisToken.symbol}
                            width={40}
                            height={40}
                          />
                        </Avatar>
                        <span>{MetisToken.symbol}</span>
                        <ArrowRightLeft className="w-4 h-4" />
                        <Avatar className="w-6 h-6">
                          <Image
                            src={DGoldToken.logo_url}
                            alt={DGoldToken.symbol}
                            width={40}
                            height={40}
                          />
                        </Avatar>
                        <span>{DGoldToken.symbol}</span>
                      </>
                    )}
                  </div>
                </TableCell>
                {/* <TableCell className="text-white">
                  {tx.amount}
                  <br />
                  <span className="text-sm text-[#9B9B9B]">{tx.amountTo}</span>
                </TableCell> */}
                <TableCell className="text-white">
                  {new Date(tx.timestamp).toLocaleString()}
                </TableCell>
                <TableCell>
                  <Badge
                    variant="default"
                  >
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
                  {/* <Button variant="ghost" size="sm" onClick={ }>
                    <ExternalLink className="w-4 h-4 mr-1" />
                    View
                  </Button> */}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
