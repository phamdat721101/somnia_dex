'use client'
/* eslint-disable */
import { ArrowUpRight, ChevronDown } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Image from "next/image"
import Link from "next/link"
import Pool from './Pool'

export default function EarnComponent() {
  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-6xl">
        <div className="space-y-6 p-6">
          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="relative p-4 bg-[#2B2B31] border rounded-lg border-[#FF8100]">
              {/* See More link positioned absolutely in top right */}
              <div className="absolute top-4 right-4">
                <a
                  href="#"
                  className="text-sm text-gray-400 hover:text-white flex items-center gap-1"
                >
                  See More <ArrowUpRight className="w-4 h-4" />
                </a>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <div className="text-sm mb-2 text-gray-400">TVL</div>
                  <div className="text-3xl font-bold text-white">$1.9M</div>
                </div>
                <div>
                  <div className="text-sm mb-2 text-gray-400">APR</div>
                  <div className="text-3xl font-bold text-white">0%</div>
                </div>
              </div>
            </div>
            <Card className="bg-[#2B2B31] border-[#FF8100]">
              <div className="grid grid-cols-2 gap-8 mx-4 my-4">
                <div>
                  <div className="text-sm mb-2 text-gray-400">USBD Balance</div>
                  <div className="text-3xl font-bold text-white">0</div>
                </div>
                <div>
                  <div className="text-sm mb-2 text-gray-400">Your Deposit</div>
                  <div className="text-3xl font-bold text-white">$0.0</div>
                </div>
              </div>
            </Card>
          </div>

          {/* Pool Table */}
          <Pool />
        </div>
      </div>
    </div>
  )
}
