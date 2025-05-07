'use client';

import { useRouter } from 'next/navigation';
import BackArrow from '../svgs/BackArrow';

interface BackButtonProps {
  url: string;
}

export default function BackButton({ url }: BackButtonProps) {
  const router = useRouter();

  return (
    <button
      onClick={() => router.push(url)}
      className="flex cursor-pointer items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 hover:text-gray-800 transition-colors duration-200"
      aria-label="Go back"
    >
      <BackArrow className="back-arrow" />
    </button>
  );
} 