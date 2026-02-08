import Logo from '@/shared/ui/Logo';
import Link from 'next/link';

const STEPS = [
  {
    step: 1,
    title: "학습 모델 선택",
    description: (
      <>
        스터디 탭에서 배우고 싶은 기계 모델<br />
        학습 콘텐츠를 선택하고 학습을 시작하세요.
      </>
    ),
  },
  {
    step: 2,
    title: "3D로 구조 이해",
    description: (
      <>
        모델을 자유롭게 회전하고 부품을 클릭하며<br />
        구조를 직관적으로 파악하세요.
      </>
    ),
  },
  {
    step: 3,
    title: "AI로 궁금증 해결",
    description: (
      <>
        학습 중 생긴 질문을 AI에게 바로 물어보고<br />
        이해도를 높이세요.
      </>
    ),
  },
];

export default function Home() {
  return (
    <div>
      <header className="flex w-full px-10 py-3 gap-2.5 bg-gray-50">
        <div className="flex items-center gap-7.5">
          <Logo />
          <div className="flex items-center gap-5">
            <span className="flex justify-center font-semibold text-gray-900 text-[16px]">서비스 소개</span>
            <span className="flex justify-center font-semibold text-gray-900 text-[16px]">주요 기능 미리보기</span>
          </div>
        </div>
      </header>
      <main className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4 py-20">
        <div className="text-center mb-12.5">
          <h1 className="text-[46px] font-bold text-gray-900 leading-tight mb-2">
            SIMVEX와 함께하는
            <br />
            가장 똑똑한 공학 학습 관리
          </h1>
          <p className="text-[24px] text-gray-600 font-medium">
            3D 인터랙션 기반 학습으로 어려운 기계 구조를 쉽게 익힐 수 있습니다.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-[1080px] mb-16">
          {STEPS.map((step) => (
            <div
              key={step.step}
              className="
              flex flex-col
              py-[20px] px-[24px]
              gap-[12px]
              rounded-[12px]
              border border-[#E7EFFF]
              bg-white
              shadow-[0_0_10px_0_rgba(3,89,255,0.10)]
            "
            >
              <div className="flex flex-col items-start gap-1">
                <span className="text-[12px] font-bold text-gray-500">STEP {step.step}</span>
                <h3 className="text-[20px] font-bold text-primary-600">{step.title}</h3>
              </div>
              <div className="bg-[#F8F9FB] rounded-lg px-4 py-5 flex-grow flex items-center">
                <p className="text-[14px] text-gray-700 leading-relaxed break-keep text-left">{step.description}</p>
              </div>
            </div>
          ))}
        </div>

        <Link
          href="/study"
          className="
          px-10 py-4
          bg-primary-500 hover:bg-primary-700
          text-white text-[18px] font-bold
          rounded-full
          shadow-lg hover:shadow-xl
          transition-all duration-200
        "
        >
          학습 시작하기
        </Link>
      </main>
    </div>
  );
}
