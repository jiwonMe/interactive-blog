'use client';

export function YouTube({ id }: { id: string }) {
  return (
    <div className="relative w-full aspect-video rounded-xl overflow-hidden shadow-sm my-8 bg-zinc-100">
      <iframe
        src={`https://www.youtube.com/embed/${id}`}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        title="Embedded YouTube video"
        className="absolute top-0 left-0 w-full h-full border-0"
      />
    </div>
  );
}

