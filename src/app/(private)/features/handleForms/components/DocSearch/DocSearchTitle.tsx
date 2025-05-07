'use client';

import React from 'react';

interface DocSearchTitleProps {
  title: string;
}

export default function DocSearchTitle({ title }: DocSearchTitleProps) {
  return (
    <div className="mb-10 text-3xl font-bold text-[#2F2F2F] absolute top-28">
      {title}
    </div>
  );
}
