'use client';

import { useEffect, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { Connection, PublicKey } from '@solana/web3.js';
import { getAssociatedTokenAddress, getAccount, getMint } from '@solana/spl-token';
import { useRouter } from 'next/navigation';
import ClientOnly from '../components/ClientOnly';

const MINT = new PublicKey("4qoK3wdGaEqVBbTzJVztCKCPc35Cz11XzbvUx2TGpump");
const RPC = "https://newest-misty-darkness.solana-mainnet.quiknode.pro/af6310c5314f899ae52cbc545812bd8903835b23/";

export default function Home() {
  const wallet = useWallet();
  const router = useRouter();

  const [balance, setBalance] = useState<bigint>(0n);
  const [decimals, setDecimals] = useState<number>(6); // valor padrão
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const checkTokenBalance = async () => {
      if (!wallet.publicKey) return;

      setLoading(true);
      const connection = new Connection(RPC);
      const ata = await getAssociatedTokenAddress(MINT, wallet.publicKey);

      try {
        const account = await getAccount(connection, ata);
        const mintInfo = await getMint(connection, MINT);

        setBalance(account.amount);
        setDecimals(mintInfo.decimals);
      } catch (err) {
        console.error("Erro ao buscar balance:", err);
        setBalance(0n);
      } finally {
        setLoading(false);
      }
    };

    if (wallet.connected) {
      checkTokenBalance();
    }
  }, [wallet.publicKey, wallet.connected]);

  const formattedBalance = Number(balance) / Math.pow(10, decimals);
  const hasOneMillion = balance >= BigInt(1_000_000 * Math.pow(10, decimals));

  return (
    <main
      className="h-screen w-screen bg-cover bg-center flex items-center justify-center"
      style={{ backgroundImage: "url('/bg.png')" }}
    >
      <div className="bg-black/70 rounded-3xl p-8 text-center max-w-xl shadow-2xl border border-white/20">
        <h1 className="text-4xl font-extrabold text-white mb-4 drop-shadow">🚀 NapReserv - Solana</h1>
        <p className="mb-6 text-white text-lg">
          We were tired of watching our money lose value while politicians played games with our future. So, a group of friends came together and launched $NAP — a meme coin with real goals.<br /><br />
          $NAP is built to be fun, but it’s also designed to reward holders with dividends and create a community-powered network where anyone can grow their value. No central banks, no hidden tricks — just vibes, rewards, and transparency.<br /><br />
          Want the full story? Hit that WhitePaper button and dive in.
        </p>

        <div className="mb-6 transition-transform hover:scale-105">
          <ClientOnly>
            <WalletMultiButton className="!bg-indigo-600 hover:!bg-indigo-700 text-white px-6 py-3 rounded-full shadow-lg transition-all duration-300 ease-in-out" />
          </ClientOnly>
        </div>

        <a
          href="https://jup.ag/swap/SOL-4qoK3wdGaEqVBbTzJVztCKCPc35Cz11XzbvUx2TGpump"
          target="_blank"
          rel="noopener noreferrer"
        >
          <button className="bg-green-600 text-white px-6 py-3 rounded-full hover:bg-green-700 w-full mb-4 transition-all duration-300 ease-in-out shadow-lg hover:scale-105">
            🛒 Buy Now on Jupiter
          </button>
        </a>

        <a href="/whitepaper/">
          <button className="bg-white text-black font-semibold px-6 py-3 rounded-full hover:bg-gray-200 w-full mb-4 transition-all duration-300 ease-in-out shadow-lg hover:scale-105">
            📄 WhitePaper
          </button>
        </a>

        {wallet.connected && !loading && (
          <>
            <div className="text-white text-sm mb-2">
              Your $NAP balance: {formattedBalance.toLocaleString()} $NAP
            </div>

            {hasOneMillion ? (
              <button
                onClick={() => router.push('/member')}
                className="bg-blue-600 text-white px-6 py-3 rounded-full hover:bg-blue-700 w-full transition-all duration-300 ease-in-out shadow-lg hover:scale-105"
              >
                🔐 Enter Member Area
              </button>
            ) : (
              <p className="text-yellow-300 mt-4 font-semibold">
                🔒 Member Area - 1M $NAP minimum
              </p>
            )}
          </>
        )}
      </div>
    </main>
  );
}
