'use client';

import { useEffect, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Connection, PublicKey } from '@solana/web3.js';
import { getAssociatedTokenAddress, getAccount } from '@solana/spl-token';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { doc, getDocs, setDoc, collection, addDoc } from 'firebase/firestore';
import { db, auth } from '@/app/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';

const MINT = new PublicKey("4qoK3wdGaEqVBbTzJVztCKCPc35Cz11XzbvUx2TGpump");
const RPC = "https://solana-mainnet.g.alchemy.com/v2/demo";

export default function MemberDashboard() {
  const wallet = useWallet();
  const router = useRouter();
  const [hasToken, setHasToken] = useState(false);
  const [tokenAmount, setTokenAmount] = useState(0);
  const [user, setUser] = useState(null);
  const [polls, setPolls] = useState<any[]>([]);
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
        setHasToken(amount >= 100_000_000_000); // 100 mil tokens (com 6 casas decimais)
        if (amount < 100_000_000_000) router.push('/');
      } catch (e) {
        router.push('/');
      }
    };
    checkToken();
  }, [wallet.publicKey]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchPolls = async () => {
      const snapshot = await getDocs(collection(db, 'polls'));
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
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
    alert('Votação criada com sucesso!');
  };

  if (!hasToken) return null;

  return (
    <main className="min-h-screen bg-cover bg-center text-white p-6" style={{ backgroundImage: "url('/bg2.png')" }}>
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-4xl font-bold text-center">🧠 Koala DAO - Dashboard</h1>

        <section className="bg-white/10 backdrop-blur-md p-6 rounded-xl shadow-lg">
          <h2 className="text-2xl font-semibold mb-2">🐨 NFT da Semana</h2>
          <p>Reivindique seu NFT exclusivo (em breve...)</p>
        </section>

        <section className="bg-white/10 backdrop-blur-md p-6 rounded-xl shadow-lg">
          <h2 className="text-2xl font-semibold mb-4">🗳️ Votações Ativas</h2>
          {polls.filter(p => p.active).length === 0 && <p>Nenhuma votação ativa no momento.</p>}
          {polls.filter(p => p.active).map(poll => (
            <div key={poll.id} className="mb-6">
              <p className="text-lg font-medium mb-2">{poll.question}</p>
              {tokenAmount >= 100_000_000_000 ? (
                <div className="flex gap-4">
                  <button onClick={() => handleVote(poll.id, 'yes')} className="bg-green-600 px-4 py-2 rounded-xl hover:bg-green-700">Yes</button>
                  <button onClick={() => handleVote(poll.id, 'no')} className="bg-red-600 px-4 py-2 rounded-xl hover:bg-red-700">No</button>
                </div>
              ) : (
                <p className="text-yellow-300">Você precisa de pelo menos 100.000 tokens para votar.</p>
              )}
            </div>
          ))}
        </section>

        <section className="bg-white/10 backdrop-blur-md p-6 rounded-xl shadow-lg">
          <h2 className="text-2xl font-semibold mb-4">📊 Votações Encerradas</h2>
          {polls.filter(p => !p.active).map(poll => (
            <div key={poll.id} className="mb-4">
              <p className="text-lg font-medium mb-1">{poll.question}</p>
              <p>✅ Yes: {poll.results?.yes || 0}%</p>
              <p>❌ No: {poll.results?.no || 0}%</p>
            </div>
          ))}
        </section>

        {tokenAmount >= 3_000_000_000_000 && (
          <section className="bg-white/10 backdrop-blur-md p-6 rounded-xl shadow-lg">
            <h2 className="text-2xl font-semibold mb-4">➕ Criar Nova Votação</h2>
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Digite a pergunta da votação..."
              className="w-full p-2 rounded mb-4 text-black"
            />
            <button onClick={handleCreatePoll} className="bg-blue-600 px-4 py-2 rounded-full hover:bg-blue-700">Criar</button>
          </section>
        )}

        {tokenAmount < 3_000_000_000_000 && (
          <p className="text-center text-yellow-300">Você precisa de pelo menos 3.000.000 tokens para criar uma votação.</p>
        )}

        <div className="text-center">
          <button
            onClick={() => router.push('/src/members/talk')}
            className="bg-purple-600 text-white px-6 py-3 rounded-full hover:bg-purple-700"
          >
            🌐 Ir para a Comunidade
          </button>
        </div>
      </div>
    </main>
  );
}
