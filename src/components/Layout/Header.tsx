'use client'
/* eslint-disable */
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { ChevronDown, Menu, Wallet } from 'lucide-react'
import Image from "next/image"
import { usePathname } from "next/navigation"
import { useWeb3Modal } from '@web3modal/wagmi/react'
import { useAccount, useDisconnect } from 'wagmi';

export function Header() {
  const pathname = usePathname()
  const { open } = useWeb3Modal();
  const { disconnect } = useDisconnect();
  const { address, isConnected } = useAccount();

  const navigation = [
    { name: "Mint", href: "/" },
    { name: "Stake", href: "/stake" },
    // { name: "Withdraw", href: "/withdraw" },
    { name: "Rewards", href: "/rewards" },
    { name: "Ecosystem", href: "/ecosystem" },
    { name: "Earn", href: "/earn" },
  ]

  const earnMenuItems = [
    { name: "Staking", href: "/earn/staking" },
    { name: "Farming", href: "/earn/farming" },
    { name: "Pools", href: "/earn/pools" },
  ]

  const disconectWallet = () => {
    disconnect();
  }

  return (
    <header className="sticky top-0 z-50 bg-[#1B1C1E]">
      <div className="container flex items-center h-14 px-4 text-white justify-between">
        {/* Left Side: Navigation and Logo */}
        <div className="flex items-center">
          <Sheet>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="icon" className="mr-2 text-gray-200 hover:bg-gray-800">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="bg-[#1a1b1e] text-gray-200">
              <SheetHeader>
                <SheetTitle className="text-gray-200">
                  <div className="flex items-center space-x-2">
                    <Image
                      src="/leofi_logo.png"
                      alt="Logo"
                      width={128}
                      height={64}
                      className="h-16 w-auto"
                    />
                  </div>
                </SheetTitle>
              </SheetHeader>
              <nav className="mt-8 flex flex-col space-y-4">
                {navigation.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`text-base ${pathname === item.href
                      ? "text-white font-medium"
                      : "text-gray-400 hover:text-white"
                      }`}
                  >
                    {item.name}
                  </Link>
                ))}
                <div className="space-y-4 py-2">
                  <p className="text-base font-medium text-white">Earn</p>
                  {earnMenuItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="block pl-4 text-base text-gray-400 hover:text-white"
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              </nav>
            </SheetContent>
          </Sheet>
          <Link href="/" className="flex items-center">
            <Image
              src="/leofi_logo.png"
              alt="Logo"
              width={128}
              height={64}
              className="h-18 w-auto"
            />
          </Link>
        </div>

        {/* Center: Navigation for larger screens */}
        <nav className="hidden lg:flex space-x-12">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`text-sm font-medium transition-colors hover:text-white relative ${pathname === item.href
                ? "text-white after:absolute after:bottom-[-16px] after:left-0 after:h-[2px] after:w-full after:bg-[#f09819]"
                : "text-gray-400"
                }`}
            >
              {item.name}
            </Link>
          ))}

          {/* <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center space-x-1 text-sm font-medium text-gray-400 hover:text-white">
              <span>Earn</span>
              <ChevronDown className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center" className="bg-[#1a1b1e] border-gray-800">
              {earnMenuItems.map((item) => (
                <DropdownMenuItem key={item.href} asChild className="text-gray-400 hover:text-white hover:bg-gray-800">
                  <Link href={item.href}>{item.name}</Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu> */}
        </nav>

        {/* Right Side: Wallet Connection */}
        <div className="flex items-end">
          {isConnected ? (
            <div className="flex items-center space-x-2">
              <Wallet className="w-5 h-5" />
              <span className="text-sm">{`${address?.slice(0, 6)}...${address?.slice(-4)}`}</span>
              <button
                onClick={disconectWallet}
                className="btn-grad px-2 py-1 rounded text-sm"
              >
                Disconnect
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <button
                onClick={() => open()}
                className="btn-grad px-3 py-2 rounded flex items-center space-x-2 text-sm"
              >
                <Wallet className="w-4 h-4" />
                <span>Connect Wallet</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header;