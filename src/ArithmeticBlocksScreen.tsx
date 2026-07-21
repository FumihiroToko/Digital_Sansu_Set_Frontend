import { useEffect, useMemo, useState } from "react";
import {
  Group,
  Layer,
  Line,
  Rect,
  Stage,
  Text,
} from "react-konva";

type ArithmeticBlocksScreenProps = {
  onBack: () => void;
};

type BlockKind = "one" | "ten" | "hundred";

type ArithmeticBlock = {
  id: number;
  kind: BlockKind;
  x: number;
  y: number;
};

type StageSize = {
  width: number;
  height: number;
};

type BlockDimensions = {
  width: number;
  height: number;
};

type LayoutZone = {
  x: number;
  y: number;
  width: number;
  height: number;
};

type LayoutZones = Record<BlockKind, LayoutZone>;

const MAX_BLOCKS_PER_KIND = 9;
const GRID_COLUMNS = 3;

const INITIAL_COUNTS: Record<BlockKind, number> = {
  one: 3,
  ten: 2,
  hundred: 1,
};

const BLOCK_KIND_ORDER: BlockKind[] = [
  "hundred",
  "ten",
  "one",
];

function getBlockValue(kind: BlockKind): number {
  if (kind === "hundred") {
    return 100;
  }

  if (kind === "ten") {
    return 10;
  }

  return 1;
}

function getBlockLabel(kind: BlockKind): string {
  if (kind === "hundred") {
    return "100のブロック";
  }

  if (kind === "ten") {
    return "10のブロック";
  }

  return "1のブロック";
}

function getZoneTitle(kind: BlockKind): string {
  if (kind === "hundred") {
    return "100の位";
  }

  if (kind === "ten") {
    return "10の位";
  }

  return "1の位";
}

function getZoneSubtitle(kind: BlockKind): string {
  if (kind === "hundred") {
    return "100";
  }

  if (kind === "ten") {
    return "10";
  }

  return "1";
}

function getZoneFill(kind: BlockKind): string {
  if (kind === "hundred") {
    return "#fffbeb";
  }

  if (kind === "ten") {
    return "#eff6ff";
  }

  return "#ecfdf5";
}

function getZoneStroke(kind: BlockKind): string {
  if (kind === "hundred") {
    return "#fcd34d";
  }

  if (kind === "ten") {
    return "#93c5fd";
  }

  return "#6ee7b7";
}

function getZoneTitleColor(kind: BlockKind): string {
  if (kind === "hundred") {
    return "#92400e";
  }

  if (kind === "ten") {
    return "#1d4ed8";
  }

  return "#047857";
}

function getLayoutZones(size: StageSize): LayoutZones {
  const width = Math.max(size.width, 320);
  const compact = width < 760;

  if (compact) {
    const margin = 14;
    const zoneWidth = width - margin * 2;

    return {
      hundred: {
        x: margin,
        y: 112,
        width: zoneWidth,
        height: 332,
      },
      ten: {
        x: margin,
        y: 458,
        width: zoneWidth,
        height: 262,
      },
      one: {
        x: margin,
        y: 734,
        width: zoneWidth,
        height: 262,
      },
    };
  }

  const outerMargin = Math.max(24, width * 0.025);
  const zoneGap = Math.max(14, width * 0.015);
  const contentWidth =
    width - outerMargin * 2 - zoneGap * 2;

  const hundredWidth = contentWidth * 0.58;
  const tenWidth = contentWidth * 0.2;
  const oneWidth =
    contentWidth - hundredWidth - tenWidth;

  const zoneY = 112;
  const zoneHeight = Math.max(size.height - 132, 520);

  return {
    hundred: {
      x: outerMargin,
      y: zoneY,
      width: hundredWidth,
      height: zoneHeight,
    },
    ten: {
      x: outerMargin + hundredWidth + zoneGap,
      y: zoneY,
      width: tenWidth,
      height: zoneHeight,
    },
    one: {
      x:
        outerMargin +
        hundredWidth +
        zoneGap +
        tenWidth +
        zoneGap,
      y: zoneY,
      width: oneWidth,
      height: zoneHeight,
    },
  };
}

function getBlockDimensions(
  kind: BlockKind,
  size: StageSize,
): BlockDimensions {
  const width = Math.max(size.width, 320);
  const compact = width < 760;
  const zones = getLayoutZones(size);
  const zone = zones[kind];

  const horizontalPadding = compact ? 18 : 20;
  const verticalPadding = compact ? 52 : 58;
  const horizontalGap = compact ? 10 : 14;
  const verticalGap = compact ? 10 : 14;

  const availableGridWidth =
    zone.width -
    horizontalPadding * 2 -
    horizontalGap * (GRID_COLUMNS - 1);

  const availableGridHeight =
    zone.height -
    verticalPadding -
    verticalGap * (GRID_COLUMNS - 1);

  const maximumCellWidth =
    availableGridWidth / GRID_COLUMNS;

  const maximumCellHeight =
    availableGridHeight / GRID_COLUMNS;

  if (kind === "hundred") {
    const preferredSize = compact ? 82 : 160;

    const blockSize = Math.max(
      44,
      Math.min(
        preferredSize,
        maximumCellWidth,
        maximumCellHeight,
      ),
    );

    return {
      width: blockSize,
      height: blockSize,
    };
  }

  if (kind === "ten") {
    const preferredHeight = compact ? 56 : 160;
    const preferredWidth = compact ? 24 : 36;

    const height = Math.max(
      48,
      Math.min(
        preferredHeight,
        maximumCellHeight,
      ),
    );

    const widthByZone = Math.max(
      18,
      Math.min(
        preferredWidth,
        maximumCellWidth,
      ),
    );

    return {
      width: widthByZone,
      height,
    };
  }

  const preferredSize = compact ? 34 : 38;

  const blockSize = Math.max(
    26,
    Math.min(
      preferredSize,
      maximumCellWidth,
      maximumCellHeight,
    ),
  );

  return {
    width: blockSize,
    height: blockSize,
  };
}

function getGridGap(
  kind: BlockKind,
  size: StageSize,
): { x: number; y: number } {
  const compact = size.width < 760;

  if (kind === "hundred") {
    return {
      x: compact ? 10 : 14,
      y: compact ? 10 : 14,
    };
  }

  if (kind === "ten") {
    return {
      x: compact ? 16 : 16,
      y: compact ? 12 : 14,
    };
  }

  return {
    x: compact ? 12 : 12,
    y: compact ? 12 : 12,
  };
}

function getInitialPosition(
  kind: BlockKind,
  index: number,
  size: StageSize,
): { x: number; y: number } {
  const zones = getLayoutZones(size);
  const zone = zones[kind];
  const dimensions = getBlockDimensions(kind, size);
  const gap = getGridGap(kind, size);

  const row = Math.floor(index / GRID_COLUMNS);
  const column = index % GRID_COLUMNS;

  const totalGridWidth =
    dimensions.width * GRID_COLUMNS +
    gap.x * (GRID_COLUMNS - 1);

  const totalGridHeight =
    dimensions.height * GRID_COLUMNS +
    gap.y * (GRID_COLUMNS - 1);

  const gridStartX =
    zone.x +
    Math.max(
      10,
      (zone.width - totalGridWidth) / 2,
    );

  const availableVerticalSpace =
    zone.height - 44 - totalGridHeight;

  const gridStartY =
    zone.y +
    42 +
    Math.max(
      8,
      Math.min(
        18,
        availableVerticalSpace / 2,
      ),
    );

  return {
    x:
      gridStartX +
      column * (dimensions.width + gap.x),
    y:
      gridStartY +
      row * (dimensions.height + gap.y),
  };
}

function clampBlockPosition(
  kind: BlockKind,
  x: number,
  y: number,
  size: StageSize,
): { x: number; y: number } {
  const dimensions = getBlockDimensions(kind, size);
  const margin = 14;
  const topMargin = 104;

  return {
    x: Math.min(
      Math.max(x, margin),
      Math.max(
        margin,
        size.width - dimensions.width - margin,
      ),
    ),
    y: Math.min(
      Math.max(y, topMargin),
      Math.max(
        topMargin,
        size.height - dimensions.height - margin,
      ),
    ),
  };
}

function arrangeBlockCollection(
  blocks: ArithmeticBlock[],
  size: StageSize,
): ArithmeticBlock[] {
  const kindIndexes: Record<BlockKind, number> = {
    hundred: 0,
    ten: 0,
    one: 0,
  };

  return blocks.map((block) => {
    const index = kindIndexes[block.kind];

    kindIndexes[block.kind] += 1;

    const position = getInitialPosition(
      block.kind,
      index,
      size,
    );

    return {
      ...block,
      x: position.x,
      y: position.y,
    };
  });
}

function createInitialBlocks(
  size: StageSize = {
    width: 900,
    height: 680,
  },
): ArithmeticBlock[] {
  let nextId = 1;
  const blocks: ArithmeticBlock[] = [];

  BLOCK_KIND_ORDER.forEach((kind) => {
    for (
      let index = 0;
      index < INITIAL_COUNTS[kind];
      index += 1
    ) {
      const position = getInitialPosition(
        kind,
        index,
        size,
      );

      blocks.push({
        id: nextId,
        kind,
        x: position.x,
        y: position.y,
      });

      nextId += 1;
    }
  });

  return blocks;
}

function getRequiredStageHeight(width: number): number {
  if (width < 760) {
    return 1018;
  }

  return 680;
}

function ArithmeticBlocksScreen({
  onBack,
}: ArithmeticBlocksScreenProps) {
  const [size, setSize] = useState<StageSize>({
    width: 0,
    height: 0,
  });

  const [blocks, setBlocks] = useState<ArithmeticBlock[]>(
    () =>
      createInitialBlocks({
        width: 900,
        height: 680,
      }),
  );

  const [soundEnabled, setSoundEnabled] = useState(true);

  const [message, setMessage] = useState(
    "1、10、100のブロックを動かして、数のしくみを見てみよう。",
  );

  const oneCount = useMemo(
    () =>
      blocks.filter(
        (block) => block.kind === "one",
      ).length,
    [blocks],
  );

  const tenCount = useMemo(
    () =>
      blocks.filter(
        (block) => block.kind === "ten",
      ).length,
    [blocks],
  );

  const hundredCount = useMemo(
    () =>
      blocks.filter(
        (block) => block.kind === "hundred",
      ).length,
    [blocks],
  );

  const totalValue = useMemo(
    () =>
      blocks.reduce(
        (total, block) =>
          total + getBlockValue(block.kind),
        0,
      ),
    [blocks],
  );

  useEffect(() => {
    const updateSize = () => {
      const width = Math.max(window.innerWidth, 320);

      const nextSize: StageSize = {
        width,
        height: Math.max(
          window.innerHeight - 245,
          getRequiredStageHeight(width),
        ),
      };

      setSize(nextSize);

      setBlocks((current) =>
        arrangeBlockCollection(
          current,
          nextSize,
        ),
      );
    };

    updateSize();

    window.addEventListener("resize", updateSize);

    return () => {
      window.removeEventListener(
        "resize",
        updateSize,
      );
    };
  }, []);

  const playSound = (
    frequency = 520,
    duration = 0.09,
    volume = 0.06,
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
        audioWindow.AudioContext ??
        audioWindow.webkitAudioContext;

      if (!AudioContextClass) {
        return;
      }

      const audioContext =
        new AudioContextClass();

      const oscillator =
        audioContext.createOscillator();

      const gainNode =
        audioContext.createGain();

      oscillator.type = "sine";

      oscillator.frequency.setValueAtTime(
        frequency,
        audioContext.currentTime,
      );

      gainNode.gain.setValueAtTime(
        volume,
        audioContext.currentTime,
      );

      gainNode.gain.exponentialRampToValueAtTime(
        0.001,
        audioContext.currentTime + duration,
      );

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.start();

      oscillator.stop(
        audioContext.currentTime + duration,
      );

      oscillator.addEventListener(
        "ended",
        () => {
          void audioContext.close();
        },
      );
    } catch {
      // 音声を利用できない環境でも教材操作を継続する。
    }
  };

  const playSuccessSound = () => {
    playSound(523, 0.1, 0.06);

    window.setTimeout(() => {
      playSound(659, 0.1, 0.06);
    }, 100);

    window.setTimeout(() => {
      playSound(784, 0.14, 0.07);
    }, 200);
  };

  const getActiveSize = (): StageSize => {
    const width =
      size.width ||
      Math.max(window.innerWidth, 320);

    return {
      width,
      height:
        size.height ||
        Math.max(
          window.innerHeight - 245,
          getRequiredStageHeight(width),
        ),
    };
  };

  const getCountForKind = (
    kind: BlockKind,
  ): number => {
    return blocks.filter(
      (block) => block.kind === kind,
    ).length;
  };

  const addBlock = (kind: BlockKind) => {
    const currentCount =
      getCountForKind(kind);

    if (
      currentCount >= MAX_BLOCKS_PER_KIND
    ) {
      setMessage(
        `${getBlockLabel(kind)}は${MAX_BLOCKS_PER_KIND}こまで追加できます。`,
      );

      playSound(240, 0.16, 0.05);
      return;
    }

    const activeSize = getActiveSize();

    setBlocks((current) => {
      const countForKind = current.filter(
        (block) => block.kind === kind,
      ).length;

      if (
        countForKind >=
        MAX_BLOCKS_PER_KIND
      ) {
        return current;
      }

      const nextId =
        current.length === 0
          ? 1
          : Math.max(
              ...current.map(
                (block) => block.id,
              ),
            ) + 1;

      const position = getInitialPosition(
        kind,
        countForKind,
        activeSize,
      );

      return [
        ...current,
        {
          id: nextId,
          kind,
          x: position.x,
          y: position.y,
        },
      ];
    });

    setMessage(
      `${getBlockLabel(kind)}を1こ追加しました。`,
    );

    playSound(
      kind === "hundred"
        ? 360
        : kind === "ten"
          ? 500
          : 680,
      0.1,
      0.06,
    );
  };

  const removeBlock = (kind: BlockKind) => {
    const matchingBlocks = blocks.filter(
      (block) => block.kind === kind,
    );

    if (matchingBlocks.length === 0) {
      setMessage(
        `減らせる${getBlockLabel(kind)}がありません。`,
      );

      playSound(240, 0.16, 0.05);
      return;
    }

    setBlocks((current) => {
      const currentMatchingBlocks =
        current.filter(
          (block) => block.kind === kind,
        );

      if (
        currentMatchingBlocks.length === 0
      ) {
        return current;
      }

      const targetId =
        currentMatchingBlocks[
          currentMatchingBlocks.length - 1
        ].id;

      const nextBlocks = current.filter(
        (block) => block.id !== targetId,
      );

      return arrangeBlockCollection(
        nextBlocks,
        getActiveSize(),
      );
    });

    setMessage(
      `${getBlockLabel(kind)}を1こ減らしました。`,
    );

    playSound(330, 0.08, 0.05);
  };

  const arrangeBlocks = () => {
    const activeSize = getActiveSize();

    setBlocks((current) =>
      arrangeBlockCollection(
        current,
        activeSize,
      ),
    );

    setMessage(
      "100、10、1の場所にブロックをせいれつしました。",
    );

    playSuccessSound();
  };

  const clearBlocks = () => {
    setBlocks([]);

    setMessage(
      "すべてのブロックをおかたづけしました。",
    );

    playSound(310, 0.12, 0.05);
  };

  const resetBlocks = () => {
    const activeSize = getActiveSize();

    setBlocks(
      createInitialBlocks(activeSize),
    );

    setMessage(
      "ブロックを、はじめの状態にもどしました。",
    );

    playSuccessSound();
  };

  const handleDragEnd = (
    blockId: number,
    kind: BlockKind,
    newX: number,
    newY: number,
  ) => {
    const activeSize = getActiveSize();

    const safePosition = clampBlockPosition(
      kind,
      newX,
      newY,
      activeSize,
    );

    setBlocks((current) =>
      current.map((block) =>
        block.id === blockId
          ? {
              ...block,
              x: safePosition.x,
              y: safePosition.y,
            }
          : block,
      ),
    );

    setMessage(
      `${getBlockLabel(kind)}を動かしました。`,
    );

    playSound(430, 0.05, 0.035);
  };

  const renderGridLines = (
    kind: BlockKind,
    width: number,
    height: number,
  ) => {
    if (kind === "one") {
      return null;
    }

    if (kind === "ten") {
      return Array.from(
        { length: 9 },
        (_, index) => {
          const y =
            ((index + 1) * height) / 10;

          return (
            <Line
              key={`ten-line-${index}`}
              points={[0, y, width, y]}
              stroke="#1d4ed8"
              strokeWidth={1}
              opacity={0.65}
            />
          );
        },
      );
    }

    const verticalLines = Array.from(
      { length: 9 },
      (_, index) => {
        const x =
          ((index + 1) * width) / 10;

        return (
          <Line
            key={`hundred-v-${index}`}
            points={[x, 0, x, height]}
            stroke="#b45309"
            strokeWidth={1}
            opacity={0.55}
          />
        );
      },
    );

    const horizontalLines = Array.from(
      { length: 9 },
      (_, index) => {
        const y =
          ((index + 1) * height) / 10;

        return (
          <Line
            key={`hundred-h-${index}`}
            points={[0, y, width, y]}
            stroke="#b45309"
            strokeWidth={1}
            opacity={0.55}
          />
        );
      },
    );

    return [
      ...verticalLines,
      ...horizontalLines,
    ];
  };

  const renderZone = (
    kind: BlockKind,
    zone: LayoutZone,
  ) => {
    return (
      <Group key={`zone-${kind}`}>
        <Rect
          x={zone.x}
          y={zone.y}
          width={zone.width}
          height={zone.height}
          fill={getZoneFill(kind)}
          stroke={getZoneStroke(kind)}
          strokeWidth={2}
          cornerRadius={20}
          dash={[8, 6]}
          opacity={0.88}
        />

        <Text
          x={zone.x + 10}
          y={zone.y + 10}
          width={Math.max(
            zone.width - 20,
            0,
          )}
          text={`${getZoneTitle(kind)} ${getZoneSubtitle(kind)}`}
          align="center"
          fontSize={
            size.width < 480 ? 15 : 18
          }
          fontStyle="bold"
          fill={getZoneTitleColor(kind)}
        />
      </Group>
    );
  };

  const zones =
    size.width > 0 && size.height > 0
      ? getLayoutZones(size)
      : null;

  return (
    <main className="min-h-screen bg-[#fffaf0] text-slate-900">
      <header className="border-b border-amber-100 bg-white/95 px-3 py-3 shadow-sm backdrop-blur-md sm:px-5 sm:py-4">
        <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-4">
          <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <p className="text-xs font-bold tracking-[0.25em] text-amber-600">
                DIGITAL SANSU SET
              </p>

              <h1 className="text-2xl font-black text-slate-900 sm:text-3xl">
                さんすうブロック教材
              </h1>

              <p className="mt-1 text-sm font-medium text-slate-600 sm:text-base">
                1、10、100のブロックで、位取りと数のしくみを学びます。
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="rounded-2xl bg-amber-50 px-4 py-2 font-bold text-amber-800">
                100：{hundredCount}こ
              </div>

              <div className="rounded-2xl bg-blue-50 px-4 py-2 font-bold text-blue-700">
                10：{tenCount}こ
              </div>

              <div className="rounded-2xl bg-emerald-50 px-4 py-2 font-bold text-emerald-700">
                1：{oneCount}こ
              </div>

              <div className="rounded-2xl bg-slate-900 px-5 py-2 text-lg font-black text-white">
                合計：{totalValue}
              </div>

              <button
                type="button"
                onClick={() => {
                  setSoundEnabled(
                    (current) => !current,
                  );

                  setMessage(
                    soundEnabled
                      ? "音をオフにしました。"
                      : "音をオンにしました。",
                  );
                }}
                className="min-h-12 rounded-2xl border border-violet-300 bg-violet-50 px-4 py-2 font-bold text-violet-700 transition hover:bg-violet-100 focus:outline-none focus:ring-4 focus:ring-violet-200"
                aria-pressed={soundEnabled}
              >
                {soundEnabled
                  ? "🔊 音オン"
                  : "🔇 音オフ"}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 xl:flex xl:flex-wrap">
            <button
              type="button"
              onClick={() => addBlock("one")}
              className="min-h-14 rounded-2xl bg-emerald-500 px-4 py-3 font-black text-white shadow-md transition hover:-translate-y-0.5 hover:bg-emerald-600 focus:outline-none focus:ring-4 focus:ring-emerald-200"
            >
              ＋ 1
            </button>

            <button
              type="button"
              onClick={() => removeBlock("one")}
              className="min-h-14 rounded-2xl border border-emerald-300 bg-emerald-50 px-4 py-3 font-black text-emerald-800 transition hover:bg-emerald-100 focus:outline-none focus:ring-4 focus:ring-emerald-200"
            >
              − 1
            </button>

            <button
              type="button"
              onClick={() => addBlock("ten")}
              className="min-h-14 rounded-2xl bg-blue-500 px-4 py-3 font-black text-white shadow-md transition hover:-translate-y-0.5 hover:bg-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-200"
            >
              ＋ 10
            </button>

            <button
              type="button"
              onClick={() => removeBlock("ten")}
              className="min-h-14 rounded-2xl border border-blue-300 bg-blue-50 px-4 py-3 font-black text-blue-800 transition hover:bg-blue-100 focus:outline-none focus:ring-4 focus:ring-blue-200"
            >
              − 10
            </button>

            <button
              type="button"
              onClick={() =>
                addBlock("hundred")
              }
              className="min-h-14 rounded-2xl bg-amber-500 px-4 py-3 font-black text-white shadow-md transition hover:-translate-y-0.5 hover:bg-amber-600 focus:outline-none focus:ring-4 focus:ring-amber-200"
            >
              ＋ 100
            </button>

            <button
              type="button"
              onClick={() =>
                removeBlock("hundred")
              }
              className="min-h-14 rounded-2xl border border-amber-300 bg-amber-50 px-4 py-3 font-black text-amber-800 transition hover:bg-amber-100 focus:outline-none focus:ring-4 focus:ring-amber-200"
            >
              − 100
            </button>

            <button
              type="button"
              onClick={arrangeBlocks}
              className="min-h-14 rounded-2xl border border-cyan-300 bg-cyan-50 px-4 py-3 font-black text-cyan-800 transition hover:bg-cyan-100 focus:outline-none focus:ring-4 focus:ring-cyan-200"
            >
              せいれつ
            </button>

            <button
              type="button"
              onClick={resetBlocks}
              className="min-h-14 rounded-2xl border border-orange-300 bg-orange-50 px-4 py-3 font-black text-orange-700 transition hover:bg-orange-100 focus:outline-none focus:ring-4 focus:ring-orange-200"
            >
              はじめにもどす
            </button>

            <button
              type="button"
              onClick={clearBlocks}
              className="min-h-14 rounded-2xl border border-rose-300 bg-rose-50 px-4 py-3 font-black text-rose-700 transition hover:bg-rose-100 focus:outline-none focus:ring-4 focus:ring-rose-200"
            >
              おかたづけ
            </button>

            <button
              type="button"
              onClick={onBack}
              className="col-span-2 min-h-14 rounded-2xl bg-slate-800 px-4 py-3 font-black text-white transition hover:bg-slate-700 focus:outline-none focus:ring-4 focus:ring-slate-300 sm:col-span-1"
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

      <section className="overflow-x-hidden bg-gradient-to-b from-white to-amber-50">
        {size.width > 0 &&
          size.height > 0 &&
          zones && (
            <Stage
              width={size.width}
              height={size.height}
            >
              <Layer>
                <Rect
                  x={8}
                  y={8}
                  width={Math.max(
                    size.width - 16,
                    0,
                  )}
                  height={Math.max(
                    size.height - 16,
                    0,
                  )}
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
                  y={24}
                  width={Math.max(
                    size.width - 48,
                    0,
                  )}
                  text="ブロックを指やマウスで動かしてみよう"
                  fontSize={
                    size.width < 480 ? 17 : 21
                  }
                  fontStyle="bold"
                  fill="#334155"
                  align="center"
                />

                <Text
                  x={24}
                  y={58}
                  width={Math.max(
                    size.width - 48,
                    0,
                  )}
                  text={`${hundredCount} × 100 ＋ ${tenCount} × 10 ＋ ${oneCount} × 1 ＝ ${totalValue}`}
                  fontSize={
                    size.width < 480 ? 14 : 19
                  }
                  fontStyle="bold"
                  fill="#475569"
                  align="center"
                />

                {BLOCK_KIND_ORDER.map(
                  (kind) =>
                    renderZone(
                      kind,
                      zones[kind],
                    ),
                )}

                {blocks.map((block) => {
                  const dimensions =
                    getBlockDimensions(
                      block.kind,
                      size,
                    );

                  const fill =
                    block.kind === "hundred"
                      ? "#fbbf24"
                      : block.kind === "ten"
                        ? "#60a5fa"
                        : "#34d399";

                  const stroke =
                    block.kind === "hundred"
                      ? "#b45309"
                      : block.kind === "ten"
                        ? "#1d4ed8"
                        : "#047857";

                  return (
                    <Group
                      key={block.id}
                      x={block.x}
                      y={block.y}
                      draggable
                      dragBoundFunc={(
                        position,
                      ) =>
                        clampBlockPosition(
                          block.kind,
                          position.x,
                          position.y,
                          size,
                        )
                      }
                      onDragStart={() => {
                        playSound(
                          370,
                          0.04,
                          0.025,
                        );
                      }}
                      onDragEnd={(event) => {
                        handleDragEnd(
                          block.id,
                          block.kind,
                          event.target.x(),
                          event.target.y(),
                        );
                      }}
                    >
                      <Rect
                        width={
                          dimensions.width
                        }
                        height={
                          dimensions.height
                        }
                        fill={fill}
                        stroke={stroke}
                        strokeWidth={3}
                        cornerRadius={
                          block.kind === "one"
                            ? 5
                            : 7
                        }
                        shadowColor="#64748b"
                        shadowBlur={10}
                        shadowOpacity={0.3}
                        shadowOffsetY={5}
                      />

                      {renderGridLines(
                        block.kind,
                        dimensions.width,
                        dimensions.height,
                      )}

                      {block.kind ===
                        "one" && (
                        <Text
                          width={
                            dimensions.width
                          }
                          height={
                            dimensions.height
                          }
                          text="1"
                          align="center"
                          verticalAlign="middle"
                          fontSize={
                            size.width < 760
                              ? 14
                              : 18
                          }
                          fontStyle="bold"
                          fill="#064e3b"
                        />
                      )}
                    </Group>
                  );
                })}
              </Layer>
            </Stage>
          )}
      </section>
    </main>
  );
}

export default ArithmeticBlocksScreen;