'use client';

import { useState, useEffect } from 'react';
import ChevronIcon from '@/app/(private)/components/svgs/ChevronIcon';
import { PDFViewer, DocumentProps } from '@react-pdf/renderer';

interface PDFDisplayProps {
    displayPdfs: React.ReactNode[];
    handleClosePdfs: () => void;
}

export default function PDFDisplay({ displayPdfs, handleClosePdfs }: PDFDisplayProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [key, setKey] = useState(0); // Add a key to force re-render of PDFViewer

    // Reset the PDFViewer when displayPdfs changes
    useEffect(() => {
        setKey(prevKey => prevKey + 1);
    }, [displayPdfs]);

    if (displayPdfs.length === 0) return null;

    const handleNext = () => {
        setCurrentIndex((prev) => (prev + 1) % displayPdfs.length);
        setKey(prevKey => prevKey + 1); // Force re-render when changing document
    };

    const handlePrevious = () => {
        setCurrentIndex((prev) => (prev - 1 + displayPdfs.length) % displayPdfs.length);
        setKey(prevKey => prevKey + 1); // Force re-render when changing document
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center w-full h-full z-50">
            <button
                onClick={handleClosePdfs}
                className="absolute top-4 right-4 w-10 h-10 bg-[#2A7D7B] rounded-full flex items-center justify-center shadow-md hover:bg-[#48B4A0] transition-colors z-50"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
            {/* Blurred background overlay */}
            <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />

            {/* PDF container */}
            <div className="relative w-screen h-screen flex items-center justify-center">
                {/* Navigation buttons */}
                <button
                    onClick={handlePrevious}
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 hover:bg-white transition-colors"
                >
                    <ChevronIcon className="w-6 h-6 text-gray-800" />
                </button>

                {/* show pdfs */}
                <div>
                    {/* Email Button */}
                    <div>
                        <button> Email</button>
                    </div>
                    <div className="w-[800px] h-[700px]">
                    <PDFViewer key={key} className="w-full h-full">
                        {displayPdfs[currentIndex] as React.ReactElement<DocumentProps>}
                    </PDFViewer>
                    </div>
                </div>
                {/* Right Chevron */}
                <button
                    onClick={handleNext}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 hover:bg-white transition-colors"
                >
                    <ChevronIcon className="w-6 h-6 text-gray-800 rotate-180" />
                </button>


            </div>
        </div>
    );
}
