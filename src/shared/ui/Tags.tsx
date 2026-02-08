interface Props {
  tagName: string;
}

export default function Tags({ tagName }: Props) {
  return (
    <div
      className="inline-flex items-center justify-center
        px-2 py-1.5
        rounded-full
        border border-primary-400
        bg-primary-100
        text-[#3479FF]
        text-xs font-bold
        whitespace-nowrap"
    >
      {tagName}
    </div>
  );
}
