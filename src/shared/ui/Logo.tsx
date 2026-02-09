'use client';
import LogoIcon from '@/assets/icons/LOGO.png';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function Logo() {
  const router = useRouter();
  const handleClick = () => {
    router.push('/');
  };

  return (
    <div onClick={handleClick} className="cursor-pointer flex justify-center items-center gap-3">
      <Image src={LogoIcon} alt="Logo" width={100} height={100} />
      {/* <h1 className="text-gray-900 text-[26.5px] font-bold leading-normal">SIMVEX</h1> */}
    </div>
  );
}
