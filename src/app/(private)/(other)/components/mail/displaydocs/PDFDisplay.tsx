'use client';

import React from 'react';
import { useState } from 'react';
import ChevronIcon from '@/app/(private)/components/svgs/ChevronIcon';
import { PDFViewer, Document } from '@react-pdf/renderer';

interface PDFDisplayProps {
    displayPdfs: React.ReactNode[];
    handleClosePdfs: () => void;
}

export default function PDFDisplay({ displayPdfs, handleClosePdfs }: PDFDisplayProps) {
    const [currentIndex, setCurrentIndex] = useState(0);

    // state for print all
    const [printAll, setPrintAll] = useState(false);

    if (displayPdfs.length === 0) return null;

    const handleNext = () => {
        setCurrentIndex((prev) => (prev + 1) % displayPdfs.length);
    };

    const handlePrevious = () => {
        setCurrentIndex((prev) => (prev - 1 + displayPdfs.length) % displayPdfs.length);
    };
    const pages : React.ReactNode[] = displayPdfs

    return (
        <div className="fixed inset-0 flex items-center justify-center w-full h-full z-50">
            {/* Container */}

            {/* Blurred background overlay */}
            <div className="absolute inset-0 bg-black/30 backdrop-blur-sm " />

            {/* PDF container */}
            <div className="relative w-screen max-w-[1000px] h-screen flex items-center justify-center ">
                {/* Close button */}
                <button
                    onClick={handleClosePdfs}
                    className="cursor-pointer absolute top-4 right-4 w-10 h-10 bg-[#2A7D7B] rounded-full flex items-center justify-center shadow-md hover:bg-[#48B4A0] transition-colors z-50"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
                {/* Left Chevron */}
                <button
                    onClick={handlePrevious}
                    className="cursor-pointer absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 hover:bg-white transition-colors"
                >
                    <ChevronIcon className="w-6 h-6 text-gray-800" />
                </button>

                {/* show pdfs */}
                <div>
                    {/* Button Headers */}
                    <div className='flex items-center justify-center w-full gap-4 text-sm pb-2'>
                        <button
                            onClick={() => { setPrintAll(!printAll); console.log("array length", displayPdfs.length) }}
                            className="flex items-center justify-center h-[50px] w-[100px] bg-blue-500 cursor-pointer"
                        >
                            {printAll ? 'Print One' : 'Print All'}
                        </button>
                        <div className="flex items-center justify-center h-[50px] w-[100px] bg-green-500 cursor-pointer">
                            <button className='text-white cursor-pointer'> Email</button>
                        </div>
                    </div>
                    <div className="w-[800px] h-[700px]">
                        <PDFViewer key={printAll ? 'all' : `single-${currentIndex}`} className="w-full h-full">
                            <Document>
                                {printAll ? pages : pages[currentIndex]}
                            </Document>
                        </PDFViewer>

                    </div>
                </div>
                {/* Right Chevron */}
                <button
                    onClick={handleNext}
                    className="cursor-pointer absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 hover:bg-white transition-colors"
                >
                    <ChevronIcon className="w-6 h-6 text-gray-800 rotate-180" />
                </button>
            </div>
        </div>
    );
}
