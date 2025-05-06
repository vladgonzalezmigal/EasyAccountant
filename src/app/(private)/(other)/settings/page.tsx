'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { sections } from '@/app/(private)/features/userSettings/utils/settingsUtils';
import { useStore } from '@/store';

export default function SettingsPage() {
  const searchParams = useSearchParams();
  const { storeState, vendorState } = useStore();
  console.log("store state", storeState);
  console.log("vendor state", vendorState);
  useEffect(() => {
    // Check if there's a section hash in the URL
    const hash = window.location.hash;
    if (hash) {
      // Remove the # character
      const sectionId = hash.substring(1);
      const element = document.getElementById(sectionId);
      if (element) {
        // Scroll to the element with smooth behavior
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [searchParams]);

  

  return (
    <div className="container mx-auto px-4 py-8 max-h-screen overflow-y-auto">
      <h1 className="text-3xl font-bold text-[#2F2F2F] mb-8">Settings</h1>
      <div className="mb-8">
        {/* Divider */}
        <div className="flex flex-wrap gap-4">
          {sections.map((section) => (
            <a 
              key={section.id}
              href={`#${section.id}`}
              className="w-[100px] py-2 flex items-center justify-center bg-[#DFF4F3] text-[#2A7D7B] rounded-lg hover:bg-[#B6E8E4] transition-colors duration-200"
            >
              {section.title}
            </a>
          ))}
        </div>
      </div>

      <div className="space-y-12">
        {sections.map((section) => (
          <section 
            key={section.id} 
            id={section.id}
            className="border border-[#DFDFDF] rounded-xl p-6 shadow-sm scroll-mt-24"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-[#DFF4F3] rounded-full flex items-center justify-center">
                <section.icon className="text-[#2A7D7B] w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold text-[#2F2F2F]">{section.title}</h2>
            </div>
            <p className="text-[#696969] mb-6">{section.description}</p>
            <div className="bg-[#FBFBFB] p-6 rounded-lg border border-[#DFDFDF]">
              <p className="text-[#80848A]">Settings content for {section.title} will go here.</p>
              {/* Placeholder for actual settings content */}
              <div className="h-40 flex items-center justify-center border border-dashed border-[#DFDFDF] rounded-lg mt-4">
                <p className="text-[#80848A]">Settings form placeholder</p>
              </div>
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
