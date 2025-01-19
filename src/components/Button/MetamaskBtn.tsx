import { useState, useCallback } from "react";
import { useSDK } from "@metamask/sdk-react";
// import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
// import { Copy, LogOut, ArrowRightFromLine } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/hooks/use-toast";

interface ButtonProps {
  className?: string;
}

const MetamaskWalletButton: React.FC<ButtonProps> = ({ className }) => {
  const [account, setAccount] = useState("");
  const { sdk, connected, connecting } = useSDK();
  const { toast } = useToast();
  //   const router = useRouter();

  const connect = useCallback(async () => {
    try {
      if (!sdk) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "MetaMask SDK not initialized",
        });
        return;
      }

      const accounts = await sdk.connect();
      if (accounts?.[0]) {
        setAccount(accounts[0]);
        toast({
          title: "Success",
          description: "Wallet connected successfully",
        });
      }
    } catch (err) {
      console.error("Failed to connect:", err);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to connect wallet. Please try again.",
      });
    }
  }, [sdk, toast]);

  const disconnect = useCallback(async () => {
    try {
      if (sdk) {
        await sdk.terminate();
        setAccount("");
        toast({
          title: "Success",
          description: "Wallet disconnected successfully",
        });
      }
    } catch (err) {
      console.error("Failed to disconnect:", err);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to disconnect wallet",
      });
    }
  }, [sdk, toast]);

  //   const copyAddress = useCallback(async () => {
  //     if (!account) return;
  //     try {
  //       await navigator.clipboard.writeText(account);
  //       toast({
  //         title: "Success",
  //         description: "Copied wallet address to clipboard",
  //       });
  //     } catch (err) {
  //       toast({
  //         variant: "destructive",
  //         title: "Error",
  //         description: "Failed to copy wallet address",
  //       });
  //     }
  //   }, [account, toast]);

  //   const routerHandler = useCallback(() => {
  //     router.push("/kana");
  //   }, [router]);

  return (
    <div className="relative">
      {connected && account ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              className={`${className} btn-grad touch font-bold`}
              onClick={disconnect}
            >
              {`${account.slice(0, 6)}...${account.slice(-5)}`}
            </Button>
          </DropdownMenuTrigger>
          {/* <DropdownMenuContent align="end">
            <DropdownMenuItem onSelect={routerHandler} className="gap-2">
              <ArrowRightFromLine className="h-4 w-4" /> Kanabot
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={copyAddress} className="gap-2">
              <Copy className="h-4 w-4" /> Copy address
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={disconnect} className="gap-2">
              <LogOut className="h-4 w-4" /> Disconnect
            </DropdownMenuItem>
          </DropdownMenuContent> */}
        </DropdownMenu>
      ) : (
        <Button
          onClick={connect}
          disabled={connecting}
          className={`${className} btn-grad touch font-bold`}
        >
          {connecting ? "Connecting..." : "Connect Wallet"}
        </Button>
      )}
    </div>
  );
};

export default MetamaskWalletButton;
