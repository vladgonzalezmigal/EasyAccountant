'use client';

/**
 * TablePageTitle Component
 * 
 * A reusable component for displaying a page title with an optional subtitle.
 * Used for document and form pages to maintain consistent styling.
 * 
 * @param {Object} props - Component props
 * @param {string} props.docTitle - The main title of the page
 * @param {string} [props.docSubtitle] - Optional subtitle (e.g., store name)
 * 
 * @returns {JSX.Element} The title component with consistent styling
 */
export default function TablePageTitle({
  docTitle,
  docSubtitle
}: {
  docTitle: string;
  docSubtitle?: string;
}) {
  return (
    <div className="mb-8">
      <h1 className="text-[40px] font-semibold text-[#393939]">{docTitle}</h1>
      {docSubtitle && <h2 className="font-semibld text-[20px] text-[#636363]">{docSubtitle}</h2>}
    </div>
  );
}
