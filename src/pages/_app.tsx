import type { AppProps } from 'next/app'
import Layout from '@/components/Layout/Layout'
import 'tailwindcss/tailwind.css'
import Web3ModalProvider from '@/context'
import { Toaster } from "@/components/ui/toaster";
import '../styles/globals.css';
export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Web3ModalProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
        <Toaster />
      </Web3ModalProvider>
    </>

  )
}