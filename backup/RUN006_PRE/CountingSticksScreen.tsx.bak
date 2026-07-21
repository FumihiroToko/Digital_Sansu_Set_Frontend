import { useEffect, useMemo, useState } from "react";
import { Layer, Rect, Stage, Text } from "react-konva";

type StickColor = "red" | "blue" | "yellow" | "green";

type ArrangementMode =
  | "free"
  | "horizontal"
  | "vertical"
  | "groups-of-five"
  | "groups-of-ten";

type CountingStick = {
  id: number;
  x: number;
  y: number;
  color: StickColor;
};

type StageSize = {
  width: number;
  height: number;
};

type CountingSticksScreenProps = {
  onBack: () => void;
};

const MAX_STICKS = 30;
const INITIAL_STICK_COUNT = 10;

const STICK_COLORS: Record<StickColor, string> = {
  red: "#ef4444",
  blue: "#3b82f6",
  yellow: "#eab308",
  green: "#22c55e",
};

const STICK_LABELS: Record<StickColor, string> = {
  red: "赤",
  blue: "青",
  yellow: "黄",
  green: "緑",
};

function getStickSize(width: number): {
  stickWidth: number;
  stickHeight: number;
} {
  if (width < 480) {
    return {
      stickWidth: 18,
      stickHeight: 92,
    };
  }

  if (width < 768) {
    return {
      stickWidth: 21,
      stickHeight: 108,
    };
  }

  return {
    stickWidth: 24,
    stickHeight: 124,
  };
}

function createInitialSticks(stageWidth = 900): CountingStick[] {
  const safeWidth = Math.max(stageWidth, 320);
  const { stickWidth, stickHeight } = getStickSize(safeWidth);
  const gap = stickWidth + 18;
  const columns = Math.min(
    10,
    Math.max(5, Math.floor((safeWidth - 60) / gap)),
  );

  const layoutWidth = (columns - 1) * gap + stickWidth;
  const startX = Math.max(24, (safeWidth - layoutWidth) / 2);
  const startY = 150;

  return Array.from({ length: INITIAL_STICK_COUNT }, (_, index) => ({
    id: index + 1,
    x: startX + (index % columns) * gap,
    y: startY + Math.floor(index / columns) * (stickHeight + 24),
    color: index < 5 ? "red" : "blue",
  }));
}

function clampStickPosition(
  x: number,
  y: number,
  size: StageSize,
): { x: number; y: number } {
  const { stickWidth, stickHeight } = getStickSize(size.width);

  const minX = 18;
  const maxX = Math.max(minX, size.width - stickWidth - 18);
  const minY = 105;
  const maxY = Math.max(minY, size.height - stickHeight - 18);

  return {
    x: Math.min(Math.max(x, minX), maxX),
    y: Math.min(Math.max(y, minY), maxY),
  };
}

export default function CountingSticksScreen({
  onBack,
}: CountingSticksScreenProps) {
  const [sticks, setSticks] = useState<CountingStick[]>(() =>
    createInitialSticks(),
  );

  const [size, setSize] = useState<StageSize>({
    width: 0,
    height: 0,
  });

  const [selectedColor, setSelectedColor] =
    useState<StickColor>("red");

  const [arrangementMode, setArrangementMode] =
    useState<ArrangementMode>("free");

  const [soundEnabled, setSoundEnabled] = useState(true);

  const [message, setMessage] = useState(
    "かぞえぼうを動かして、数やまとまりを作ってみよう。",
  );

  const { stickWidth, stickHeight } = useMemo(
    () => getStickSize(size.width),
    [size.width],
  );

  const colorCounts = useMemo(() => {
    return sticks.reduce<Record<StickColor, number>>(
      (counts, stick) => {
        counts[stick.color] += 1;
        return counts;
      },
      {
        red: 0,
        blue: 0,
        yellow: 0,
        green: 0,
      },
    );
  }, [sticks]);

  useEffect(() => {
    const updateSize = () => {
      const nextSize = {
        width: window.innerWidth,
        height: Math.max(window.innerHeight - 270, 500),
      };

      setSize(nextSize);

      setSticks((current) =>
        current.map((stick) => {
          const safePosition = clampStickPosition(
            stick.x,
            stick.y,
            nextSize,
          );

          return {
            ...stick,
            x: safePosition.x,
            y: safePosition.y,
          };
        }),
      );
    };

    updateSize();
    window.addEventListener("resize", updateSize);

    return () => {
      window.removeEventListener("resize", updateSize);
    };
  }, []);

  const playSound = (
    frequency = 520,
    duration = 0.09,
    volume = 0.05,
  ) => {
    if (!soundEnabled) {
      return;
    }

    try {
      type AudioWindow = Window &
        typeof globalThis & {
          webkitAudioContext?: typeof AudioContext;
        };

      const audioWindow = window as AudioWindow;
      const AudioContextClass =
        audioWindow.AudioContext ?? audioWindow.webkitAudioContext;

      if (!AudioContextClass) {
        return;
      }

      const audioContext = new AudioContextClass();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(
        frequency,
        audioContext.currentTime,
      );

      gainNode.gain.setValueAtTime(volume, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(
        0.001,
        audioContext.currentTime + duration,
      );

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.start();
      oscillator.stop(audioContext.currentTime + duration);

      oscillator.addEventListener("ended", () => {
        void audioContext.close();
      });
    } catch {
      // 音声機能を利用できない環境でも教材操作は継続する。
    }
  };

  const playSuccessSound = () => {
    playSound(523, 0.1, 0.05);

    window.setTimeout(() => {
      playSound(659, 0.1, 0.05);
    }, 100);

    window.setTimeout(() => {
      playSound(784, 0.14, 0.06);
    }, 200);
  };

  const addStick = () => {
    if (sticks.length >= MAX_STICKS) {
      setMessage(`かぞえぼうは${MAX_STICKS}本まで追加できます。`);
      playSound(240, 0.16, 0.05);
      return;
    }

    const nextId =
      sticks.length === 0
        ? 1
        : Math.max(...sticks.map((stick) => stick.id)) + 1;

    const width = size.width || window.innerWidth;
    const height = size.height || 520;
    const nextSize = getStickSize(width);

    const columns = Math.max(
      1,
      Math.floor((width - 50) / (nextSize.stickWidth + 24)),
    );

    const index = sticks.length;

    const targetX =
      24 + (index % columns) * (nextSize.stickWidth + 24);

    const targetY =
      145 +
      Math.floor(index / columns) *
        (nextSize.stickHeight + 24);

    const safePosition = clampStickPosition(targetX, targetY, {
      width,
      height,
    });

    setSticks((current) => [
      ...current,
      {
        id: nextId,
        x: safePosition.x,
        y: safePosition.y,
        color: selectedColor,
      },
    ]);

    setArrangementMode("free");
    setMessage(
      `${STICK_LABELS[selectedColor]}のかぞえぼうを1本追加しました。`,
    );

    const frequencies: Record<StickColor, number> = {
      red: 620,
      blue: 470,
      yellow: 700,
      green: 560,
    };

    playSound(frequencies[selectedColor], 0.1, 0.06);
  };

  const removeStick = () => {
    if (sticks.length === 0) {
      setMessage("減らすことができるかぞえぼうがありません。");
      playSound(240, 0.16, 0.05);
      return;
    }

    setSticks((current) => current.slice(0, -1));
    setArrangementMode("free");
    setMessage("かぞえぼうを1本減らしました。");
    playSound(340, 0.08, 0.05);
  };

  const clearSticks = () => {
    setSticks([]);
    setArrangementMode("free");
    setMessage("かぞえぼうを全部片づけました。");
    playSound(300, 0.1, 0.05);
  };

  const resetSticks = () => {
    setSticks(createInitialSticks(size.width || window.innerWidth));
    setSelectedColor("red");
    setArrangementMode("free");
    setMessage("かぞえぼうを、はじめの状態にもどしました。");
    playSuccessSound();
  };

  const arrangeHorizontal = () => {
    if (sticks.length === 0) {
      setMessage("並べるかぞえぼうがありません。");
      playSound(240, 0.16, 0.05);
      return;
    }

    const width = size.width || window.innerWidth;
    const height = size.height || 520;
    const currentSize = getStickSize(width);

    const gap = currentSize.stickWidth + 16;
    const availableWidth = Math.max(width - 48, gap);

    const columns = Math.max(
      1,
      Math.min(sticks.length, Math.floor(availableWidth / gap)),
    );

    const rowWidth =
      (columns - 1) * gap + currentSize.stickWidth;

    const startX = Math.max(24, (width - rowWidth) / 2);
    const rowGap = currentSize.stickHeight + 30;

    setSticks((current) =>
      current.map((stick, index) => {
        const targetX = startX + (index % columns) * gap;
        const targetY =
          145 + Math.floor(index / columns) * rowGap;

        const safePosition = clampStickPosition(
          targetX,
          targetY,
          {
            width,
            height,
          },
        );

        return {
          ...stick,
          x: safePosition.x,
          y: safePosition.y,
        };
      }),
    );

    setArrangementMode("horizontal");
    setMessage("かぞえぼうを横に並べました。");
    playSuccessSound();
  };

  const arrangeVertical = () => {
    if (sticks.length === 0) {
      setMessage("並べるかぞえぼうがありません。");
      playSound(240, 0.16, 0.05);
      return;
    }

    const width = size.width || window.innerWidth;
    const height = size.height || 520;
    const currentSize = getStickSize(width);

    const rowGap = currentSize.stickHeight + 16;
    const availableHeight = Math.max(height - 140, rowGap);

    const rows = Math.max(
      1,
      Math.min(sticks.length, Math.floor(availableHeight / rowGap)),
    );

    const columnGap = currentSize.stickWidth + 38;
    const columns = Math.ceil(sticks.length / rows);
    const totalWidth =
      (columns - 1) * columnGap + currentSize.stickWidth;

    const startX = Math.max(24, (width - totalWidth) / 2);
    const startY = 125;

    setSticks((current) =>
      current.map((stick, index) => {
        const columnIndex = Math.floor(index / rows);
        const rowIndex = index % rows;

        const targetX =
          startX + columnIndex * columnGap;

        const targetY =
          startY + rowIndex * rowGap;

        const safePosition = clampStickPosition(
          targetX,
          targetY,
          {
            width,
            height,
          },
        );

        return {
          ...stick,
          x: safePosition.x,
          y: safePosition.y,
        };
      }),
    );

    setArrangementMode("vertical");
    setMessage("かぞえぼうを縦に並べました。");
    playSuccessSound();
  };


  const arrangeGroups = (groupSize: 5 | 10) => {
    if (sticks.length < groupSize) {
      setMessage(
        `${groupSize}のまとまりには、かぞえぼうが${groupSize}本以上必要です。`,
      );
      playSound(240, 0.16, 0.05);
      return;
    }

    const width = size.width || window.innerWidth;
    const height = size.height || 520;
    const currentSize = getStickSize(width);

    const groupCount = Math.ceil(sticks.length / groupSize);

    /*
     * 1グループ内の数え棒配置。
     * 10本は狭い画面では5本×2行にする。
     */
    const stickColumns =
      width < 720 && groupSize === 10
        ? 5
        : groupSize;

    const stickRows = Math.ceil(groupSize / stickColumns);

    const horizontalMargin = 24;
    const topY = 110;
    const bottomMargin = 30;

    const preferredStickHorizontalGap =
      currentSize.stickWidth + 13;

    const preferredStickVerticalGap =
      currentSize.stickHeight + 16;

    /*
     * 画面幅に合わせて、1グループ内の横間隔を縮小する。
     */
    const maximumSingleGroupWidth = Math.max(
      currentSize.stickWidth,
      width - horizontalMargin * 2,
    );

    const calculatedStickHorizontalGap =
      stickColumns <= 1
        ? preferredStickHorizontalGap
        : (
            maximumSingleGroupWidth -
            currentSize.stickWidth
          ) /
          (stickColumns - 1);

    const stickHorizontalGap = Math.max(
      currentSize.stickWidth + 4,
      Math.min(
        preferredStickHorizontalGap,
        calculatedStickHorizontalGap,
      ),
    );

    const groupWidth =
      (stickColumns - 1) * stickHorizontalGap +
      currentSize.stickWidth;

    const groupHeight =
      (stickRows - 1) * preferredStickVerticalGap +
      currentSize.stickHeight;

    /*
     * 画面の高さから、重ならずに配置できる段数を求める。
     * 収まらないグループは横方向の次の列へ送る。
     */
    const availableHeight = Math.max(
      groupHeight,
      height - topY - bottomMargin,
    );

    const preferredGroupRowGap = 34;

    const maximumGroupRows = Math.max(
      1,
      Math.floor(
        (
          availableHeight +
          preferredGroupRowGap
        ) /
        (
          groupHeight +
          preferredGroupRowGap
        ),
      ),
    );

    let groupColumns = Math.max(
      1,
      Math.ceil(groupCount / maximumGroupRows),
    );

    /*
     * 横幅に収まらない場合は、グループ列数を減らす。
     * 残りは縦方向へ回す。
     */
    const preferredGroupColumnGap = 54;
    const availableWidth = Math.max(
      groupWidth,
      width - horizontalMargin * 2,
    );

    const maximumGroupColumnsByWidth = Math.max(
      1,
      Math.floor(
        (
          availableWidth +
          preferredGroupColumnGap
        ) /
        (
          groupWidth +
          preferredGroupColumnGap
        ),
      ),
    );

    groupColumns = Math.min(
      groupColumns,
      maximumGroupColumnsByWidth,
    );

    const groupRows = Math.ceil(
      groupCount / groupColumns,
    );

    /*
     * 列間隔を利用可能幅から逆算する。
     */
    const calculatedGroupColumnGap =
      groupColumns <= 1
        ? 0
        : (
            availableWidth -
            groupColumns * groupWidth
          ) /
          (groupColumns - 1);

    const groupColumnGap =
      groupColumns <= 1
        ? 0
        : Math.max(
            20,
            Math.min(
              preferredGroupColumnGap,
              calculatedGroupColumnGap,
            ),
          );

    const totalLayoutWidth =
      groupColumns * groupWidth +
      Math.max(0, groupColumns - 1) *
        groupColumnGap;

    const startX = Math.max(
      horizontalMargin,
      (width - totalLayoutWidth) / 2,
    );

    /*
     * 行間隔も利用可能高さから逆算する。
     * 棒の高さより小さくなる場合は、複数列配置を優先する。
     */
    const calculatedGroupRowGap =
      groupRows <= 1
        ? 0
        : (
            availableHeight -
            groupRows * groupHeight
          ) /
          (groupRows - 1);

    const groupRowGap =
      groupRows <= 1
        ? 0
        : Math.max(
            16,
            Math.min(
              preferredGroupRowGap,
              calculatedGroupRowGap,
            ),
          );

    setSticks((current) =>
      current.map((stick, index) => {
        const groupIndex = Math.floor(index / groupSize);
        const indexInGroup = index % groupSize;

        /*
         * 左から右へグループ列を作り、
         * 各列の中では上から下へ配置する。
         */
        const groupColumnIndex =
          groupIndex % groupColumns;

        const groupRowIndex = Math.floor(
          groupIndex / groupColumns,
        );

        const stickColumnIndex =
          indexInGroup % stickColumns;

        const stickRowIndex = Math.floor(
          indexInGroup / stickColumns,
        );

        const targetX =
          startX +
          groupColumnIndex *
            (groupWidth + groupColumnGap) +
          stickColumnIndex * stickHorizontalGap;

        const targetY =
          topY +
          groupRowIndex *
            (groupHeight + groupRowGap) +
          stickRowIndex *
            preferredStickVerticalGap;

        return {
          ...stick,
          x: targetX,
          y: targetY,
        };
      }),
    );

    const completeGroups = Math.floor(
      sticks.length / groupSize,
    );

    const remainder = sticks.length % groupSize;

    if (remainder === 0) {
      setMessage(
        `${groupSize}本のまとまりを${completeGroups}つ作りました。`,
      );
    } else {
      setMessage(
        `${groupSize}本のまとまりを${completeGroups}つ作り、のこりは${remainder}本です。`,
      );
    }

    setArrangementMode(
      groupSize === 5
        ? "groups-of-five"
        : "groups-of-ten",
    );

    playSuccessSound();
  };

  const handleDragEnd = (
    stickId: number,
    newX: number,
    newY: number,
  ) => {
    const safePosition = clampStickPosition(newX, newY, size);

    setSticks((current) =>
      current.map((stick) =>
        stick.id === stickId
          ? {
              ...stick,
              x: safePosition.x,
              y: safePosition.y,
            }
          : stick,
      ),
    );

    setArrangementMode("free");
    setMessage("かぞえぼうを動かしました。");
    playSound(430, 0.05, 0.035);
  };

  return (
    <main className="min-h-screen bg-[#f7fbff] text-slate-900">
      <header className="border-b border-amber-100 bg-white/95 px-3 py-3 shadow-sm backdrop-blur-md sm:px-5 sm:py-4">
        <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-4">
          <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <p className="text-xs font-bold tracking-[0.25em] text-amber-600">
                DIGITAL SANSU SET
              </p>

              <h1 className="text-2xl font-black text-slate-900 sm:text-3xl">
                かぞえぼう教材
              </h1>

              <p className="mt-1 text-sm font-medium text-slate-600 sm:text-base">
                かぞえぼうを並べて、数やまとまりを学びましょう。
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="rounded-2xl bg-red-50 px-3 py-2 font-bold text-red-700">
                赤：{colorCounts.red}本
              </div>

              <div className="rounded-2xl bg-blue-50 px-3 py-2 font-bold text-blue-700">
                青：{colorCounts.blue}本
              </div>

              <div className="rounded-2xl bg-yellow-50 px-3 py-2 font-bold text-yellow-700">
                黄：{colorCounts.yellow}本
              </div>

              <div className="rounded-2xl bg-green-50 px-3 py-2 font-bold text-green-700">
                緑：{colorCounts.green}本
              </div>

              <div className="rounded-2xl bg-slate-100 px-4 py-2 font-black text-slate-800">
                ぜんぶ：{sticks.length}本
              </div>

              <button
                type="button"
                onClick={() => {
                  setSoundEnabled((current) => !current);
                  setMessage(
                    soundEnabled
                      ? "音をオフにしました。"
                      : "音をオンにしました。",
                  );
                }}
                className="min-h-12 rounded-2xl border border-violet-300 bg-violet-50 px-4 py-2 font-bold text-violet-700 transition hover:bg-violet-100 focus:outline-none focus:ring-4 focus:ring-violet-200"
                aria-pressed={soundEnabled}
              >
                {soundEnabled ? "🔊 音オン" : "🔇 音オフ"}
              </button>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {(Object.keys(STICK_COLORS) as StickColor[]).map(
              (color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => {
                    setSelectedColor(color);
                    setMessage(
                      `追加する色を${STICK_LABELS[color]}にしました。`,
                    );
                    playSound(500, 0.06, 0.04);
                  }}
                  aria-pressed={selectedColor === color}
                  className={[
                    "min-h-12 rounded-2xl border-2 px-4 py-2 font-black transition focus:outline-none focus:ring-4 focus:ring-slate-200",
                    selectedColor === color
                      ? "border-slate-800 bg-slate-800 text-white shadow-md"
                      : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50",
                  ].join(" ")}
                >
                  <span
                    className="mr-2 inline-block h-4 w-4 rounded-full align-middle"
                    style={{
                      backgroundColor: STICK_COLORS[color],
                    }}
                  />
                  {STICK_LABELS[color]}
                </button>
              ),
            )}
          </div>

          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:flex lg:flex-wrap">
            <button
              type="button"
              onClick={addStick}
              className="min-h-14 rounded-2xl bg-amber-500 px-4 py-3 text-base font-black text-white shadow-md transition hover:-translate-y-0.5 hover:bg-amber-600 focus:outline-none focus:ring-4 focus:ring-amber-200"
            >
              ＋ 1本追加
            </button>

            <button
              type="button"
              onClick={removeStick}
              className="min-h-14 rounded-2xl border border-slate-300 bg-white px-4 py-3 text-base font-black text-slate-700 shadow-sm transition hover:bg-slate-100 focus:outline-none focus:ring-4 focus:ring-slate-200"
            >
              − 1本減らす
            </button>

            <button
              type="button"
              onClick={arrangeHorizontal}
              className="min-h-14 rounded-2xl border border-cyan-300 bg-cyan-50 px-4 py-3 text-base font-black text-cyan-800 transition hover:bg-cyan-100 focus:outline-none focus:ring-4 focus:ring-cyan-200"
            >
              横にせいれつ
            </button>

            <button
              type="button"
              onClick={arrangeVertical}
              className="min-h-14 rounded-2xl border border-indigo-300 bg-indigo-50 px-4 py-3 text-base font-black text-indigo-800 transition hover:bg-indigo-100 focus:outline-none focus:ring-4 focus:ring-indigo-200"
            >
              縦にせいれつ
            </button>

            <button
              type="button"
              onClick={() => arrangeGroups(5)}
              className="min-h-14 rounded-2xl border border-emerald-300 bg-emerald-50 px-4 py-3 text-base font-black text-emerald-800 transition hover:bg-emerald-100 focus:outline-none focus:ring-4 focus:ring-emerald-200"
            >
              5のまとまり
            </button>

            <button
              type="button"
              onClick={() => arrangeGroups(10)}
              className="min-h-14 rounded-2xl border border-violet-300 bg-violet-50 px-4 py-3 text-base font-black text-violet-800 transition hover:bg-violet-100 focus:outline-none focus:ring-4 focus:ring-violet-200"
            >
              10のまとまり
            </button>

            <button
              type="button"
              onClick={clearSticks}
              className="min-h-14 rounded-2xl border border-rose-300 bg-rose-50 px-4 py-3 text-base font-black text-rose-700 transition hover:bg-rose-100 focus:outline-none focus:ring-4 focus:ring-rose-200"
            >
              全部片づける
            </button>

            <button
              type="button"
              onClick={resetSticks}
              className="min-h-14 rounded-2xl border border-orange-300 bg-orange-50 px-4 py-3 text-base font-black text-orange-700 transition hover:bg-orange-100 focus:outline-none focus:ring-4 focus:ring-orange-200"
            >
              はじめにもどす
            </button>

            <button
              type="button"
              onClick={onBack}
              className="col-span-2 min-h-14 rounded-2xl bg-slate-800 px-4 py-3 text-base font-black text-white transition hover:bg-slate-700 focus:outline-none focus:ring-4 focus:ring-slate-300 sm:col-span-1"
            >
              教材一覧へもどる
            </button>
          </div>

          <div
            className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-center text-sm font-bold text-amber-950 sm:text-base"
            aria-live="polite"
          >
            {message}
          </div>
        </div>
      </header>

      <section className="overflow-hidden bg-gradient-to-b from-white to-amber-50">
        {size.width > 0 && size.height > 0 && (
          <Stage width={size.width} height={size.height}>
            <Layer>
              <Rect
                x={12}
                y={12}
                width={Math.max(size.width - 24, 0)}
                height={Math.max(size.height - 24, 0)}
                fill="#ffffff"
                stroke="#fde68a"
                strokeWidth={3}
                cornerRadius={24}
                shadowColor="#94a3b8"
                shadowBlur={14}
                shadowOpacity={0.16}
                shadowOffsetY={5}
              />

              <Text
                x={24}
                y={28}
                width={Math.max(size.width - 48, 0)}
                text="かぞえぼうを指やマウスで動かしてみよう"
                fontSize={size.width < 480 ? 17 : 21}
                fontStyle="bold"
                fill="#334155"
                align="center"
              />

              <Text
                x={24}
                y={62}
                width={Math.max(size.width - 48, 0)}
                text={`ぜんぶで ${sticks.length}本`}
                fontSize={size.width < 480 ? 15 : 18}
                fontStyle="bold"
                fill="#475569"
                align="center"
              />

              {sticks.map((stick) => (
                <Rect
                  key={stick.id}
                  x={stick.x}
                  y={stick.y}
                  width={stickWidth}
                  height={stickHeight}
                  fill={STICK_COLORS[stick.color]}
                  stroke="#ffffff"
                  strokeWidth={4}
                  cornerRadius={stickWidth / 2}
                  shadowColor="#64748b"
                  shadowBlur={10}
                  shadowOpacity={0.3}
                  shadowOffsetY={5}
                  draggable
                  dragBoundFunc={(position) =>
                    clampStickPosition(
                      position.x,
                      position.y,
                      size,
                    )
                  }
                  onDragStart={() => {
                    playSound(370, 0.04, 0.025);
                  }}
                  onDragEnd={(event) => {
                    handleDragEnd(
                      stick.id,
                      event.target.x(),
                      event.target.y(),
                    );
                  }}
                />
              ))}

              {arrangementMode !== "free" && (
                <Text
                  x={24}
                  y={Math.max(size.height - 48, 100)}
                  width={Math.max(size.width - 48, 0)}
                  text={
                    arrangementMode === "horizontal"
                      ? "横ならび"
                      : arrangementMode === "vertical"
                        ? "縦ならび"
                        : arrangementMode === "groups-of-five"
                          ? "5のまとまり"
                          : "10のまとまり"
                  }
                  fontSize={15}
                  fontStyle="bold"
                  fill="#64748b"
                  align="center"
                />
              )}
            </Layer>
          </Stage>
        )}
      </section>
    </main>
  );
}