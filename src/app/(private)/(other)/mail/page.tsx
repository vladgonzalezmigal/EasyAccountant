'use client';

import { useState } from 'react';

interface Document {
  id: string;
  name: string;
  selected: boolean;
}

export default function MailPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [documents, setDocuments] = useState<Document[]>([
    { id: '1', name: 'Invoice #1234', selected: false },
    { id: '2', name: 'Receipt #5678', selected: false },
    { id: '3', name: 'Contract Agreement', selected: false },
    { id: '4', name: 'Tax Document', selected: false },
    { id: '5', name: 'Employee Form', selected: false },
  ]);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const toggleDocument = (id: string) => {
    setDocuments(documents.map(doc => 
      doc.id === id ? { ...doc, selected: !doc.selected } : doc
    ));
  };

  const selectedCount = documents.filter(doc => doc.selected).length;

  return (
    <div className="p-8">
      <div className="max-w-md">
        <h1 className="text-2xl font-semibold mb-6">Mail Documents</h1>
        
        <div className="mb-6">
          <div 
            className="border border-gray-300 rounded-md p-3 flex justify-between items-center cursor-pointer bg-white"
            onClick={toggleDropdown}
          >
            <span>{selectedCount === 0 ? 'Select documents' : `${selectedCount} document${selectedCount > 1 ? 's' : ''} selected`}</span>
            <svg 
              className={`w-5 h-5 transition-transform ${isOpen ? 'transform rotate-180' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </div>
          
          {isOpen && (
            <div className="border border-gray-300 border-t-0 rounded-b-md bg-white">
              {documents.map(doc => (
                <div 
                  key={doc.id} 
                  className="p-3 border-t border-gray-200 flex items-center"
                >
                  <input
                    type="checkbox"
                    id={`doc-${doc.id}`}
                    checked={doc.selected}
                    onChange={() => toggleDocument(doc.id)}
                    className="mr-3 h-4 w-4"
                  />
                  <label htmlFor={`doc-${doc.id}`} className="cursor-pointer flex-grow">
                    {doc.name}
                  </label>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <button 
          className="bg-[#0C3C74] text-white px-6 py-2 rounded-md hover:bg-[#0A2E5C] transition-colors"
        >
          Create
        </button>
      </div>
    </div>
  );
}
