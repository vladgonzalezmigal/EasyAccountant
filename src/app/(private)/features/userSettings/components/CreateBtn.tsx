'use client';

import React from 'react';
import PlusIcon from '@/app/(private)/components/svgs/PlusIcon';

interface CreateBtnProps {
  onSubmit: () => void;
}

export default function CreateBtn({ onSubmit }: CreateBtnProps) {
  return (
    <button
      onClick={onSubmit}
      className="border-2 text-[#0C3C74] border-[#8ABBFD] cursor-pointer h-[40px] px-4 bg-[#DFF4F3] rounded-3xl hover:bg-[#B6E8E4] transition-colors duration-200 flex items-center justify-center gap-1"
    >
      <PlusIcon className="w-4 h-4" />
      <span>Create</span>
    </button>
  );
}
