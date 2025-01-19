import { ConnectKitButton } from "connectkit";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut } from "lucide-react";
import { useDisconnect } from "wagmi";

interface ButtonProps {
  className?: string;
}

export const WalletButton: React.FC<ButtonProps> = ({ className }) => {
  const { disconnect } = useDisconnect();

  return (
    <ConnectKitButton.Custom>
      {({ isConnected, isConnecting, show, address }) => {
        return (
          <div className="relative">
            {isConnected && address ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    className={`${className} btn-grad touch font-bold tracking-wide`}
                  >
                    {`${address.slice(0, 6)}...${address.slice(-5)}`}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onSelect={() => disconnect()}
                    className="gap-2"
                  >
                    <LogOut className="h-4 w-4" /> Disconnect
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                onClick={show}
                disabled={isConnecting}
                className={`${className} btn-grad touch font-bold tracking-wide`}
              >
                {isConnecting ? "Connecting..." : "Connect Wallet"}
              </Button>
            )}
          </div>
        );
      }}
    </ConnectKitButton.Custom>
  );
};
