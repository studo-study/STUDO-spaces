"use client";
import PopupBackdrop from "@/components/ui/design_system/popup/PopupBackdrop";
import BasePopup from "@/components/ui/design_system/popup/BasePopup";
import { SetStateAction, useEffect, useMemo, useRef, useState } from "react";
import {
  CheckCheck,
  Clock,
  ClockFading,
  Flame,
  Info,
  RotateCw,
  Target,
} from "lucide-react";
import { useTranslations } from "next-intl";
import Chart from "chart.js/auto";
import { SegmentedControls } from "@/components/ui/design_system/segmentedcontrols/SegmentedControls";
import { useStudosetStore } from "@/store/slices/studoset/studosetStore";
import { Card, SessionCard } from "@/types/types";

const cardStats = (s: SessionCard | undefined) => {
  const attempts = s?.totalAttempts ?? 0;
  const correct = s?.totalCorrect ?? 0;
  return {
    attempts,
    wrong: Math.max(0, attempts - correct),
    accuracy: attempts > 0 ? Math.round((correct / attempts) * 100) : 0,
    avgSec: attempts > 0 ? (s?.responseSumMs ?? 0) / attempts / 1000 : 0,
    mastered: s?.mastered ?? false,
  };
};

interface ListContentProps {
  cards: {
    card: Card;
    session: SessionCard | undefined;
  }[];
}

const GraphContent: React.FC<ListContentProps> = ({ cards }) => {
  const t = useTranslations("studoset.stats");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);
  const session = useStudosetStore((s) => s.studosetSession);

  const general = useMemo(() => {
    const attempts = session?.totalAttempts ?? 0;
    const correct = session?.totalCorrect ?? 0;
    return {
      accuracy: attempts > 0 ? Math.round((correct / attempts) * 100) : 0,
      avgSec: ((session?.averageResponseTime ?? 0) / 1000).toFixed(1),
      streak: session?.longestFocusStreak ?? 0,
      completions: session?.completions ?? 0,
      durationMin: session?.durationMin ?? 0,
      mastered: cards.filter((c) => c.session?.mastered).length,
      total: cards.length,
    };
  }, [session, cards]);

  // kaarten op volgorde; elk punt = nauwkeurigheid van die kaart
  const points = useMemo(
    () =>
      cards
        .map((c) => ({
          number: c.session?.number ?? c.card.number,
          term: c.card.term,
          ...cardStats(c.session),
        }))
        .filter((c) => c.attempts > 0)
        .sort((a, b) => a.number - b.number)
        .map((c) => ({
          term: c.term,
          y: c.accuracy,
          time: Number(c.avgSec.toFixed(1)),
        })),
    [cards],
  );

  useEffect(() => {
    if (!canvasRef.current || points.length === 0) return;
    const pts = points;

    // externe tooltip in BaseTooltip-stijl (design-system-consistentie)
    const showTooltip = (args: {
      chart: Chart;
      tooltip: {
        opacity: number;
        caretX: number;
        caretY: number;
        dataPoints?: { dataIndex: number }[];
      };
    }) => {
      const { chart, tooltip } = args;
      let el = tooltipRef.current;
      if (!el) {
        el = document.createElement("div");
        el.className =
          "fixed z-[100000] whitespace-nowrap rounded-full border border-studoborder/30 " +
          "bg-zinc-900 px-3 py-1.5 text-sm font-medium text-white shadow-lg " +
          "pointer-events-none backdrop-blur-sm transition-opacity duration-150";
        el.style.transform = "translate(-50%, -100%)";
        document.body.appendChild(el);
        tooltipRef.current = el;
      }
      if (tooltip.opacity === 0) {
        el.style.opacity = "0";
        return;
      }
      const p = pts[tooltip.dataPoints?.[0]?.dataIndex ?? 0];
      el.textContent = `${p.term} · ${p.y}% · ${p.time}s`;
      const rect = chart.canvas.getBoundingClientRect();
      el.style.opacity = "1";
      el.style.left = `${rect.left + tooltip.caretX}px`;
      el.style.top = `${rect.top + tooltip.caretY - 12}px`;
    };

    const chart = new Chart(canvasRef.current, {
      type: "line",
      data: {
        labels: pts.map((_, i) => i + 1),
        datasets: [
          {
            data: pts.map((p) => p.y),
            borderColor: "#4f83ff",
            borderWidth: 3,
            tension: 0.4,
            fill: true,
            backgroundColor: (ctx) => {
              const { chart } = ctx;
              const { ctx: c, chartArea } = chart;
              if (!chartArea) return "transparent";
              const g = c.createLinearGradient(
                0,
                chartArea.top,
                0,
                chartArea.bottom,
              );
              g.addColorStop(0, "rgba(79,131,255,0.35)");
              g.addColorStop(1, "rgba(79,131,255,0)");
              return g;
            },
            pointRadius: 0,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: "#4f83ff",
            pointHoverBorderColor: "#ffffff",
            pointHoverBorderWidth: 2,
            pointHitRadius: 16,
          },
        ],
      },
      options: {
        maintainAspectRatio: false,
        layout: { padding: { top: 12, right: 8, bottom: 2, left: 2 } },
        interaction: { mode: "index", intersect: false },
        plugins: {
          legend: { display: false },
          tooltip: { enabled: false, external: showTooltip },
        },
        scales: {
          x: {
            border: { display: false },
            grid: { display: false },
            ticks: {
              color: "#94a3b8",
              font: { size: 10 },
              maxTicksLimit: 6,
              padding: 6,
            },
          },
          y: {
            min: 0,
            max: 105,
            border: { display: false },
            grid: { color: "rgba(148,163,184,0.10)", drawTicks: false },
            ticks: {
              color: "#94a3b8",
              font: { size: 10 },
              stepSize: 25,
              padding: 8,
              // enkel 0-100 tonen; 105 = kop-ruimte zodat de curve niet clipt
              callback: (v) => (Number(v) <= 100 ? `${v}%` : ""),
            },
          },
        },
      },
    });
    return () => {
      chart.destroy();
      tooltipRef.current?.remove();
      tooltipRef.current = null;
    };
  }, [points]);

  return (
    <div className="w-full flex-1 min-h-0">
      <div
        className={
          "flex flex-row gap-3 overflow-y-scroll scroll-hidden h-15 mb-5 text-studodarkblue dark:text-white"
        }
      >
        <div
          className={
            "border p-2 min-w-1/4 flex flex-col border-studoborder/10 bg-studogrey/5 rounded-2xl"
          }
        >
          <span
            className={
              "text-[12px] font-georgia dark:text-studogrey flex-row flex justify-between items-start"
            }
          >
            {t("accuracy")}
            <Target size={18} strokeWidth={1} />
          </span>
          <span className={"font-bold text-lg dark:text-white text-studoblue"}>
            {session?.accuracy}%
          </span>
        </div>

        <div
          className={
            "min-w-1/4 border p-2 flex flex-col border-studoborder/10 bg-studogrey/5 rounded-2xl"
          }
        >
          <span
            className={
              "text-[12px] font-georgia dark:text-studogrey flex-row flex justify-between items-start"
            }
          >
            {t("avg_time")}
            <ClockFading size={18} strokeWidth={1.5} />
          </span>
          <span className={"font-bold text-lg dark:text-white text-studoblue"}>
            {(session?.averageResponseTime ?? 0) / 1000}s
          </span>
        </div>
        <div
          className={
            "min-w-1/4 border p-2 flex flex-col border-studoborder/10 bg-studogrey/5 rounded-2xl"
          }
        >
          <span
            className={
              "text-[12px] font-georgia dark:text-studogrey  flex-row flex justify-between items-start"
            }
          >
            {t("longest_streak")}
            <Flame size={18} strokeWidth={1} />
          </span>
          <span className={"font-bold text-lg dark:text-white text-studoblue"}>
            {session?.longestFocusStreak}
          </span>
        </div>
        <div
          className={
            "min-w-1/4 border p-2 flex flex-col border-studoborder/10 bg-studogrey/5 rounded-2xl"
          }
        >
          <span
            className={
              "text-[12px] font-georgia dark:text-studogrey flex-row flex justify-between items-start"
            }
          >
            {t("completions")}
            <RotateCw size={15} strokeWidth={2} />
          </span>
          <span className={"font-bold text-lg dark:text-white text-studoblue"}>
            {session?.completions}
          </span>
        </div>
        <div
          className={
            "min-w-1/4 border p-2 flex flex-col border-studoborder/10 bg-studogrey/5 rounded-2xl"
          }
        >
          <span
            className={
              "text-[12px] font-georgia dark:text-studogrey flex-row flex justify-between items-start"
            }
          >
            {t("time_studied")}
            <Clock size={18} strokeWidth={1} />
          </span>
          <span className={"font-bold text-lg dark:text-white text-studoblue"}>
            {general.durationMin} {t("min_unit")}
          </span>
        </div>
        <div
          className={
            "min-w-1/4 border p-2 flex flex-col border-studoborder/10 bg-studogrey/5 rounded-2xl"
          }
        >
          <span
            className={
              "text-[12px] font-georgia dark:text-studogrey flex-row flex justify-between items-start"
            }
          >
            {t("learned")}
            <CheckCheck size={18} strokeWidth={1} />
          </span>
          <span className={"font-bold text-lg dark:text-white text-studoblue"}>
            {general.mastered}
          </span>
        </div>
      </div>
      {points.length > 0 ? (
        <div className="w-full h-full min-h-0 cursor-pointer flex-1">
          <canvas ref={canvasRef} className={"h-full max-h-95 w-full"} />
        </div>
      ) : (
        <div className="w-full h-full flex items-center justify-center text-studogrey text-sm">
          {t("no_data")}
        </div>
      )}
    </div>
  );
};

const PopUpContent = () => {
  const Cards = useStudosetStore((state) => state.studosetCards);
  const t = useTranslations("studoset.stats");
  return (
    <div className={"flex-1 min-h-0 w-full flex flex-col"}>
      <div className={"w-full flex items-center justify-between mb-6"}>
        <span className={"dark:text-white font-georgia font-bold text-xl"}>
          {t("title")}:
        </span>
      </div>
      <GraphContent cards={Cards} />
    </div>
  );
};

interface ProgresssPopupProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<SetStateAction<boolean>>;
}
const ProgressPopUp: React.FC<ProgresssPopupProps> = (props) => {
  const { isOpen, setIsOpen } = props;
  const popupRef = useRef<HTMLDivElement>(null);
  return (
    <PopupBackdrop isOpen={isOpen} setIsOpen={setIsOpen}>
      <BasePopup
        popupRef={popupRef}
        isOpen={isOpen}
        className={"min-w-200 max-w-200 max-h-150 h-150 w-full flex p-5"}
      >
        <PopUpContent />
      </BasePopup>
    </PopupBackdrop>
  );
};

ProgressPopUp.displayName = "ProgressPopUp";

const ProgressPopUpTrigger = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  return (
    <>
      <button
        type={"button"}
        onClick={() => setIsOpen((prev) => !prev)}
        className={
          "p-1 rounded-full hover:bg-studogrey/30 transition-colors duration-300 cursor-pointer border-transparent border hover:border-studoborder/30"
        }
      >
        <Info size={20} />
      </button>
      <ProgressPopUp isOpen={isOpen} setIsOpen={setIsOpen} />
    </>
  );
};

ProgressPopUpTrigger.displayName = "ProgressPopUpTrigger";
export default ProgressPopUpTrigger;
