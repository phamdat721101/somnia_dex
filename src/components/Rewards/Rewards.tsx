'use client'
/* eslint-disable */
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { createClient } from '@supabase/supabase-js';
import toast, { Toaster } from 'react-hot-toast';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const Rewards = () => {
  const [email, setEmail] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);

  const nfts = [
    {
      id: 1,
      name: "Leo Genesis",
      image: "/nft1.svg",
      lpRequired: "1000 LP",
      description: "The legendary first Leo NFT for top stakers"
    },
    {
      id: 2,
      name: "Leo Guardian",
      image: "/nft2.svg",
      lpRequired: "2000 LP",
      description: "Protector of the Leo ecosystem"
    },
    {
      id: 3,
      name: "Leo Master",
      image: "/nft3.svg",
      lpRequired: "5000 LP",
      description: "Ultimate Leo staking achievement"
    }
  ];

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error('Please enter your email');
      return;
    }

    setIsRegistering(true);
    try {
      const { error } = await supabase
        .from('stakers')
        .insert([{ email }]);

      if (error) throw error;
      
      toast.success('Successfully registered! Check your email for updates.');
      setEmail('');
    } catch (error) {
      toast.error('Registration failed. Please try again.');
      console.error('Error:', error);
    } finally {
      setIsRegistering(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 via-gray-900 to-black text-white p-8">
      <Toaster position="top-right" />
      <div className="max-w-6xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-500">
            Leo NFT Rewards
          </h1>
          <p className="text-xl text-gray-300">
            Exclusive NFTs for Leo's top stakers
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {nfts.map((nft, index) => (
            <motion.div
              key={nft.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gray-800 rounded-xl overflow-hidden hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-300"
              whileHover={{ scale: 1.05 }}
            >
              <div className="relative group">
                <img 
                  src={nft.image} 
                  alt={nft.name}
                  className="w-full h-64 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-purple-900/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                  <p className="text-white">{nft.description}</p>
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-2xl font-bold mb-2">{nft.name}</h3>
                <p className="text-purple-400 mb-4">{nft.lpRequired}</p>
                
                <div className="text-sm text-gray-400 mt-2">
                  Stake {nft.lpRequired} to qualify
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="max-w-md mx-auto bg-gray-800/50 p-8 rounded-xl backdrop-blur-sm"
        >
          <h2 className="text-2xl font-bold mb-4 text-center">Register for Updates</h2>
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white"
                placeholder="Enter your email"
                required
              />
            </div>
            <button
              type="submit"
              disabled={isRegistering}
              className="w-full py-3 px-6 bg-gradient-to-r from-pink-500 to-purple-500 rounded-lg font-bold hover:from-pink-600 hover:to-purple-600 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isRegistering ? 'Registering...' : 'Register Now'}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default Rewards;