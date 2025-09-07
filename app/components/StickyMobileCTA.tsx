"use client";

export default function StickyMobileCTA({ onClick }: { onClick: () => void }) {
  return (
    <div className="fixed bottom-3 inset-x-3 z-40 md:hidden">
      <button
        onClick={onClick}
        className="w-full py-4 rounded-xl font-bold text-white bg-blue-600 shadow-lg hover:bg-blue-700 active:scale-[0.99] transition"
        aria-label="Compare rates now"
      >
        Compare Rates
      </button>
    </div>
  );
}
