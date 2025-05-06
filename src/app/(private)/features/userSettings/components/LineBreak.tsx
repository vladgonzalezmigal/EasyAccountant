interface LineBreakProps {
  className?: string;
}

export default function LineBreak({ className }: LineBreakProps) {
  return (
    <div 
      className={`w-full h-[1.5px] bg-[#DADADA] rounded-full ${className || ''}`}
    />
  );
}
