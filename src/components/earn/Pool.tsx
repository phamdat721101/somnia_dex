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
import { useAccount } from "wagmi";
import Link from "next/link";

// Mock data for demonstration
const pools = [
  {
    id: 0,
    Token: {
      symbol: "BTC",
      logo_url: "/bitcoin.png",
    },
    TVL: "$1.97M",
    UnboostedAPR: "0%",
    BoostedAPR: "0%",
    YourDeposit: {
      symbol: "BTC",
      logo_url: "/bitcoin.png",
      amount: "$0.00"
    },
    Earned: {
      symbol: "BTC",
      logo_url: "/bitcoin.png",
      amount: "$0.00"
    },
    Action: "Mange",
  }
];

export default function Pool() {
  const [filter, setFilter] = useState("all");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { address } = useAccount();

  const filteredData = data.filter((tx: any) => {
    if (filter === "all") return true;
    return tx.type.toLowerCase() === filter.toLowerCase();
  });

  useEffect(() => {
    console.log(filter);
  }, [filter])

  useEffect(() => {
    const fetchData = async () => {
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
    <Card className="p-0 w-full bg-transparent	border-0">
      <CardHeader className="py-4 px-0">
        <CardTitle className="text-2xl font-bold text-gray-50">
          Stability Pool
        </CardTitle>
      </CardHeader>
      <CardContent className="px-0">
        <Table className="bg-[#282e3a] rounded-lg">
          <TableHeader>
            <TableRow>
              <TableHead className="text-white">Token</TableHead>
              <TableHead className="text-white">TVL</TableHead>
              <TableHead className="text-white">Unboosted APR</TableHead>
              <TableHead className="text-white">Boosted APR</TableHead>
              <TableHead className="text-white">Your deposit</TableHead>
              <TableHead className="text-white">Earned</TableHead>
              <TableHead className="text-white">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pools.map((tx: any) => (
              <TableRow key={tx.id}>
                <TableCell>
                  <div className="flex items-center space-x-2 text-white">
                    <Avatar className="w-6 h-6">
                      <Image
                        src={tx.Token.logo_url}
                        alt={tx.Token.symbol}
                        width={40}
                        height={40}
                      />
                    </Avatar>
                    <span>{tx.Token.symbol}</span>
                  </div>
                </TableCell>
                <TableCell className="text-white">
                  {tx.TVL}
                </TableCell>
                <TableCell className="text-white">
                  {tx.UnboostedAPR}
                </TableCell>
                <TableCell className="text-white">
                  {tx.BoostedAPR}
                </TableCell>
                <TableCell className="text-white">
                  <div className="flex items-center space-x-2 text-white">
                    <Avatar className="w-6 h-6">
                      <Image
                        src={tx.YourDeposit.logo_url}
                        alt={tx.YourDeposit.symbol}
                        width={40}
                        height={40}
                      />
                    </Avatar>
                    <span>{tx.YourDeposit.amount}</span>
                  </div>
                </TableCell>
                <TableCell className="text-white">
                  <div className="flex items-center space-x-2 text-white">
                    <Avatar className="w-6 h-6">
                      <Image
                        src={tx.Earned.logo_url}
                        alt={tx.Earned.symbol}
                        width={40}
                        height={40}
                      />
                    </Avatar>
                    <span>{tx.Earned.amount}</span>
                  </div>
                </TableCell>
                <TableCell className="text-right text-white">
                  <Link
                    href="/stake"
                  >
                    <Button variant="ghost" size="sm">
                      <ExternalLink className="w-4 h-4 mr-1" />
                      {tx.Action}
                    </Button>
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
