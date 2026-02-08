import { ObjectData } from '@/features/study/types';
import Tags from '@/shared/ui/Tags';
import Image from 'next/image';

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  data: ObjectData;
}

export default function ObjectCard({ data, ...rest }: Props) {
  console.log(data);
  return (
    <article
      className="
        flex flex-col
        w-[331px]
        bg-white
        rounded-[8px]
        shadow-[0_0_10px_0_rgba(0,0,0,0.10)]
        overflow-hidden
      "
      {...rest}
    >
      <div className="relative w-full h-[148px] bg-gray-100">
        <Image src={data.thumbnailUrl} alt={data.name} fill className="object-cover" />
      </div>
      <div className="flex flex-col justify-start px-5 py-4 h-[122px] gap-3">
        <div className="flex flex-col">
          <h3 className="text-[22px] text-gray-900 font-bold">{data.name}</h3>
          <p className="text-[16px] text-gray-600 truncate">{data.description}</p>
        </div>
        <div className="flex flex-wrap gap-1">
          {data.categories.map((tagName: string) => (
            <Tags key={tagName} tagName={tagName} />
          ))}
        </div>
      </div>
    </article>
  );
}
