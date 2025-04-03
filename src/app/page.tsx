'use client';

import { useEffect, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Connection, PublicKey } from '@solana/web3.js';
import { getAssociatedTokenAddress, getAccount } from '@solana/spl-token';
import { useRouter } from 'next/navigation';
import {
  doc,
  getDocs,
  setDoc,
  collection,
  addDoc,
  getDoc,
  getDocsFromServer,
} from 'firebase/firestore';
import { db } from '@/app/lib/firebase';

const MINT = new PublicKey('4qoK3wdGaEqVBbTzJVztCKCPc35Cz11XzbvUx2TGpump');
const RPC = 'https://newest-misty-darkness.solana-mainnet.quiknode.pro/af6310c5314f899ae52cbc545812bd8903835b23/';

type PollData = {
  id: string;
  question: string;
  active: boolean;
  results?: {
    yes: string;
    no: string;
  };
};

export default function MemberDashboard() {
  const wallet = useWallet();
  const router = useRouter();
  const [hasToken, setHasToken] = useState(false);
  const [tokenAmount, setTokenAmount] = useState(0);
  const [polls, setPolls] = useState<PollData[]>([]);
  const [question, setQuestion] = useState('');
  const [votedPolls, setVotedPolls] = useState<Record<string, string>>({});

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
      const data = await Promise.all(
        snapshot.docs.map(async (docSnap) => {
          const poll = { id: docSnap.id, ...docSnap.data() } as PollData;
          const votesSnap = await getDocsFromServer(collection(db, 'polls', docSnap.id, 'votes'));
          const totalVotes = votesSnap.docs.length;
          const yesVotes = votesSnap.docs.filter((d) => d.data().answer === 'yes').length;
          const noVotes = votesSnap.docs.filter((d) => d.data().answer === 'no').length;
          return {
            ...poll,
            results: {
              yes: totalVotes > 0 ? ((yesVotes / totalVotes) * 100).toFixed(1) : '0',
              no: totalVotes > 0 ? ((noVotes / totalVotes) * 100).toFixed(1) : '0',
            },
          };
        })
      );
      setPolls(data);
    };

    const fetchVotedPolls = async () => {
      if (!wallet.publicKey) return;
      const voted: Record<string, string> = {};
      const snapshot = await getDocs(collection(db, 'polls'));
      for (const docSnap of snapshot.docs) {
        const voteRef = doc(db, 'polls', docSnap.id, 'votes', wallet.publicKey.toBase58());
        const voteSnap = await getDoc(voteRef);
        if (voteSnap.exists()) {
          voted[docSnap.id] = voteSnap.data().answer;
        }
      }
      setVotedPolls(voted);
    };

    fetchPolls();
    fetchVotedPolls();
  }, [wallet.publicKey]);

  const handleVote = async (pollId: string, answer: string) => {
    if (!wallet.publicKey || tokenAmount < 100_000_000_000) return;
    if (votedPolls[pollId]) return;
    const voteRef = doc(db, 'polls', pollId, 'votes', wallet.publicKey.toBase58());
    await setDoc(voteRef, { answer });
    setVotedPolls((prev) => ({ ...prev, [pollId]: answer }));
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
    <main className="min-h-screen bg-cover bg-center text-white p-6" style={{ backgroundImage: "url('/bg2.png')" }}>
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-4xl font-bold text-center">🧠 Koala DAO - Dashboard</h1>

        <section className="bg-white/10 backdrop-blur-md p-6 rounded-xl shadow-lg">
          <h2 className="text-2xl font-semibold mb-2">🐨 NFT of the Week</h2>
          <p>Claim your exclusive NFT (coming soon...)</p>
        </section>

        <section className="bg-white/10 backdrop-blur-md p-6 rounded-xl shadow-lg">
          <h2 className="text-2xl font-semibold mb-4">🗳️ Active Polls</h2>
          {polls.filter((p) => p.active).length === 0 && <p>No active polls at the moment.</p>}
          {polls
            .filter((p) => p.active)
            .map((poll) => (
              <div key={poll.id} className="mb-6">
                <p className="text-lg font-medium mb-2">{poll.question}</p>
                {votedPolls[poll.id] ? (
                  <p className="text-green-300">You voted: {votedPolls[poll.id]}</p>
                ) : (
                  <div className="flex gap-4">
                    <button
                      onClick={() => handleVote(poll.id, 'yes')}
                      className="bg-green-600 px-4 py-2 rounded-xl hover:bg-green-700"
                    >
                      Yes
                    </button>
                    <button
                      onClick={() => handleVote(poll.id, 'no')}
                      className="bg-red-600 px-4 py-2 rounded-xl hover:bg-red-700"
                    >
                      No
                    </button>
                  </div>
                )}
                {poll.results && (
                  <div className="mt-2">
                    <p>✅ Yes: {poll.results.yes}%</p>
                    <p>❌ No: {poll.results.no}%</p>
                  </div>
                )}
              </div>
            ))}
        </section>

        <section className="bg-white/10 backdrop-blur-md p-6 rounded-xl shadow-lg">
          <h2 className="text-2xl font-semibold mb-4">📊 Closed Polls</h2>
          {polls
            .filter((p) => !p.active)
            .map((poll) => (
              <div key={poll.id} className="mb-4">
                <p className="text-lg font-medium mb-1">{poll.question}</p>
                <p>✅ Yes: {poll.results?.yes || 0}%</p>
                <p>❌ No: {poll.results?.no || 0}%</p>
              </div>
            ))}
        </section>

        {tokenAmount >= 3_000_000_000_000 && (
          <section className="bg-white/10 backdrop-blur-md p-6 rounded-xl shadow-lg">
            <h2 className="text-2xl font-semibold mb-4">➕ Create New Poll</h2>
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Enter your poll question..."
              className="w-full p-2 rounded mb-4 text-black"
            />
            <button onClick={handleCreatePoll} className="bg-blue-600 px-4 py-2 rounded-full hover:bg-blue-700">
              Create
            </button>
          </section>
        )}

        {tokenAmount < 3_000_000_000_000 && (
          <p className="text-center text-yellow-300">You need at least 3,000,000 tokens to create a poll.</p>
        )}

        <div className="text-center">
          <button
            onClick={() => router.push('/src/members/talk')}
            className="bg-purple-600 text-white px-6 py-3 rounded-full hover:bg-purple-700"
          >
            🌐 Go to Community
          </button>
        </div>
      </div>
    </main>
  );
}
