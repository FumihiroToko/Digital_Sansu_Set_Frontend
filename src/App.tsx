import { useEffect, useState } from "react";
import { Circle, Layer, Stage, Text } from "react-konva";

type Screen = "home" | "materials" | "ohajiki";

type Counter = {
  id: number;
  x: number;
  y: number;
  color: string;
};

type Material = {
  id: string;
  title: string;
  description: string;
  icon: string;
  available: boolean;
};

const initialCounters: Counter[] = Array.from({ length: 10 }, (_, index) => ({
  id: index + 1,
  x: 110 + (index % 5) * 110,
  y: 190 + Math.floor(index / 5) * 120,
  color: index < 5 ? "#ef4444" : "#3b82f6",
}));

const materials: Material[] = [
  {
    id: "ohajiki",
    title: "おはじき",
    description: "おはじきを動かして、数やまとまりを学びます。",
    icon: "●",
    available: true,
  },
  {
    id: "counting-sticks",
    title: "かぞえぼう",
    description: "ぼうを並べて、数のしくみを学びます。",
    icon: "▥",
    available: false,
  },
  {
    id: "blocks",
    title: "さんすうブロック",
    description: "ブロックを使って、たし算やひき算を学びます。",
    icon: "■",
    available: false,
  },
  {
    id: "clock",
    title: "とけい",
    description: "時計を動かして、時刻を学びます。",
    icon: "◷",
    available: false,
  },
  {
    id: "multiplication",
    title: "九九",
    description: "楽しく九九を練習します。",
    icon: "×",
    available: false,
  },
  {
    id: "shapes",
    title: "ずけい",
    description: "いろいろな形を組み合わせて学びます。",
    icon: "△",
    available: false,
  },
  {
    id: "ruler",
    title: "じょうぎ",
    description: "長さを測る練習をします。",
    icon: "▰",
    available: false,
  },
  {
    id: "word-problems",
    title: "文章題",
    description: "文を読みながら、問題を考えます。",
    icon: "?",
    available: false,
  },
];

function App() {
  const [screen, setScreen] = useState<Screen>("home");

  if (screen === "home") {
    return <HomeScreen onStart={() => setScreen("materials")} />;
  }

  if (screen === "materials") {
    return (
      <MaterialSelectionScreen
        onBack={() => setScreen("home")}
        onSelectOhajiki={() => setScreen("ohajiki")}
      />
    );
  }

  return <OhajikiScreen onBack={() => setScreen("materials")} />;
}

type HomeScreenProps = {
  onStart: () => void;
};

function HomeScreen({ onStart }: HomeScreenProps) {
  return (
    <main className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-[#eef4ff] px-3 py-5 sm:px-5">
      <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-blue-300/30 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-violet-300/30 blur-3xl" />

      <section className="relative flex w-full max-w-7xl flex-col items-center">
        <div className="relative w-full overflow-hidden rounded-[2rem] border border-white/80 bg-white/40 shadow-[0_25px_70px_rgba(60,80,160,0.22)] backdrop-blur-sm">
          <img
            src="/digital-sansu-set-cover.png"
            alt="デジタル算数セット 江南市"
            className="block max-h-[82vh] w-full object-contain"
          />

          <div className="absolute inset-x-0 bottom-5 flex justify-center px-4">
            <button
              type="button"
              onClick={onStart}
              className="rounded-full bg-gradient-to-r from-blue-600 to-violet-600 px-12 py-4 text-lg font-bold tracking-[0.18em] text-white shadow-xl transition hover:-translate-y-1 hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-blue-300"
            >
              START
            </button>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-center gap-2 rounded-full border border-white/80 bg-white/80 px-6 py-3 text-sm font-semibold text-slate-700 shadow-lg backdrop-blur-md sm:text-base">
          <span>江南市議会提案資料</span>
          <span className="text-slate-300">|</span>
          <span>Version 0.1</span>
          <span className="text-slate-300">|</span>
          <span>2026</span>
        </div>
      </section>
    </main>
  );
}

type MaterialSelectionScreenProps = {
  onBack: () => void;
  onSelectOhajiki: () => void;
};

function MaterialSelectionScreen({
  onBack,
  onSelectOhajiki,
}: MaterialSelectionScreenProps) {
  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-sky-50 via-white to-violet-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute -left-20 top-20 h-72 w-72 rounded-full bg-blue-200/35 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 bottom-10 h-80 w-80 rounded-full bg-violet-200/35 blur-3xl" />

      <section className="relative mx-auto w-full max-w-7xl">
        <header className="mb-8 flex flex-col gap-5 rounded-[2rem] border border-white/90 bg-white/80 p-6 shadow-xl backdrop-blur-md sm:flex-row sm:items-center sm:justify-between sm:p-8">
          <div>
            <p className="text-xs font-bold tracking-[0.25em] text-blue-600">
              DIGITAL SANSU SET
            </p>

            <h1 className="mt-2 text-3xl font-black text-slate-900 sm:text-4xl">
              教材をえらぼう
            </h1>

            <p className="mt-2 text-base font-medium text-slate-600">
              使いたい算数教材をタップしてください。
            </p>
          </div>

          <button
            type="button"
            onClick={onBack}
            className="self-start rounded-full border border-slate-300 bg-white px-6 py-3 font-bold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-slate-200 sm:self-auto"
          >
            トップへもどる
          </button>
        </header>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {materials.map((material) => {
            const isOhajiki = material.id === "ohajiki";

            return (
              <button
                key={material.id}
                type="button"
                disabled={!material.available}
                onClick={isOhajiki ? onSelectOhajiki : undefined}
                className={[
                  "group relative min-h-64 overflow-hidden rounded-[1.75rem] border p-6 text-left shadow-lg transition",
                  material.available
                    ? "border-blue-200 bg-white hover:-translate-y-2 hover:border-blue-400 hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-blue-200"
                    : "cursor-not-allowed border-slate-200 bg-white/65 opacity-70",
                ].join(" ")}
              >
                <div
                  className={[
                    "mb-5 flex h-20 w-20 items-center justify-center rounded-3xl text-4xl font-black shadow-inner",
                    material.available
                      ? "bg-gradient-to-br from-blue-100 to-violet-100 text-blue-600"
                      : "bg-slate-100 text-slate-400",
                  ].join(" ")}
                >
                  {material.icon}
                </div>

                <h2 className="text-2xl font-black text-slate-900">
                  {material.title}
                </h2>

                <p className="mt-3 leading-relaxed text-slate-600">
                  {material.description}
                </p>

                <div className="mt-6">
                  {material.available ? (
                    <span className="inline-flex rounded-full bg-blue-600 px-4 py-2 text-sm font-bold text-white shadow-md transition group-hover:bg-blue-700">
                      はじめる
                    </span>
                  ) : (
                    <span className="inline-flex rounded-full bg-slate-200 px-4 py-2 text-sm font-bold text-slate-500">
                      じゅんびちゅう
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        <footer className="mt-8 rounded-3xl border border-white/90 bg-white/75 px-6 py-4 text-center text-sm font-semibold text-slate-600 shadow-md backdrop-blur-md">
          現在は「おはじき教材」を利用できます。
        </footer>
      </section>
    </main>
  );
}

type OhajikiScreenProps = {
  onBack: () => void;
};

function OhajikiScreen({ onBack }: OhajikiScreenProps) {
  const [counters, setCounters] = useState<Counter[]>(initialCounters);
  const [size, setSize] = useState({
    width: 0,
    height: 0,
  });

  useEffect(() => {
    const updateSize = () => {
      setSize({
        width: window.innerWidth,
        height: Math.max(window.innerHeight - 120, 420),
      });
    };

    updateSize();
    window.addEventListener("resize", updateSize);

    return () => {
      window.removeEventListener("resize", updateSize);
    };
  }, []);

  const resetCounters = () => {
    setCounters(initialCounters);
  };

  return (
    <main className="min-h-screen bg-[#f6f9ff]">
      <header className="flex min-h-24 flex-wrap items-center justify-between gap-4 border-b border-blue-100 bg-white/90 px-5 py-4 shadow-sm backdrop-blur-md">
        <div>
          <p className="text-xs font-bold tracking-[0.25em] text-blue-600">
            DIGITAL SANSU SET
          </p>

          <h1 className="text-2xl font-bold text-slate-900">おはじき教材</h1>

          <p className="text-sm text-slate-600">
            おはじきを自由に動かして、5と10のまとまりを作りましょう。
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={resetCounters}
            className="rounded-full border border-orange-300 bg-orange-50 px-5 py-3 font-bold text-orange-700 transition hover:bg-orange-100 focus:outline-none focus:ring-4 focus:ring-orange-200"
          >
            おかたづけ
          </button>

          <button
            type="button"
            onClick={onBack}
            className="rounded-full bg-slate-800 px-5 py-3 font-bold text-white transition hover:bg-slate-700 focus:outline-none focus:ring-4 focus:ring-slate-300"
          >
            教材一覧へもどる
          </button>
        </div>
      </header>

      <section className="overflow-hidden">
        {size.width > 0 && size.height > 0 && (
          <Stage width={size.width} height={size.height}>
            <Layer>
              <Text
                x={30}
                y={30}
                text="赤と青のおはじきをドラッグしてみよう"
                fontSize={22}
                fontStyle="bold"
                fill="#334155"
              />

              {counters.map((counter) => (
                <Circle
                  key={counter.id}
                  x={counter.x}
                  y={counter.y}
                  radius={38}
                  fill={counter.color}
                  stroke="#ffffff"
                  strokeWidth={5}
                  shadowColor="#64748b"
                  shadowBlur={12}
                  shadowOpacity={0.35}
                  shadowOffsetY={6}
                  draggable
                  onDragEnd={(event) => {
                    const newX = event.target.x();
                    const newY = event.target.y();

                    setCounters((current) =>
                      current.map((item) =>
                        item.id === counter.id
                          ? { ...item, x: newX, y: newY }
                          : item,
                      ),
                    );
                  }}
                />
              ))}
            </Layer>
          </Stage>
        )}
      </section>
    </main>
  );
}

export default App;