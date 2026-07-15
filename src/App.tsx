import { useEffect, useState } from "react";
import { Circle, Layer, Stage, Text } from "react-konva";

type Screen = "home" | "ohajiki";

type Counter = {
  id: number;
  x: number;
  y: number;
  color: string;
};

const initialCounters: Counter[] = Array.from({ length: 10 }, (_, index) => ({
  id: index + 1,
  x: 110 + (index % 5) * 110,
  y: 190 + Math.floor(index / 5) * 120,
  color: index < 5 ? "#ef4444" : "#3b82f6",
}));

function App() {
  const [screen, setScreen] = useState<Screen>("home");

  return screen === "home" ? (
    <HomeScreen onStart={() => setScreen("ohajiki")} />
  ) : (
    <OhajikiScreen onBack={() => setScreen("home")} />
  );
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

type OhajikiScreenProps = {
  onBack: () => void;
};

function OhajikiScreen({ onBack }: OhajikiScreenProps) {
  const [counters, setCounters] = useState<Counter[]>(initialCounters);
  const [size, setSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight - 120,
  });

  useEffect(() => {
    const updateSize = () => {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight - 120,
      });
    };

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

        <div className="flex gap-3">
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
            トップへ戻る
          </button>
        </div>
      </header>

      <section className="overflow-hidden">
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
      </section>
    </main>
  );
}

export default App;