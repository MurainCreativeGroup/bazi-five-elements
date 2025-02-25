"use client";

import { useState } from "react";
import { Lunar, Solar } from "lunar-javascript";
import { QRCode } from "react-qrcode-logo";

export default function Home() {
  const [name, setName] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [birthtime, setBirthtime] = useState("");
  const [gender, setGender] = useState("male");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const getElement = (gan, zhi) => {
    const elements = {
      木: ["甲", "乙", "寅", "卯"],
      火: ["丙", "丁", "巳", "午"],
      土: ["戊", "己", "丑", "辰", "未", "戌"],
      金: ["庚", "辛", "申", "酉"],
      水: ["壬", "癸", "子", "亥"],
    };

    let ganElement =
      Object.keys(elements).find((key) => elements[key].includes(gan)) ||
      "未知";
    let zhiElement =
      Object.keys(elements).find((key) => elements[key].includes(zhi)) ||
      "未知";

    return { ganElement, zhiElement };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (!birthdate || !birthtime) {
        setResult("请输入完整的出生日期和时间");
        setLoading(false);
        return;
      }

      const [year, month, day] = birthdate.split("-").map(Number);
      const [hour, minute] = birthtime.split(":").map(Number);
      const solar = Solar.fromYmdHms(year, month, day, hour, minute, 0);
      const lunar = Lunar.fromSolar(solar);
      const bazi = lunar.getEightChar();
      const zodiac = lunar.getYearShengXiao();
      const lunarYear = bazi.getYear();
      const lunarMonth = bazi.getMonth();
      const lunarDay = bazi.getDay();
      const lunarTime = bazi.getTime();
      const naYin = `${bazi.getYearNaYin()}, ${bazi.getMonthNaYin()}, ${bazi.getDayNaYin()}, ${bazi.getTimeNaYin()}`;
      const taiSui = `${zodiac}太岁`;

      let elementCount = { 金: 0, 木: 0, 水: 0, 火: 0, 土: 0 };
      const elements = [
        getElement(bazi.getYearGan(), bazi.getYearZhi()),
        getElement(bazi.getMonthGan(), bazi.getMonthZhi()),
        getElement(bazi.getDayGan(), bazi.getDayZhi()),
        getElement(bazi.getTimeGan(), bazi.getTimeZhi()),
      ];

      elements.forEach(({ ganElement, zhiElement }) => {
        if (elementCount[ganElement] !== undefined) elementCount[ganElement]++;
        if (elementCount[zhiElement] !== undefined) elementCount[zhiElement]++;
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

      const dominantElement = Object.entries(elementCount)
        .filter(([_, value]) => value >= 4)
        .map(([key]) => key)
        .join("、");

      const dominantElementMessage = dominantElement
        ? `您的八字五行${dominantElement}偏旺，根据八字中和的原则，五行偏旺，应制之泄之。`
        : "根据八字中和的原则，五行偏旺，应制之泄之，您的八字中没有五行偏旺的情况。";

      setResult(
        `<div style='text-align: left;'>` +
          `八字排盘:<br>年柱: ${lunarYear}<br>月柱: ${lunarMonth}<br>日柱: ${lunarDay}<br>时柱: ${lunarTime}<br><br>` +
          `生肖: ${zodiac}<br>` +
          `纳音: ${naYin}<br>` +
          `五行: ${elements
            .map(({ ganElement, zhiElement }) => `${ganElement} ${zhiElement}`)
            .join(" | ")}<br>` +
          `五行个数: ${elementSummary}<br>` +
          `五行是否所缺: ${missingElementMessage}<br>` +
          `五行是否偏旺: ${dominantElementMessage}<br>` +
          `太岁: ${taiSui}<br>` +
          `</div>`
      );
    } catch (error) {
      console.error("Error calculating Bazi:", error);
      setResult("计算失败，请检查输入格式");
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6 text-center">
      <h1 className="text-2xl font-bold text-blue-600 mb-4">
        📜 请输入您的信息
      </h1>
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm bg-white p-6 rounded-lg shadow-md"
      >
        <label className="block text-left mb-2">出生日期:</label>
        <input
          type="date"
          value={birthdate}
          onChange={(e) => setBirthdate(e.target.value)}
          required
          className="w-full p-2 border rounded mb-4"
        />

        <label className="block text-left mb-2">出生时间:</label>
        <input
          type="time"
          value={birthtime}
          onChange={(e) => setBirthtime(e.target.value)}
          required
          className="w-full p-2 border rounded mb-4"
        />

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-700"
        >
          {loading ? "计算中..." : "获取八字排盘"}
        </button>
      </form>

      {result && (
        <div
          className="mt-6 bg-white p-4 rounded-lg shadow-md w-full max-w-sm"
          dangerouslySetInnerHTML={{ __html: result }}
        />
      )}
    </div>
  );
}
