'use client';

import { useEffect, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Connection, PublicKey } from '@solana/web3.js';
import { getAssociatedTokenAddress, getAccount } from '@solana/spl-token';
import { useRouter } from 'next/navigation';
import { doc, getDocs, setDoc, collection, addDoc, QueryDocumentSnapshot, DocumentData } from 'firebase/firestore';
import { db } from '@/app/lib/firebase';

const MINT = new PublicKey('4qoK3wdGaEqVBbTzJVztCKCPc35Cz11XzbvUx2TGpump');
const RPC = 'https://newest-misty-darkness.solana-mainnet.quiknode.pro/af6310c5314f899ae52cbc545812bd8903835b23/';

type Poll = {
  id: string;
  question: string;
  active: boolean;
  results?: {
    yes: number;
    no: number;
  };
};

export default function MemberDashboard() {
  const wallet = useWallet();
  const router = useRouter();
  const [hasToken, setHasToken] = useState(false);
  const [tokenAmount, setTokenAmount] = useState(0);
  const [polls, setPolls] = useState<Poll[]>([]);
  const [question, setQuestion] = useState('');

  useEffect(() => {
    const checkToken = async () => {
      if (!wallet.publicKey) return;
      const connection = new Connection(RPC);
      const ata = await getAssociatedTokenAddress(MINT, wallet.publicKey);
      try {
        const account = await getAccount(connection, ata);
        const amount = Number(account.amount);
        setTokenAmount(amount);
        setHasToken(amount >= 100_000_000_000);
        if (amount < 100_000_000_000) router.push('/');
      } catch {
        router.push('/');
      }
    };
    checkToken();
  }, [wallet.publicKey, router]);

  useEffect(() => {
    const fetchPolls = async () => {
      const snapshot = await getDocs(collection(db, 'polls'));
      const data: Poll[] = snapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => ({
        id: doc.id,
        ...doc.data(),
      })) as Poll[];
      setPolls(data);
    };
    fetchPolls();
  }, []);

  const handleVote = async (pollId: string, answer: string) => {
    if (!wallet.publicKey || tokenAmount < 100_000_000_000) return;
    const voteRef = doc(db, 'polls', pollId, 'votes', wallet.publicKey.toBase58());
    await setDoc(voteRef, { answer });
  };

  const handleCreatePoll = async () => {
    if (question.trim() === '') return;
    await addDoc(collection(db, 'polls'), {
      question,
      active: true,
      results: { yes: 0, no: 0 },
    });
    setQuestion('');
    alert('Poll created successfully!');
  };

  if (!hasToken) return null;

  return (
    <main className="min-h-screen bg-cover bg-center text-white p-8" style={{ backgroundImage: "url('/bg2.png')" }}>
      <div className="max-w-5xl mx-auto space-y-12">
        <h1 className="text-5xl font-extrabold text-center drop-shadow-lg">🧠 Koala DAO Dashboard</h1>

        <section className="bg-white/10 backdrop-blur-md p-6 rounded-2xl shadow-xl">
          <h2 className="text-3xl font-semibold mb-2">🐨 NFT of the Week</h2>
          <p className="text-lg">Claim your exclusive NFT (coming soon...)</p>
        </section>

        <section className="bg-white/10 backdrop-blur-md p-6 rounded-2xl shadow-xl">
          <h2 className="text-3xl font-semibold mb-4">🗳️ Active Polls</h2>
          {polls.filter(p => p.active).length === 0 && <p className="text-lg">No active polls available.</p>}
          {polls.filter(p => p.active).map(poll => (
            <div key={poll.id} className="mb-6 p-4 bg-white/5 rounded-xl">
              <p className="text-xl font-medium mb-2">{poll.question}</p>
              {tokenAmount >= 100_000_000_000 ? (
                <div className="flex gap-4">
                  <button onClick={() => handleVote(poll.id, 'yes')} className="bg-green-600 px-4 py-2 rounded-xl hover:bg-green-700">Yes</button>
                  <button onClick={() => handleVote(poll.id, 'no')} className="bg-red-600 px-4 py-2 rounded-xl hover:bg-red-700">No</button>
                </div>
              ) : (
                <p className="text-yellow-300">You need at least 100,000 tokens to vote.</p>
              )}
            </div>
          ))}
        </section>

        <section className="bg-white/10 backdrop-blur-md p-6 rounded-2xl shadow-xl">
          <h2 className="text-3xl font-semibold mb-4">📊 Closed Polls</h2>
          {polls.filter(p => !p.active).map(poll => (
            <div key={poll.id} className="mb-4">
              <p className="text-lg font-medium mb-1">{poll.question}</p>
              <p>✅ Yes: {poll.results?.yes || 0}%</p>
              <p>❌ No: {poll.results?.no || 0}%</p>
            </div>
          ))}
        </section>

        {tokenAmount >= 3_000_000_000_000 && (
          <section className="bg-white/10 backdrop-blur-md p-6 rounded-2xl shadow-xl">
            <h2 className="text-3xl font-semibold mb-4">➕ Create a New Poll</h2>
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Enter your poll question..."
              className="w-full p-3 rounded mb-4 text-black"
            />
            <button onClick={handleCreatePoll} className="bg-blue-600 px-6 py-3 rounded-full hover:bg-blue-700">Create</button>
          </section>
        )}

        {tokenAmount < 3_000_000_000_000 && (
          <p className="text-center text-yellow-300">You need at least 3,000,000 tokens to create a poll.</p>
        )}

        <div className="text-center">
          <button
            onClick={() => router.push('/members/talk')}
            className="bg-purple-600 text-white px-6 py-3 rounded-full hover:bg-purple-700"
          >
            🌐 Join the Community
          </button>
        </div>
      </div>
    </main>
  );
}
