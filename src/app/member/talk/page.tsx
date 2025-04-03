'use client';

import Image from 'next/image';

export default function MembersTalkPage() {
  return (
    <main
      className="min-h-screen flex items-center justify-center bg-cover bg-center text-white"
      style={{ backgroundImage: "url('/bg2.png')" }}
    >
      <div className="text-center bg-black/60 p-10 rounded-2xl shadow-xl max-w-xl">
        <Image
          src="/work.png"
          alt="Work in Progress"
          width={300}
          height={300}
          className="mx-auto mb-6"
        />
        <h1 className="text-4xl font-bold mb-2 drop-shadow-md">🚧 Page Under Maintenance</h1>
        <p className="text-lg text-gray-200 drop-shadow-sm">
          We are working hard to build a stellar experience. Please check back soon! 🌌
        </p>
      </div>
    </main>
  );
}
