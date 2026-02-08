import RightArrow from '@/assets/icons/right-arrow.svg';
import Logo from '@/shared/ui/Logo';
import Link from 'next/link';

const STEPS = [
  {
    step: 1,
    title: '학습 모델 선택',
    description: (
      <>
        스터디 탭에서 배우고 싶은 기계 모델
        <br />
        학습 콘텐츠를 선택하고 학습을 시작하세요.
      </>
    ),
  },
  {
    step: 2,
    title: '3D로 구조 이해',
    description: (
      <>
        모델을 자유롭게 회전하고 부품을 클릭하며
        <br />
        구조를 직관적으로 파악하세요.
      </>
    ),
  },
  {
    step: 3,
    title: 'AI로 궁금증 해결',
    description: (
      <>
        학습 중 생긴 질문을 AI에게 바로 물어보고
        <br />
        이해도를 높이세요.
      </>
    ),
  },
];

export default function Home() {
  return (
    <div>
      <header className="flex fixed w-full px-10 py-3 gap-2.5 bg-gray-50">
        <div className="flex items-center gap-7.5">
          <Logo />
          <div className="flex items-center gap-5">
            <span className="flex justify-center font-semibold text-gray-900 text-[16px]">서비스 소개</span>
            <span className="flex justify-center font-semibold text-gray-900 text-[16px]">주요 기능 미리보기</span>
          </div>
        </div>
      </header>
      {/*타이틀 화면*/}
      <section className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4 py-20">
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
      </section>

      <section className="w-full bg-white pb-32 pt-10 px-4">
        <div className="max-w-[1080px] mx-auto">
          {/* 섹션 헤더 */}
          <div className="text-center mb-24">
            <h2 className="text-[32px] md:text-[36px] font-bold text-gray-900 leading-tight mb-4">
              복잡한 기계 구조를
              <br />
              직접 돌려보며 이해하세요
            </h2>
            <p className="text-[16px] md:text-[18px] text-gray-500 font-medium">
              전공 공부를 게임처럼 이론과 실습을 한 번에
            </p>
          </div>

          {/* 기능 리스트 (수직 배치) */}
          <div className="flex flex-col gap-24 md:gap-32">
            {/* Feature 1: 카테고리별 학습 모델 선택 */}
            <div className="flex flex-col md:flex-row justify-between gap-10 md:gap-16">
              {/* 텍스트 영역 */}
              <div className="flex-1 flex flex-col items-start text-left min-w-[300px]">
                <h3 className="text-[24px] md:text-[28px] font-bold text-gray-900 leading-snug mb-5">
                  카테고리별
                  <br />
                  <span className="text-primary-600">학습 모델</span> 선택
                </h3>
                <p className="text-[16px] text-gray-600 leading-relaxed break-keep">
                  기계, 화학, 반도체 등 다양한 공학의 물리 현상과
                  <br />
                  실제 산업 기계의 작동 원리를 3D 시뮬레이션을 통해 학습하세요.
                </p>
              </div>
              <div className="flex-1 w-full">
                <div className="relative w-full aspect-[16/10] bg-gray-50 rounded-[16px] border border-[#E7EFFF] shadow-md overflow-hidden flex items-center justify-center">
                  <span className="text-gray-400 font-medium">(스터디 목록 화면 스크린샷)</span>
                  {/* TODO 스샷 필요 <Image src="/feature-1.png" alt="학습 모델 선택" fill className="object-cover" /> */}
                </div>
              </div>
            </div>

            <div className="flex flex-col md:flex-row justify-between gap-10 md:gap-16">
              <div className="flex-1 flex flex-col items-start text-left min-w-[300px]">
                <h3 className="text-[24px] md:text-[28px] font-bold text-gray-900 leading-snug mb-5">
                  <span className="text-primary-600">3D 시뮬레이션</span>을 통해
                  <br />
                  직관적으로 학습
                </h3>
                <p className="text-[16px] text-gray-600 leading-relaxed break-keep">
                  부품 단위로 구조를 확인하고
                  <br />
                  상호작용하며 작동 원리를 자연스럽게 이해하세요.
                </p>
              </div>
              <div className="flex-1 w-full">
                <div className="relative w-full aspect-[16/10] bg-gray-50 rounded-[16px] border border-[#E7EFFF] shadow-md overflow-hidden flex items-center justify-center">
                  <span className="text-gray-400 font-medium">(3D 뷰어 화면 스크린샷)</span>
                  {/* TODO 스샷 필요 <Image src="/feature-2.png" alt="3D 시뮬레이션" fill className="object-cover" /> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="flex justify-between w-full bg-primary-600 p-25">
        <div className="flex flex-col w-full md:flex-row items-center justify-between">
          {/* 좌측 텍스트 */}
          <div className="text-center md:text-left">
            <h2 className="text-[32px] md:text-[40px] font-bold text-white leading-tight mb-2">
              SIMVEX
              <br />
              나만의 작은 연구실
            </h2>
            <p className="text-[16px] md:text-[18px] text-white/90 font-medium mt-4">
              사전 예약하고, 대학생 1년 무료 요금제 혜택을 받아보세요.
            </p>
          </div>

          <Link
            href="/study"
            className="
              flex justify-center items-center
              gap-[12px]
              px-[60px] py-[14.4px]
              bg-gray-900 hover:bg-black
              rounded-full
              text-white
              text-[28.8px]
              font-bold
              leading-[150%]
              tracking-[-0.288px]
              transition-all duration-200
              group
            "
          >
            학습 시작하기
            <RightArrow width={24} height={22} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </section>

      <footer className="flex justify-between w-full bg-gray-900 pt-[82px] pb-[90px] px-25">
        <div className="flex w-full items-end justify-between">
          <div className="flex flex-col">
            <h2 className="flex items-center text-[52px] font-bold text-gray-400">SIMVEX</h2>
            <p className="text-[14px] font-medium text-gray-400">© 2026 DOSA.SIMVEX 3D All Right Reserved.</p>
          </div>
          <div className="flex flex-col md:flex-row md:gap-16 text-[14px]">
            <div className="grid grid-cols-[80px_1fr] gap-y-3 pr-[131px]">
              <span className="text-gray-400">대표이사</span>
              <span className="text-gray-400">홍길동</span>

              <span className="text-gray-400">주소</span>
              <span className="text-gray-400">서울특별시 강남구 역삼로</span>

              <span className="text-gray-400">사업자등록증</span>
              <span className="text-gray-400">000-00-00000</span>
            </div>

            {/* 정보 컬럼 2 */}
            <div className="grid grid-cols-[60px_1fr] gap-y-3">
              <span className="text-gray-400">EMAIL</span>
              <span className="text-gray-400">sales@dosa.study</span>

              <span className="text-gray-400">TEL</span>
              <span className="text-gray-400">02-123-1234</span>

              <span className="text-gray-400">FAX</span>
              <span className="text-gray-400">02-000-0000</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
