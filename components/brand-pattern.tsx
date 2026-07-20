import Image from 'next/image';
import { cn } from '@/lib/utils';

export function BrandPattern({ className }: { className?: string }) {
  return (
    <div className={cn('absolute inset-0 z-0', className)}>
      <Image
        src="/brand-pattern.svg"
        alt="Brand Pattern"
        fill
        className="object-cover"
        priority
      />
      {/* Light glass overlay to soften the pattern so it doesn't interfere with text */}
      <div className="absolute inset-0 bg-background/50 backdrop-blur-[3px]" />
    </div>
  );
}
