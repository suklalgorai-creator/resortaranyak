import { cn } from '@/lib/utils';

interface ImageFrameProps {
  src: string;
  alt: string;
  aspectRatio?: 'square' | 'video' | 'portrait' | 'auto';
  overlay?: boolean;
  zoom?: boolean;
  className?: string;
  innerBorder?: boolean;
}

const aspectStyles: Record<string, string> = {
  square: 'aspect-square',
  video: 'aspect-video',
  portrait: 'aspect-[3/4]',
  auto: '',
};

export function ImageFrame({
  src,
  alt,
  aspectRatio = 'auto',
  overlay = true,
  zoom = true,
  className,
  innerBorder = false,
}: ImageFrameProps) {
  return (
    <div
      className={cn(
        'relative rounded-2xl overflow-hidden group',
        aspectStyles[aspectRatio],
        className
      )}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        className={cn(
          'absolute inset-0 w-full h-full object-cover transition-transform duration-700',
          zoom && 'group-hover:scale-105'
        )}
      />
      {overlay && (
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />
      )}
      {innerBorder && (
        <div className="absolute inset-3 border border-white/20 rounded-xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      )}
    </div>
  );
}
