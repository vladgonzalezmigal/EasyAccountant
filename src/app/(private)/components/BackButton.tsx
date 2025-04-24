'use client';

import { useRouter } from 'next/navigation';

interface BackButtonProps {
  url: string;
}

export default function BackButton({ url }: BackButtonProps) {
  const router = useRouter();

  return (
    <button
      onClick={() => router.push(url)}
      className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
      aria-label="Go back"
    >
        <p>Back</p>
    </button>
  );
} 