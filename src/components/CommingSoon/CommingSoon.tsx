'use client'
/* eslint-disable */
import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"


export default function ComingSoonPage() {


  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center text-white p-8 max-w-md w-full">
        <h1 className="text-5xl font-bold mb-4">Coming Soon</h1>
        <p className="text-xl mb-8">We're working hard to bring you something amazing. Stay tuned!</p>
        
        {/* <div className="grid grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Days', value: days },
            { label: 'Hours', value: hours },
            { label: 'Minutes', value: minutes },
            { label: 'Seconds', value: seconds }
          ].map(({ label, value }) => (
            <div key={label} className="bg-white bg-opacity-20 rounded-lg p-3">
              <div className="text-3xl font-bold">{value}</div>
              <div className="text-sm">{label}</div>
            </div>
          ))}
        </div> */}
        
        {/* <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="flex-grow"
          />
          <Button type="submit" className="bg-white text-purple-600 hover:bg-gray-100">
            Notify Me
          </Button>
        </form> */}
      </div>
    </div>
  )
}