"use client";

import { Button } from '@/app/components/ui/Button';

export default function StickyMobileCTA({ onClick }: { onClick: () => void }) {
  return (
    <div className="fixed bottom-3 inset-x-3 z-40 md:hidden">
      <Button onClick={onClick} variant="primary" size="lg" fullWidth aria-label="Compare rates now">
        Compare Rates
      </Button>
    </div>
  );
}
