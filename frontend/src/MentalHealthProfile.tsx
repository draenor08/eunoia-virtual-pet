import { useEffect, useState } from "react";
import { API_URL } from './config';

interface MentalHealthProfileProps {
  userId: string;
  onLogout: () => void;
}

function MentalHealthProfile({ userId, onLogout }: MentalHealthProfileProps) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [preferences, setPreferences] = useState("");
  const [password, setPassword] = useState("");
  const [progress, setProgress] = useState("");
  const [updates, setUpdates] = useState("");
  const [profilePictureUrl, setProfilePictureUrl] = useState("");
  const [showPhotoInput, setShowPhotoInput] = useState(false);
  const [status, setStatus] =
    useState<"idle" | "saving" | "saved" | "error">("idle");

  // Load existing user & completed exercises
  useEffect(() => {
    if (!userId) return;

    const fetchUserAndExercises = async () => {
      try {
        const res = await fetch(`${API_URL}/api/users/${userId}`);
        if (!res.ok) {
          console.warn("User not found or error loading user");
          return;
        }
        const data = await res.json();
        setFirstName(data.firstName ?? "");
        setLastName(data.lastName ?? "");
        setEmail(data.email ?? "");
        setPreferences(data.preferences ?? "");
        // setProgress(data.progress ?? "");
        setUpdates(data.updates ?? "");
        setProfilePictureUrl(data.profilePictureUrl ?? "");

        // Fetch completed exercises
        const resEx = await fetch(`${API_URL}/api/users/${userId}/completed-exercises`);
        if (resEx.ok) {
          const exercises = await resEx.json();
          if (exercises.length > 0) {
            const titles = exercises.map((e: any) => `• ${e.title}`).join("\n");
            setProgress(`You have completed ${exercises.length} exercises:\n${titles}`);

            const latest = exercises[0];
            setUpdates(`Great job completing "${latest.title}"! Keep up the momentum. Check My Room for more.`);
          } else {
            setProgress("No exercises completed yet. Try visiting the Coping section!");
            setUpdates("Welcome! Talk to your pet in My Room to get started.");
          }
        }

      } catch (err) {
        console.error("Failed to load user or exercises", err);
      }
    };
    fetchUserAndExercises();
  }, [userId]);

  const handleSave = async () => {
    setStatus("saving");
    try {
      const res = await fetch(`${API_URL}/api/users/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          phoneNumber: null,
          passwordHash: password || undefined, // Only send if changed
          preferences,
          progress,
          updates,
          profilePictureUrl,
        }),
      });

      if (!res.ok) {
        console.error("Failed to save profile", await res.text());
        setStatus("error");
        return;
      }

      setStatus("saved");
      setTimeout(() => setStatus("idle"), 1500);
      setShowPhotoInput(false);
    } catch (err) {
      console.error("Error saving profile", err);
      setStatus("error");
    }
  };

  // NEW stylish Tailwind layout
  return (
    <div className="flex items-start justify-center h-full">
      <div className="w-full max-w-3xl rounded-[3rem] bg-white/90 shadow-2xl backdrop-blur-lg border-4 border-white px-8 py-6 md:px-10 md:py-8 overflow-visible">
        {/* Header */}
        <div className="flex flex-col gap-4 border-b border-[#efeae6] pb-5 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <div className="relative group">
              <div className="h-24 w-24 rounded-full bg-[#fdfbf9] border-4 border-[#e6a394] shadow-md overflow-hidden flex items-center justify-center">
                {profilePictureUrl ? (
                  <img src={profilePictureUrl} alt="Profile" className="h-full w-full object-cover" />
                ) : (
                  <div className="text-3xl font-bold text-[#5c4b43]">
                    {firstName ? firstName.charAt(0).toUpperCase() : "U"}
                  </div>
                )}
              </div>
              <button
                onClick={() => setShowPhotoInput(!showPhotoInput)}
                className="absolute bottom-0 right-0 bg-[#5c4b43] text-white p-1.5 rounded-full shadow-lg hover:scale-110 transition border-2 border-white"
              >
                ✏️
              </button>
            </div>

            <div>
              <h1 className="text-3xl font-extrabold text-[#5c4b43]">Profile</h1>
              <p className="text-sm text-[#8c7e76]">
                Edit your personal details.
              </p>
            </div>
          </div>

          <button
            onClick={onLogout}
            className="group flex items-center gap-2 rounded-full border-2 border-red-100 bg-red-50 px-4 py-2 text-xs font-bold uppercase tracking-wider text-red-500 transition-all hover:bg-red-500 hover:text-white hover:border-red-500"
          >
            Sign Out 🚪
          </button>

          {/* Photo URL Input Dropdown */}
          {showPhotoInput && (
            <div className="absolute top-24 left-10 z-10 p-4 bg-white rounded-xl shadow-xl border border-slate-200 w-64 animate-in fade-in zoom-in duration-200">
              <label className="text-xs font-bold text-[#5c4b43] mb-1 block">Upload Photo</label>

              {/* File Input */}
              <input
                type="file"
                accept="image/*"
                onChange={async (e) => {
                  if (e.target.files && e.target.files[0]) {
                    const file = e.target.files[0];
                    const formData = new FormData();
                    formData.append("file", file);

                    try {
                      const res = await fetch(`${API_URL}/api/users/${userId}/photo`, {
                        method: "POST",
                        body: formData,
                      });
                      if (res.ok) {
                        const url = await res.text();
                        setProfilePictureUrl(url);
                      } else {
                        console.error("Upload failed");
                      }
                    } catch (err) {
                      console.error("Upload error", err);
                    }
                  }
                }}
                className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-[#fdfbf9] file:text-[#5c4b43] hover:file:bg-[#efeae6] mb-3"
              />

              <div className="text-center text-[10px] text-gray-400 mb-2">- OR -</div>

              <label className="text-xs font-bold text-[#5c4b43] mb-1 block">Image URL</label>
              <input
                className="w-full p-2 border border-slate-200 rounded-lg text-sm mb-2 outline-none focus:border-[#e6a394]"
                placeholder="https://..."
                value={profilePictureUrl}
                onChange={(e) => setProfilePictureUrl(e.target.value)}
              />
              <div className="flex justify-end gap-2">
                <button onClick={() => setShowPhotoInput(false)} className="text-xs font-bold text-slate-400 hover:text-slate-600">Done</button>
              </div>
            </div>
          )}

        </div>

        {/* Content */}
        <div className="mt-6 space-y-6">
          {/* Basic info */}
          <section className="space-y-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
              Basic info
            </p>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-1.5">
                <label
                  htmlFor="firstName"
                  className="text-xs font-medium text-slate-600"
                >
                  First name
                </label>
                <input
                  id="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Your first name"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none transition hover:bg-white focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                />
              </div>
              <div className="space-y-1.5">
                <label
                  htmlFor="lastName"
                  className="text-xs font-medium text-slate-600"
                >
                  Last name
                </label>
                <input
                  id="lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Your last name"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none transition hover:bg-white focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                />
              </div>
              <div className="space-y-1.5 md:col-span-2">
                <label
                  htmlFor="email"
                  className="text-xs font-medium text-slate-600"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none transition hover:bg-white focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                />
              </div>
            </div>
          </section>

          {/* Security */}
          <section className="space-y-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
              Security
            </p>
            <div className="space-y-1.5">
              <label
                htmlFor="password"
                className="text-xs font-medium text-slate-600"
              >
                Change password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter a new password"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none transition hover:bg-white focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
              />
            </div>
          </section>

          {/* Preferences */}
          <section className="space-y-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
              Preferences
            </p>
            <div className="space-y-1.5">
              <label
                htmlFor="preferences"
                className="text-xs font-medium text-slate-600"
              >
                Mental health preferences
              </label>
              <textarea
                id="preferences"
                value={preferences}
                onChange={(e) => setPreferences(e.target.value)}
                placeholder="Tell us what type of support, content or communication style works best for you."
                className="min-h-[90px] w-full resize-y rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none transition hover:bg-white focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
              />
            </div>
          </section>

          {/* Your journey */}
          <section className="space-y-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
              Your journey
            </p>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-1.5">
                <label
                  htmlFor="progress"
                  className="text-xs font-medium text-slate-600"
                >
                  Progress
                </label>
                <textarea
                  id="progress"
                  value={progress}
                  onChange={(e) => setProgress(e.target.value)}
                  placeholder="Track milestones, reflections or recent check-ins."
                  className="min-h-[80px] w-full resize-y rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none transition hover:bg-white focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                />
              </div>
              <div className="space-y-1.5">
                <label
                  htmlFor="updates"
                  className="text-xs font-medium text-slate-600"
                >
                  Updates
                </label>
                <textarea
                  id="updates"
                  value={updates}
                  onChange={(e) => setUpdates(e.target.value)}
                  placeholder="Notes from your coach, therapist or app."
                  className="min-h-[80px] w-full resize-y rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none transition hover:bg-white focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                />
              </div>
            </div>
          </section>

          {/* Footer */}
          <div className="mt-2 flex flex-col items-start justify-between gap-3 border-t border-slate-200 pt-4 sm:flex-row sm:items-center">
            <div className="text-xs">
              {status === "saved" && (
                <span className="text-emerald-500">Changes saved.</span>
              )}
              {status === "error" && (
                <span className="text-red-500">
                  Could not save. Please try again.
                </span>
              )}
              {status === "saving" && (
                <span className="text-slate-500">Saving…</span>
              )}
            </div>

            <button
              type="button"
              onClick={handleSave}
              disabled={status === "saving"}
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-violet-600 to-sky-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-violet-500/40 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <span className="text-lg leading-none">✓</span>
              <span>{status === "saving" ? "Saving…" : "Save changes"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MentalHealthProfile;



// import { useEffect, useState } from "react";

// const API_URL = "http://localhost:8080";
// const USER_ID = 1;


// function MentalHealthProfile() {
//   const [firstName, setFirstName] = useState("");
//   const [lastName, setLastName] = useState("");
//   const [email, setEmail] = useState("");
//   const [preferences, setPreferences] = useState("");
//   const [password, setPassword] = useState("");
//   const [progress, setProgress] = useState("");
//   const [updates, setUpdates] = useState("");
//   const [status, setStatus] =
//     useState<"idle" | "saving" | "saved" | "error">("idle");

//   // Load existing user
//   useEffect(() => {
//     const fetchUser = async () => {
//       try {
//         const res = await fetch(`${API_URL}/api/users/${USER_ID}`);
//         if (!res.ok) {
//           console.warn("User not found or error loading user");
//           return;
//         }
//         const data = await res.json();
//         setFirstName(data.firstName ?? "");
//         setLastName(data.lastName ?? "");
//         setEmail(data.email ?? "");
//         setPreferences(data.preferences ?? "");
//         setProgress(data.progress ?? "");
//         setUpdates(data.updates ?? "");
//       } catch (err) {
//         console.error("Failed to load user", err);
//       }
//     };
//     fetchUser();
//   }, []);

//   const handleSave = async () => {
//     setStatus("saving");
//     try {
//       const res = await fetch(`${API_URL}/api/users/${USER_ID}`, {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           firstName,
//           lastName,
//           email,
//           phoneNumber: null,
//           password: password || "secret123",
//           preferences,
//           progress,
//           updates,
//         }),
//       });

//       if (!res.ok) {
//         console.error("Failed to save profile", await res.text());
//         setStatus("error");
//         return;
//       }

//       setStatus("saved");
//       setTimeout(() => setStatus("idle"), 1500);
//     } catch (err) {
//       console.error("Error saving profile", err);
//       setStatus("error");
//     }
//   };

//   // NEW stylish Tailwind layout
//   return (
//     <div className="min-h-[calc(100vh-120px)] flex items-start justify-center">
//       <div className="w-full max-w-5xl rounded-3xl bg-white shadow-2xl border border-slate-100 px-8 py-6 md:px-10 md:py-8">
//         {/* Header */}
//         <div className="flex flex-col gap-4 border-b border-slate-200 pb-5 md:flex-row md:items-center md:justify-between">
//           <div className="flex items-center gap-4">
//             <div className="h-16 w-16 rounded-full bg-gradient-to-tr from-sky-400 via-purple-500 to-pink-500 p-[3px]">
//               <div className="flex h-full w-full items-center justify-center rounded-full bg-slate-900 text-xl font-semibold text-white">
//                 {firstName ? firstName.charAt(0).toUpperCase() : "U"}
//               </div>
//             </div>
//             <div>
//               <h1 className="text-xl font-semibold text-slate-900">Profile</h1>
//               <p className="text-sm text-slate-500">
//                 Edit your personal details, security and mental health
//                 preferences.
//               </p>
//             </div>
//           </div>

//           <button
//             type="button"
//             className="self-start rounded-full border border-slate-200 px-4 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50"
//           >
//             Change photo
//           </button>
//         </div>

//         {/* Content */}
//         <div className="mt-6 space-y-6">
//           {/* Basic info */}
//           <section className="space-y-3">
//             <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
//               Basic info
//             </p>
//             <div className="grid gap-4 md:grid-cols-2">
//               <div className="space-y-1.5">
//                 <label
//                   htmlFor="firstName"
//                   className="text-xs font-medium text-slate-600"
//                 >
//                   First name
//                 </label>
//                 <input
//                   id="firstName"
//                   value={firstName}
//                   onChange={(e) => setFirstName(e.target.value)}
//                   placeholder="Your first name"
//                   className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none transition hover:bg-white focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
//                 />
//               </div>
//               <div className="space-y-1.5">
//                 <label
//                   htmlFor="lastName"
//                   className="text-xs font-medium text-slate-600"
//                 >
//                   Last name
//                 </label>
//                 <input
//                   id="lastName"
//                   value={lastName}
//                   onChange={(e) => setLastName(e.target.value)}
//                   placeholder="Your last name"
//                   className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none transition hover:bg-white focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
//                 />
//               </div>
//               <div className="space-y-1.5 md:col-span-2">
//                 <label
//                   htmlFor="email"
//                   className="text-xs font-medium text-slate-600"
//                 >
//                   Email
//                 </label>
//                 <input
//                   id="email"
//                   type="email"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   placeholder="name@example.com"
//                   className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none transition hover:bg-white focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
//                 />
//               </div>
//             </div>
//           </section>

//           {/* Security */}
//           <section className="space-y-3">
//             <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
//               Security
//             </p>
//             <div className="space-y-1.5">
//               <label
//                 htmlFor="password"
//                 className="text-xs font-medium text-slate-600"
//               >
//                 Change password
//               </label>
//               <input
//                 id="password"
//                 type="password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 placeholder="Enter a new password"
//                 className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none transition hover:bg-white focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
//               />
//             </div>
//           </section>

//           {/* Preferences */}
//           <section className="space-y-3">
//             <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
//               Preferences
//             </p>
//             <div className="space-y-1.5">
//               <label
//                 htmlFor="preferences"
//                 className="text-xs font-medium text-slate-600"
//               >
//                 Mental health preferences
//               </label>
//               <textarea
//                 id="preferences"
//                 value={preferences}
//                 onChange={(e) => setPreferences(e.target.value)}
//                 placeholder="Tell us what type of support, content or communication style works best for you."
//                 className="min-h-[90px] w-full resize-y rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none transition hover:bg-white focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
//               />
//             </div>
//           </section>

//           {/* Your journey */}
//           <section className="space-y-3">
//             <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
//               Your journey
//             </p>
//             <div className="grid gap-4 md:grid-cols-2">
//               <div className="space-y-1.5">
//                 <label
//                   htmlFor="progress"
//                   className="text-xs font-medium text-slate-600"
//                 >
//                   Progress
//                 </label>
//                 <textarea
//                   id="progress"
//                   value={progress}
//                   onChange={(e) => setProgress(e.target.value)}
//                   placeholder="Track milestones, reflections or recent check-ins."
//                   className="min-h-[80px] w-full resize-y rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none transition hover:bg-white focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
//                 />
//               </div>
//               <div className="space-y-1.5">
//                 <label
//                   htmlFor="updates"
//                   className="text-xs font-medium text-slate-600"
//                 >
//                   Updates
//                 </label>
//                 <textarea
//                   id="updates"
//                   value={updates}
//                   onChange={(e) => setUpdates(e.target.value)}
//                   placeholder="Notes from your coach, therapist or app."
//                   className="min-h-[80px] w-full resize-y rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none transition hover:bg-white focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
//                 />
//               </div>
//             </div>
//           </section>

//           {/* Footer */}
//           <div className="mt-2 flex flex-col items-start justify-between gap-3 border-t border-slate-200 pt-4 sm:flex-row sm:items-center">
//             <div className="text-xs">
//               {status === "saved" && (
//                 <span className="text-emerald-500">Changes saved.</span>
//               )}
//               {status === "error" && (
//                 <span className="text-red-500">
//                   Could not save. Please try again.
//                 </span>
//               )}
//               {status === "saving" && (
//                 <span className="text-slate-500">Saving…</span>
//               )}
//             </div>

//             <button
//               type="button"
//               onClick={handleSave}
//               disabled={status === "saving"}
//               className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-violet-600 to-sky-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-violet-500/40 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
//             >
//               <span className="text-lg leading-none">✓</span>
//               <span>{status === "saving" ? "Saving…" : "Save changes"}</span>
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default MentalHealthProfile;
