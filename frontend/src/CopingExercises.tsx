import { useEffect, useState } from "react";
// import { USER_ID } from "./config"; // REMOVED hardcoded usage

type ExerciseCategory = "relaxation" | "breathing" | "grounding" | "mindfulness";

type Exercise = {
  id: number;
  title: string;
  category: ExerciseCategory | string;
  duration: string;
  difficulty: string;
  moodType: string;
  goal: string;
  steps: string[];
};

const API_URL = "http://localhost:8080";

interface CopingExercisesProps {
  userId: string; // NEW: Required prop
  initialQuery?: string;
  initialCategory?: string;
}

export default function CopingExercises({ userId, initialQuery = "", initialCategory = "all" }: CopingExercisesProps) {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [selectedCategory, setSelectedCategory] = useState<ExerciseCategory | "all">(initialCategory as any);
  const [selectedDuration, setSelectedDuration] = useState<"all" | "short" | "medium" | "long">("all");
  const [selectedMood, setSelectedMood] = useState<"all" | "anxious" | "low" | "overwhelmed">("all");
  const [query, setQuery] = useState(initialQuery);

  // Completion State
  const [completedIds, setCompletedIds] = useState<number[]>([]);
  const [completingId, setCompletingId] = useState<number | null>(null);

  // Load exercises and completion status
  useEffect(() => {
    if (!userId) return; // Wait for user

    const fetchData = async () => {
      try {
        // 1. Fetch Exercises
        const resEx = await fetch(`${API_URL}/api/exercises`);
        if (!resEx.ok) throw new Error("Failed to load exercises");
        const dataEx = await resEx.json();

        // 2. Fetch Completed
        let completed: number[] = [];
        try {
          const resComp = await fetch(`${API_URL}/api/users/${userId}/completed-exercises`);
          if (resComp.ok) {
            const dataComp = await resComp.json();
            completed = dataComp.map((e: any) => e.id);
          }
        } catch (e) {
          console.warn("Could not load completed exercises", e);
        }
        setCompletedIds(completed);

        const mapped: Exercise[] = dataEx.map((ex: any) => {
          // Fix parsing of steps to handle \n properly
          let parsedSteps: string[] = [];
          if (Array.isArray(ex.steps)) {
            parsedSteps = ex.steps;
          } else if (ex.instructions) {
            // Split by newline and clean up
            parsedSteps = ex.instructions.split(/\r?\n/).map((s: string) => s.trim()).filter(Boolean);
          } else if (ex.steps) {
            parsedSteps = String(ex.steps).split(/\r?\n/).map((s: string) => s.trim()).filter(Boolean);
          }

          return {
            id: ex.id,
            title: ex.title ?? "",
            category: ex.category ?? "",
            duration: String(ex.duration ? ex.duration + " min" : ""),
            difficulty: ex.difficulty ?? "",
            moodType: ex.moodType ?? "",
            goal: ex.goal ?? ex.description ?? "",
            steps: parsedSteps
          };
        });

        setExercises(mapped);
        setLoading(false);
      } catch (err: any) {
        console.error(err);
        setError(err.message ?? "Could not load exercises");
        setLoading(false);
      }
    };
    fetchData();
  }, [userId]); // Depend on userId

  // Update query/category if props change (from AI suggestion)
  useEffect(() => {
    if (initialQuery) setQuery(initialQuery);
    if (initialCategory && initialCategory !== "all") setSelectedCategory(initialCategory as any);
  }, [initialQuery, initialCategory]);


  const handleMarkComplete = async (exerciseId: number) => {
    if (completingId === exerciseId || completedIds.includes(exerciseId)) return;
    setCompletingId(exerciseId);
    try {
      const res = await fetch(`${API_URL}/api/users/${userId}/exercises/${exerciseId}`, {
        method: "POST"
      });
      if (res.ok) {
        setCompletedIds((prev) => [...prev, exerciseId]);
      }
    } catch (error) {
      console.error("Failed to complete exercise", error);
    } finally {
      setCompletingId(null);
    }
  };


  // Filter Logic
  const filtered = exercises.filter((ex) => {
    const categoryLower = (ex.category || "").toString().toLowerCase();
    const matchesCategory = selectedCategory === "all" || categoryLower === selectedCategory;

    const durationNum = parseInt((ex.duration || "0").replace(/\D/g, ""), 10) || 0;
    const matchesDuration =
      selectedDuration === "all" ||
      (selectedDuration === "short" && durationNum > 0 && durationNum < 5) ||
      (selectedDuration === "medium" && durationNum >= 5 && durationNum < 10) ||
      (selectedDuration === "long" && durationNum >= 10);

    const moodLower = (ex.moodType || "").toLowerCase();
    const matchesMood = selectedMood === "all" || moodLower.includes(selectedMood);

    const q = (query || "").toLowerCase();
    const matchesQuery = !q || ex.title.toLowerCase().includes(q) || ex.goal.toLowerCase().includes(q);

    return matchesCategory && matchesDuration && matchesMood && matchesQuery;
  });

  if (loading) return <div className="p-8 text-center text-[#8c7e76]">Loading warm fuzzies...</div>;
  if (error) return <div className="p-8 text-center text-[#e6a394] font-bold">{error}</div>;

  return (
    <div className="space-y-6">

      {/* Search & Filter Bar */}
      <div className="bg-[#fdfbf9] p-6 rounded-[2rem] border-4 border-[#efeae6]">

        {/* Top Row: Search */}
        <div className="mb-6">
          <div className="relative">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for calm..."
              className="w-full rounded-full bg-white border-2 border-[#efeae6] px-6 py-3 text-sm text-[#5c4b43] placeholder-[#bcaaa4] focus:outline-none focus:border-[#e6a394] transition-colors"
            />
            <span className="absolute right-4 top-3 text-lg">🔍</span>
          </div>
        </div>

        {/* Filters Grid */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center">

          {/* Category Pills */}
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
                className={`rounded-full px-4 py-2 text-sm font-bold transition-all duration-200 ${selectedCategory === cat.id
                  ? "bg-[#e6a394] text-white shadow-md transform scale-105"
                  : "bg-white text-[#8c7e76] border-2 border-[#efeae6] hover:border-[#d6ccc8]"
                  }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Dropdowns */}
          <div className="flex gap-2">
            <SelectFilter
              value={selectedDuration}
              onChange={(e: any) => setSelectedDuration(e.target.value)}
              options={[
                { val: "all", label: "⏱️ Any Time" },
                { val: "short", label: "⚡ Short" },
                { val: "medium", label: "🍵 Medium" },
                { val: "long", label: "🌙 Long" },
              ]}
            />
            <SelectFilter
              value={selectedMood}
              onChange={(e: any) => setSelectedMood(e.target.value)}
              options={[
                { val: "all", label: "😊 Any Mood" },
                { val: "anxious", label: "😰 Anxious" },
                { val: "low", label: "🌧️ Low" },
                { val: "overwhelmed", label: "🤯 Overwhelmed" },
              ]}
            />
          </div>
        </div>
      </div>

      {/* Results Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-[2rem] border-4 border-[#efeae6] border-dashed">
          <p className="text-[#8c7e76] font-bold">No exercises match specific filters.</p>
          <p className="text-sm text-[#bcaaa4]">Try selecting "All" to see everything.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {filtered.map((exercise) => {
            const isCompleted = completedIds.includes(exercise.id);
            return (
              <div
                key={exercise.id}
                className={`p-6 rounded-[2.5rem] border-4 transition-all shadow-sm flex flex-col h-full relative overflow-hidden group
                 ${isCompleted ? "bg-[#f0fdf4] border-[#dcfce7]" : "bg-white border-[#efeae6] hover:border-[#e6a394]"}
              `}
              >
                {/* Card Header */}
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-extrabold text-[#5c4b43]">{exercise.title}</h3>
                    <span className="text-xs font-bold text-[#a3b899] uppercase tracking-wide bg-[#f4f7f2] px-2 py-1 rounded-lg mt-1 inline-block">
                      {exercise.category}
                    </span>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="bg-[#fff0ed] text-[#e6a394] text-xs font-bold px-3 py-1 rounded-full border border-[#ffe0db]">
                      {exercise.duration}
                    </span>
                    {isCompleted && (
                      <span className="bg-emerald-100 text-emerald-600 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-200 uppercase tracking-wider">
                        Completed
                      </span>
                    )}
                  </div>
                </div>

                <p className="text-sm text-[#8c7e76] mb-6 italic">
                  "{exercise.goal}"
                </p>

                {/* Steps List */}
                <div className="bg-[#fdfbf9] rounded-2xl p-5 mb-4 flex-1">
                  <ul className="space-y-3">
                    {exercise.steps.map((step, index) => (
                      <li key={index} className="flex gap-3 text-sm text-[#5c4b43]">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#e6a394] text-white flex items-center justify-center font-bold text-xs mt-0.5">
                          {index + 1}
                        </span>
                        <span className="leading-relaxed">{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Footer Tags & Action */}
                <div className="flex items-center justify-between mt-auto pt-2">
                  <div className="flex gap-2">
                    {exercise.moodType && (
                      <span className="text-xs font-bold text-[#8c7e76] bg-[#f5f5f4] px-3 py-1 rounded-full">
                        For: {exercise.moodType}
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => handleMarkComplete(exercise.id)}
                    disabled={isCompleted || completingId === exercise.id}
                    className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all shadow-sm
                      ${isCompleted
                        ? "bg-emerald-500 text-white cursor-default"
                        : "bg-[#5c4b43] text-white hover:bg-[#4a3b36] hover:scale-105 active:scale-95"
                      }
                   `}
                  >
                    {isCompleted ? "Done ✓" : completingId === exercise.id ? "Saving..." : "Mark Complete"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// Helper for stylized selects
function SelectFilter({ value, onChange, options }: any) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={onChange}
        className="appearance-none bg-white border-2 border-[#efeae6] text-[#5c4b43] font-bold text-xs px-4 py-2 pr-8 rounded-full focus:outline-none focus:border-[#e6a394] cursor-pointer"
      >
        {options.map((o: any) => (
          <option key={o.val} value={o.val}>{o.label}</option>
        ))}
      </select>
      {/* Custom Arrow */}
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-[#8c7e76]">
        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
      </div>
    </div>
  )
}