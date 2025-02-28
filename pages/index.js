import { useState } from "react";
import { useRouter } from "next/router";
import { Lunar, Solar } from "lunar-javascript";

export default function Home() {
  const [birthdate, setBirthdate] = useState("");
  const [birthtime, setBirthtime] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const { basePath } = useRouter();

  // **Mapping of Five Elements (五行)**
  const fiveElements = {
    木: ["甲", "乙", "寅", "卯"],
    火: ["丙", "丁", "巳", "午"],
    土: ["戊", "己", "丑", "辰", "未", "戌"],
    金: ["庚", "辛", "申", "酉"],
    水: ["壬", "癸", "子", "亥"],
  };

  // **Get Five Elements for each character**
  function getElement(ganOrZhi) {
    return (
      Object.keys(fiveElements).find((key) =>
        fiveElements[key].includes(ganOrZhi)
      ) || "未知"
    );
  }

  // **Calculate time pillar (时柱) based on Day Stem (日干)**
  const timePillarTable = {
    甲: [
      "甲子",
      "乙丑",
      "丙寅",
      "丁卯",
      "戊辰",
      "己巳",
      "庚午",
      "辛未",
      "壬申",
      "癸酉",
      "甲戌",
      "乙亥",
    ],
    乙: [
      "丙子",
      "丁丑",
      "戊寅",
      "己卯",
      "庚辰",
      "辛巳",
      "壬午",
      "癸未",
      "甲申",
      "乙酉",
      "丙戌",
      "丁亥",
    ],
    丙: [
      "戊子",
      "己丑",
      "庚寅",
      "辛卯",
      "壬辰",
      "癸巳",
      "甲午",
      "乙未",
      "丙申",
      "丁酉",
      "戊戌",
      "己亥",
    ],
    丁: [
      "庚子",
      "辛丑",
      "壬寅",
      "癸卯",
      "甲辰",
      "乙巳",
      "丙午",
      "丁未",
      "戊申",
      "己酉",
      "庚戌",
      "辛亥",
    ],
    戊: [
      "壬子",
      "癸丑",
      "甲寅",
      "乙卯",
      "丙辰",
      "丁巳",
      "戊午",
      "己未",
      "庚申",
      "辛酉",
      "壬戌",
      "癸亥",
    ],
    己: [
      "甲子",
      "乙丑",
      "丙寅",
      "丁卯",
      "戊辰",
      "己巳",
      "庚午",
      "辛未",
      "壬申",
      "癸酉",
      "甲戌",
      "乙亥",
    ],
    庚: [
      "丙子",
      "丁丑",
      "戊寅",
      "己卯",
      "庚辰",
      "辛巳",
      "壬午",
      "癸未",
      "甲申",
      "乙酉",
      "丙戌",
      "丁亥",
    ],
    辛: [
      "戊子",
      "己丑",
      "庚寅",
      "辛卯",
      "壬辰",
      "癸巳",
      "甲午",
      "乙未",
      "丙申",
      "丁酉",
      "戊戌",
      "己亥",
    ],
    壬: [
      "庚子",
      "辛丑",
      "壬寅",
      "癸卯",
      "甲辰",
      "乙巳",
      "丙午",
      "丁未",
      "戊申",
      "己酉",
      "庚戌",
      "辛亥",
    ],
    癸: [
      "壬子",
      "癸丑",
      "甲寅",
      "乙卯",
      "丙辰",
      "丁巳",
      "戊午",
      "己未",
      "庚申",
      "辛酉",
      "壬戌",
      "癸亥",
    ],
  };

  function getTimePillar(dayGan, birthtime) {
    const timePeriods = [
      "子",
      "丑",
      "寅",
      "卯",
      "辰",
      "巳",
      "午",
      "未",
      "申",
      "酉",
      "戌",
      "亥",
    ];
    const timeIndex = timePeriods.indexOf(birthtime.replace("时", ""));

    if (timeIndex === -1) return "未知";
    return timePillarTable[dayGan]?.[timeIndex] || "未知";
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (!birthdate || !birthtime) {
        alert("请输入完整的出生日期和时间");
        setLoading(false);
        return;
      }

      const [year, month, day] = birthdate.split("-").map(Number);
      const solar = Solar.fromYmd(year, month, day);
      const lunar = Lunar.fromSolar(solar);
      const bazi = lunar.getEightChar();
      const zodiac = lunar.getYearShengXiao();
      const dayGan = bazi.getDayGan();
      const lunarTime = getTimePillar(dayGan, birthtime);

      let elementCount = { 金: 0, 木: 0, 水: 0, 火: 0, 土: 0 };
      const elements = [
        { gan: bazi.getYearGan(), zhi: bazi.getYearZhi() },
        { gan: bazi.getMonthGan(), zhi: bazi.getMonthZhi() },
        { gan: bazi.getDayGan(), zhi: bazi.getDayZhi() },
        { gan: lunarTime.charAt(0), zhi: lunarTime.charAt(1) }, // **Correct 时柱 extraction**
      ];

      elements.forEach(({ gan, zhi }) => {
        elementCount[getElement(gan)]++;
        elementCount[getElement(zhi)]++;
      });

      const elementSummary = Object.entries(elementCount)
        .map(([key, value]) => `${value}个${key}`)
        .join("，");

      const missingElements = Object.entries(elementCount)
        .filter(([_, value]) => value === 0)
        .map(([key]) => key)
        .join("、");

      const missingElementMessage = missingElements
        ? `您的五行缺${missingElements}`
        : "您的八字五行皆全，五行不缺。";

      router.push({
        pathname: "/result",
        query: {
          lunarYear: bazi.getYear(),
          lunarMonth: bazi.getMonth(),
          lunarDay: bazi.getDay(),
          lunarTime,
          zodiac,
          elementSummary,
          missingElementMessage,
          fiveElements: elements
            .map(({ gan, zhi }) => `${getElement(gan)}${getElement(zhi)}`)
            .join(" | "), // **Fixed 五行显示**
        },
      });
    } catch (error) {
      console.error("Error calculating Bazi:", error);
      alert("计算失败，请检查输入格式");
    }
    setLoading(false);
  };

  return (
    <div className="bg-custom min-h-screen flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-[420px] mx-auto">
        {/* Logo */}
        <img
          src={`${basePath}/images/bosch-logo.svg`}
          className="absolute top-6 left-6 w-20 h-auto"
          alt="Bosch Logo"
        />
        <img
          src={`${basePath}/images/header.png`}
          className="w-full h-auto px-4 mb-12"
        />

        {/* Form Container */}
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-sm px-2 space-y-4"
        >
          <div className="flex items-center bg-white rounded-[12px] px-4 py-3 relative w-full">
            <span className="text-black font-bold whitespace-nowrap">
              出生日期
            </span>
            <span className="mx-2 h-6 w-[1px] bg-gray-400"></span>{" "}
            {/* Vertical divider */}
            {/* Date Input */}
            <div
              className="flex items-center justify-between w-full cursor-pointer px-2"
              onClick={() =>
                document.getElementById("customDateInput").showPicker()
              }
            >
              <span className="text-gray-800">
                {birthdate ? birthdate : "请选择日期"}
              </span>
              {/* Arrow Icon */}
              <img
                src={`${basePath}/images/dropdown-icon.svg`}
                alt="Dropdown Arrow"
                className="absolute right-4 h-2 w-2 text-gray-500"
              />
            </div>
            <input
              id="customDateInput"
              type="date"
              lang="zh-CN"
              value={birthdate}
              onChange={(e) => setBirthdate(e.target.value)}
              required
              className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
            />
          </div>

          {/* 出生时辰 */}
          <div className="flex items-center bg-white rounded-[12px] px-4 py-3 relative w-full">
            <span className="text-black font-bold whitespace-nowrap">
              出生时辰
            </span>
            <span className="mx-2 h-6 w-[1px] bg-gray-400"></span>
            {/* Vertical divider */}

            {/* Clickable Wrapper for Text + Arrow */}
            <div
              className="flex items-center justify-between w-full cursor-pointer px-2"
              onClick={() => document.getElementById("customTimeInput").click()}
            >
              <span className="text-gray-800">
                {birthtime ? birthtime : "请选择时辰"}
              </span>
              {/* Smaller Arrow Icon */}
              <img
                src={`${basePath}/images/dropdown-icon.svg`}
                alt="Dropdown Arrow"
                className="absolute right-4 h-2 w-2 text-gray-500"
              />
            </div>
            <select
              id="customTimeInput"
              value={birthtime}
              onChange={(e) => setBirthtime(e.target.value)}
              required
              className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
            >
              <option value="">请选择出生时辰</option>
              <option value="子时">子时 23:00-00:59</option>
              <option value="丑时">丑时 01:00-02:59</option>
              <option value="寅时">寅时 03:00-04:59</option>
              <option value="卯时">卯时 05:00-06:59</option>
              <option value="辰时">辰时 07:00-08:59</option>
              <option value="巳时">巳时 09:00-10:59</option>
              <option value="午时">午时 11:00-12:59</option>
              <option value="未时">未时 13:00-14:59</option>
              <option value="申时">申时 15:00-16:59</option>
              <option value="酉时">酉时 17:00-18:59</option>
              <option value="戌时">戌时 19:00-20:59</option>
              <option value="亥时">亥时 21:00-22:59</option>
            </select>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center">
            <button
              type="submit"
              className="w-45 max-w-[180px] bg-white/60 text-gray-800 font-bold py-1 rounded-full hover:bg-gray-400/60 transition duration-200 mt-12 mb-16"
            >
              提交生成结果
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
