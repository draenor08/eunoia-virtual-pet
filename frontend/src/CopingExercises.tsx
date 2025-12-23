import { useEffect, useState } from "react";

type ExerciseCategory = "relaxation" | "breathing" | "grounding" | "mindfulness";

type Exercise = {
  id: number;
  title: string;
  category: ExerciseCategory | string;
  duration: string;          // minutes as string for display/filter
  difficulty: string;        // will be empty if backend doesn’t send it
  moodType: string;
  goal: string;
  steps: string[];
};

const API_URL = "http://localhost:8080";

export default function CopingExercises() {
  console.log("CopingExercises mounted");

  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedCategory, setSelectedCategory] =
    useState<ExerciseCategory | "all">("all");
  const [selectedDuration, setSelectedDuration] =
    useState<"all" | "short" | "medium" | "long">("all");
  const [selectedMood, setSelectedMood] =
    useState<"all" | "anxious" | "low" | "overwhelmed">("all");
  const [query, setQuery] = useState("");

  // load exercises once
  useEffect(() => {
    const loadExercises = async () => {
      try {
        const res = await fetch(`${API_URL}/api/exercises`);

        if (!res.ok) throw new Error("Failed to load exercises");

        const data = await res.json();
        console.log("Loaded exercises:", data);

        const mapped: Exercise[] = data.map((ex: any) => ({
          id: ex.id,
          title: ex.title ?? "",
          category: ex.category ?? "",
          duration: String(ex.duration ?? ""),
          difficulty: ex.difficulty ?? "",
          moodType: ex.moodType ?? "",
          goal: ex.goal ?? ex.description ?? "",
          steps: Array.isArray(ex.steps)
            ? ex.steps
            : String(ex.instructions || ex.steps || "")
                .split("\n")
                .map((s) => s.trim())
                .filter(Boolean),
        }));

        setExercises(mapped);
        setLoading(false);
      } catch (err: any) {
        console.error(err);
        setError(err.message ?? "Could not load exercises");
        setLoading(false);
      }
    };

    loadExercises();
  }, []);

  // apply filters
  const filtered = exercises.filter((ex) => {
    const categoryLower = (ex.category || "").toString().toLowerCase();
    const matchesCategory =
      selectedCategory === "all" || categoryLower === selectedCategory;

    const durationLower = (ex.duration || "").toLowerCase();
    const matchesDuration =
      selectedDuration === "all" ||
      (selectedDuration === "short" &&
        (durationLower.includes("1") || durationLower.includes("3"))) ||
      (selectedDuration === "medium" &&
        (durationLower.includes("5") || durationLower.includes("8"))) ||
      (selectedDuration === "long" &&
        (durationLower.includes("10") || durationLower.includes("15")));

    const moodLower = (ex.moodType || "").toLowerCase();
    const matchesMood =
      selectedMood === "all" || moodLower.includes(selectedMood);

    const q = query.toLowerCase();
    const matchesQuery =
      !q ||
      ex.title.toLowerCase().includes(q) ||
      ex.goal.toLowerCase().includes(q);

    return matchesCategory && matchesDuration && matchesMood && matchesQuery;
  });

  console.log("Filtered exercises:", filtered);

  // loading state
  if (loading) {
    return (
      <main className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-slate-950 text-slate-200">
        <p>Loading exercises…</p>
      </main>
    );
  }

  // error state
  if (error) {
    return (
      <main className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-slate-950 text-red-300">
        <p>{error}</p>
      </main>
    );
  }

  // main UI
  return (
    <main className="min-h-[calc(100vh-80px)] bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-50 px-4 py-8">
      <section className="mx-auto max-w-5xl rounded-3xl bg-slate-900/90 border border-slate-800 px-6 py-6 md:px-8 md:py-8 shadow-2xl">
        {/* Header */}
        <header className="mb-6 space-y-2">
          <p className="text-xs uppercase tracking-[0.2em] text-sky-400/80">
            Coping tools
          </p>
          <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">
                Find an exercise for how you feel
              </h1>
              <p className="text-sm text-slate-400 max-w-xl">
                Choose a short guided practice to help you calm down, ground
                yourself, or reset your thoughts. You can filter by mood, time,
                or type.
              </p>
            </div>
            <span className="inline-flex items-center gap-2 rounded-full bg-slate-800/80 px-3 py-1 text-[11px] text-slate-300">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              {filtered.length} exercises available
            </span>
          </div>
        </header>

        {/* Filters row */}
        <div className="mb-5 flex flex-wrap gap-3 items-center">
          {/* Category filter */}
          <div className="flex flex-wrap gap-2">
            {[
              { id: "all", label: "All" },
              { id: "breathing", label: "Breathing" },
              { id: "grounding", label: "Grounding" },
              { id: "mindfulness", label: "Mindfulness" },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id as any)}
                className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                  selectedCategory === cat.id
                    ? "bg-sky-500 text-white shadow-sm"
                    : "bg-slate-800 text-slate-200 hover:bg-slate-700"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Duration select */}
          <select
            value={selectedDuration}
            onChange={(e) =>
              setSelectedDuration(e.target.value as typeof selectedDuration)
            }
            className="rounded-full bg-slate-900 border border-slate-700 px-3 py-1 text-xs text-slate-200"
          >
            <option value="all">All durations</option>
            <option value="short">Short (1–3 min)</option>
            <option value="medium">Medium (5–8 min)</option>
            <option value="long">Long (10+ min)</option>
          </select>

          {/* Mood select */}
          <select
            value={selectedMood}
            onChange={(e) =>
              setSelectedMood(e.target.value as typeof selectedMood)
            }
            className="rounded-full bg-slate-900 border border-slate-700 px-3 py-1 text-xs text-slate-200"
          >
            <option value="all">All moods</option>
            <option value="anxious">Anxious / stressed</option>
            <option value="low">Low energy / low mood</option>
            <option value="overwhelmed">Overwhelmed</option>
          </select>

          {/* Search box */}
          <div className="flex-1 min-w-[160px]">
            <div className="relative">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by name or goal..."
                className="w-full rounded-full bg-slate-900 border border-slate-700 px-8 py-1.5 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
              />
              <span className="pointer-events-none absolute left-3 top-1.5 text-slate-500 text-xs">
                🔍
              </span>
            </div>
          </div>
        </div>

        {/* Empty state or cards */}
        {filtered.length === 0 ? (
          <div className="mt-4 rounded-2xl border border-dashed border-slate-700 bg-slate-950/40 px-4 py-6 text-sm text-slate-400">
            <p className="font-medium text-slate-200 mb-1">
              No exercises match your filters.
            </p>
            <p>
              Try switching to a different mood, relaxing the duration, or
              clearing the search box.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {filtered.map((exercise) => (
              <article
                key={exercise.id}
                className="flex h-full flex-col rounded-2xl bg-slate-950/80 border border-slate-800 px-4 py-4 hover:border-sky-500/70 hover:bg-slate-900/90 transition"
              >
                <div className="mb-2 flex items-center justify-between gap-2">
                  <h2 className="text-base font-semibold">
                    {exercise.title}
                  </h2>
                  <span className="rounded-full bg-slate-800 px-2 py-0.5 text-[10px] uppercase tracking-wide text-slate-300">
                    {exercise.duration}
                  </span>
                </div>

                <p className="mb-2 text-xs text-slate-400">
                  {exercise.goal}
                </p>

                <ul className="mb-3 space-y-1.5 text-xs text-slate-100">
                  {exercise.steps.map((step, index) => (
                    <li key={index} className="flex gap-2 items-start">
                      <span className="mt-0.5 flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full bg-slate-800 text-[10px]">
                        {index + 1}
                      </span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-auto pt-2 text-[10px] text-slate-500 flex items-center justify-between">
                  <span>{exercise.moodType}</span>
                  <span>{exercise.difficulty}</span>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
