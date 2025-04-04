'use client';

export default function WhitepaperPage() {
  return (
    <main
      className="min-h-screen bg-cover bg-center flex flex-col items-center justify-start pt-12 px-4"
      style={{ backgroundImage: "url('/bgwhite.png')" }}
    >
      <div className="bg-black/70 rounded-3xl p-8 text-white max-w-4xl w-full shadow-2xl border border-white/20 backdrop-blur-sm">
        <h1 className="text-5xl font-bold mb-10 text-center drop-shadow-lg">Koala Reserv - $NAP Whitepaper</h1>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-3">Introduction</h2>
          <p>
            Koala Reserv began as a lighthearted idea between a group of friends who could only talk about crypto for two hours a day. That’s where the Koala was born — a symbol of restful focus. While it sleeps most of the day, during its two hours of activity, it works hard to grow a true decentralized reserve.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-3">Purpose of $NAP</h2>
          <p>
            $NAP is a token designed to create a stable, non-inflationary currency supported by an investment fund that reinvests into itself, generating yield for its holders.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-3">Tokenomics</h2>
          <ul className="list-disc list-inside space-y-1">
            <li>1 Billion Total Supply (Fixed)</li>
            <li>30% Fund Reserve Wallet Address : 5ArPQSA9vM7sukJzsFdkEnUzG5NALCDDcEm6Li5VoZRS</li>
            <li>10% Liquidity on Orca - Wallet: E8E6TgsLVgC7MDo7y7P2Y7kz9syUAmFeVJTijw3okVMH</li>
            <li>3% Airdrop - Wallet: DrqJ7X2UbdeZH64iEgNPW1hf7oMeVkcqxhVf1RKPDyXu</li>
            <li>7% Marketing - Wallet: 5JWD7G8coTQ5ysL8kbhJu1Bsyj9AjE9DRvJEMRqys7sA</li>
            <li>10% Staking Reserve - Wallet: 5zzk8NpGam62zXTEXrhg5tjMm7v5s4GDMeuvfFeXMJaC</li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-3">Utility</h2>
          <p>
            Holding $NAP gives access to community voting rights and eligibility to earn exclusive community-created NFTs.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-3">Fund Strategy</h2>
          <p>
            The Koala Reserve fund invests mainly in the SOL/USDC pool and follows this distribution model:
          </p>
          <ul className="list-disc list-inside space-y-1">
            <li>50% Reinvested into the SOL/USDC pool</li>
            <li>20% Reserved in SOL (staked via Marinade)</li>
            <li>20% Reserved in USDC for opportunities</li>
            <li>10% Used for $NAP liquidity and buybacks</li>
          </ul>
          <p className="mt-2">
            Weekly updates and staking announcements are posted on <a href="https://x.com/NapReserv" className="text-blue-400 underline">X</a> and <a href="https://t.me/koalanapreserv" className="text-blue-400 underline">Telegram</a>.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-3">Governance</h2>
          <p>
            Currently managed by a small group of friends, proposals are made and voted on by the community. Once the fund reaches $1 million, a full DAO will be activated through the $DNAP governance token.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">Final Words</h2>
          <p>
            $NAP started as a joke but evolved into a movement. Join the Koala. Sleep well. Stack wisely.
          </p>
        </section>
      </div>
    </main>
  );
}