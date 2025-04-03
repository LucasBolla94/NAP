'use client';

import { useEffect, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { Connection, PublicKey } from '@solana/web3.js';
import { getAssociatedTokenAddress, getAccount } from '@solana/spl-token';
import { useRouter } from 'next/navigation';
import ClientOnly from '../components/ClientOnly';

const MINT = new PublicKey("4qoK3wdGaEqVBbTzJVztCKCPc35Cz11XzbvUx2TGpump");
const RPC = "https://newest-misty-darkness.solana-mainnet.quiknode.pro/af6310c5314f899ae52cbc545812bd8903835b23/";

export default function Home() {
  const wallet = useWallet();
  const router = useRouter();
  const [hasToken, setHasToken] = useState(false);

  useEffect(() => {
    const checkToken = async () => {
      if (!wallet.publicKey) return;

      const connection = new Connection(RPC);
      const ata = await getAssociatedTokenAddress(MINT, wallet.publicKey);

      try {
        const account = await getAccount(connection, ata);
        if (account.amount > 0n) {
          setHasToken(true);
        } else {
          setHasToken(false);
        }
      } catch {
        setHasToken(false);
      }
    };

    checkToken();
  }, [wallet.publicKey]);

  return (
    <main
      className="h-screen w-screen bg-cover bg-center flex items-center justify-center"
      style={{ backgroundImage: "url('/bg.png')" }}
    >
      <div className="bg-white/70 rounded-2xl p-6 text-center max-w-md shadow-xl">
        <h1 className="text-3xl font-bold mb-4">🚀 Meme Coin - Solana</h1>
        <p className="mb-4">
          A project to send your coin to the moon 🌕 with staking, rewards, and an insane community.
        </p>

        <div className="mb-4">
          <ClientOnly>
            <WalletMultiButton />
          </ClientOnly>
        </div>

        <a
          href="https://jup.ag/swap/SOL-4qoK3wdGaEqVBbTzJVztCKCPc35Cz11XzbvUx2TGpump"
          target="_blank"
          rel="noopener noreferrer"
        >
          <button className="bg-green-600 text-white px-4 py-2 rounded-full hover:bg-green-700 mb-4">
            Buy
          </button>
        </a>

        {wallet.connected && hasToken && (
          <button
            onClick={() => router.push('/member')}
            className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700"
          >
            Enter Member Area
          </button>
        )}
      </div>
    </main>
  );
}
