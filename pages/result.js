import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const { basePath } = useRouter();

export default function Result() {
  const router = useRouter();
  const [data, setData] = useState(null);

  useEffect(() => {
    if (router.isReady) {
      setData(router.query);
    }
  }, [router.isReady, router.query]);

  if (!data) {
    return (
      <div className="flex justify-center items-center min-h-screen text-lg">
        加载中...
      </div>
    );
  }

  const {
    lunarYear,
    lunarMonth,
    lunarDay,
    lunarTime,
    zodiac,
    elementSummary,
    missingElementMessage,
    dominantElementMessage,
    taiSui,
    lunarDate,
    fiveElements,
  } = data;

  return (
    <div className="bg-custom min-h-screen flex flex-col items-center justify-center px-8">
      <div className="w-full max-w-[420px] mx-auto">
        <img
          src={`${basePath}/images/bosch-logo.svg`}
          className="absolute top-6 left-6 w-20 h-auto"
          alt="Bosch Logo"
        />
        <img
          src={`${basePath}/images/header-2.svg`}
          className="w-full h-auto px-8 py-6"
        />
        {/* Results Container */}
        <div
          className="w-9/10 max-w-sm text-left bg-[url('/images/box-bg.svg')] 
    bg-contain bg-top bg-no-repeat min-h-[500px]  
    px-8 py-12 mx-auto"
        >
          <h2 className="font-bold text-lg text-center mb-4">计算结果</h2>
          <p className="mb-2 leading-relaxed">
            <strong>八字排盘: </strong>
            {lunarYear}年 {lunarMonth}月 {lunarDay}日 {lunarTime}时
          </p>

          <p className="mb-2 leading-relaxed">
            <strong>生肖:</strong> {zodiac}
          </p>

          {/* {lunarDate && (
          <p>
            <strong>农历日期:</strong> {lunarDate}
          </p>
        )} */}

          <p className="mb-2 leading-relaxed">
            <strong>五行:</strong>{" "}
            {typeof fiveElements === "string"
              ? fiveElements.split("|").map((element, index) => (
                  <span key={index} className="mr-2">
                    {element}
                  </span>
                ))
              : "未知"}
          </p>

          <p className="mb-2 leading-relaxed">
            <strong>五行个数:</strong> {elementSummary}
          </p>

          <p className="mb-2 leading-relaxed">
            <strong>五行是否所缺:</strong> {missingElementMessage}
          </p>

          {/* {dominantElementMessage && (
          <p>
            <strong>五行是否偏旺:</strong> {dominantElementMessage}
          </p>
        )} */}

          {/* {taiSui && (
          <p>
            <strong>太岁:</strong> {taiSui}
          </p>
        )} */}

          <div className="flex justify-center">
            <button
              onClick={() => router.push("/")}
              className="mt-12 w-45 max-w-[180px] bg-[#167543] text-white font-bold py-1 rounded-full hover:bg-[#0F512E] transition duration-200"
            >
              再测一次
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
