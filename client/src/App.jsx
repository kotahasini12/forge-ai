import Login from "./Login";
import Register from "./Register";
import { useEffect, useMemo, useState } from "react";
import {
  Activity, ArrowRight, Check, ChevronDown, Clock3, Dumbbell, Flame,
  Play, Search, Sparkles, Target, X, CalendarDays, ChartNoAxesCombined,
  Plus, Trash2, RotateCcw, Utensils, Droplets
} from "lucide-react";
import { exercises, groups } from "./data/exercises";

// Static anatomical pictures
const exerciseImage = (exercise) => `/images/exercises/${exercise.id}.jpg`;

function ExercisePicture({ exercise, className = "" }) {
  const [imageFailed, setImageFailed] = useState(false);

  return (
    <div
      className={`exercise-picture ${className}`}
      style={{
        background: "#f4f1eb",
        borderRadius: 14,
        overflow: "hidden",
        minHeight: 190,
        display: "grid",
        placeItems: "center",
        position: "relative"
      }}
    >
      {!imageFailed ? (
        <img
          src={exerciseImage(exercise)}
          alt={`${exercise.name} anatomical exercise illustration with target muscles highlighted`}
          onError={() => setImageFailed(true)}
          style={{
            width: "100%",
            height: "100%",
            minHeight: 190,
            objectFit: "contain",
            display: "block"
          }}
        />
      ) : (
        <div style={{ padding: 24, textAlign: "center", color: "#59635b" }}>
          <Dumbbell size={30} style={{ marginBottom: 10, opacity: 0.65 }} />
          <div style={{ fontSize: 11, letterSpacing: 2, fontWeight: 700 }}>
            ANATOMICAL IMAGE
          </div>
          <div style={{ fontSize: 13, marginTop: 6 }}>{exercise.name}</div>
          <div style={{ fontSize: 11, marginTop: 8, opacity: 0.7 }}>
            Add image: {exercise.id}.jpg
          </div>
        </div>
      )}
    </div>
  );
}

const muscleTargets = {
  plank: ["Core", "Shoulders", "Glutes"],
  crunch: ["Rectus abdominis"],
  "leg-raise": ["Lower abdominals", "Hip flexors"],
  "push-up": ["Chest", "Triceps", "Front deltoids"],
  "db-press": ["Chest", "Triceps", "Front deltoids"],
  row: ["Lats", "Rhomboids", "Biceps"],
  "lat-pulldown": ["Latissimus dorsi", "Upper back", "Biceps"],
  "lateral-raise": ["Side deltoids"],
  "shoulder-press": ["Deltoids", "Triceps"],
  "pike-pushup": ["Shoulders", "Triceps"],
  "front-raise": ["Front deltoids"],
  squat: ["Quadriceps", "Glutes", "Core"],
  lunges: ["Quadriceps", "Glutes", "Hamstrings"],
  bicep: ["Biceps", "Forearms"],
  triceps: ["Triceps"]
};

const starterPlan = [
  { day: "Monday", focus: "Chest", exerciseIds: ["push-up", "db-press"] },
  { day: "Tuesday", focus: "Back", exerciseIds: ["row", "lat-pulldown"] },
  { day: "Wednesday", focus: "Recovery", exerciseIds: [] },
  { day: "Thursday", focus: "Shoulders", exerciseIds: ["lateral-raise", "shoulder-press"] },
  { day: "Friday", focus: "Legs", exerciseIds: ["squat", "lunges"] },
  { day: "Saturday", focus: "Arms + Core", exerciseIds: ["bicep", "triceps", "plank"] },
  { day: "Sunday", focus: "Rest", exerciseIds: [] }
];

const readStorage = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

function App() {
  const [authPage, setAuthPage] = useState(() => {
    return localStorage.getItem("forge_token") ? "home" : "login";
  });

  const [loggedInUser, setLoggedInUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("forge_user")) || null;
    } catch {
      return null;
    }
  });
  const [view, setView] = useState("library");
  const [group, setGroup] = useState("All");
  const [level, setLevel] = useState("All levels");
  const [place, setPlace] = useState("Any location");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const [activeWorkout, setActiveWorkout] = useState(null);
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);
  const [history, setHistory] = useState(() => readStorage("forge-workout-history", []));
  const [plan, setPlan] = useState(() => readStorage("forge-weekly-plan", starterPlan));
  const [planDay, setPlanDay] = useState("Monday");
  const [planExercise, setPlanExercise] = useState(exercises[0].id);
  const [notice, setNotice] = useState("");
  const [dietType, setDietType] = useState(() => readStorage("forge-diet-type", "Vegetarian"));
  const [fitnessGoal, setFitnessGoal] = useState(() => readStorage("forge-diet-goal", "Build strength"));
  const [mealsDone, setMealsDone] = useState(() => readStorage("forge-meals-done", []));
  const [waterGlasses, setWaterGlasses] = useState(() => readStorage("forge-water-glasses", 0));

  useEffect(() => {
    localStorage.setItem("forge-workout-history", JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    localStorage.setItem("forge-weekly-plan", JSON.stringify(plan));
  }, [plan]);

  useEffect(() => {
    localStorage.setItem("forge-diet-type", JSON.stringify(dietType));
  }, [dietType]);

  useEffect(() => {
    localStorage.setItem("forge-diet-goal", JSON.stringify(fitnessGoal));
  }, [fitnessGoal]);

  useEffect(() => {
    localStorage.setItem("forge-meals-done", JSON.stringify(mealsDone));
  }, [mealsDone]);

  useEffect(() => {
    localStorage.setItem("forge-water-glasses", JSON.stringify(waterGlasses));
  }, [waterGlasses]);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setSeconds(s => s + 1), 1000);
    return () => clearInterval(id);
  }, [running]);

  const visible = useMemo(() => exercises.filter(e =>
    (group === "All" || e.group === group) &&
    (level === "All levels" || e.level === level) &&
    (place === "Any location" || e.place.includes(place)) &&
    `${e.name} ${e.group} ${e.equipment}`.toLowerCase().includes(search.toLowerCase())
  ), [group, level, place, search]);

  const todayKey = new Date().toLocaleDateString();
  const completedToday = history.filter(item => item.dateLabel === todayKey).length;
  const totalMinutes = Math.round(
    history.reduce((sum, item) => sum + item.durationSeconds, 0) / 60
  );
  const weeklyCount = history.filter(
    item => Date.now() - item.completedAt < 7 * 24 * 60 * 60 * 1000
  ).length;

  const time = `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;

  const startWorkout = exercise => {
    setSelected(null);
    setActiveWorkout(exercise);
    setSeconds(0);
    setRunning(false);
  };

  const closeWorkout = () => {
    setActiveWorkout(null);
    setRunning(false);
    setSeconds(0);
  };


  const completeWorkout = async () => {
    const now = new Date();

    // Save in local workout history
    setHistory(prev => [{
      id: `${Date.now()}-${activeWorkout.id}`,
      exerciseId: activeWorkout.id,
      exerciseName: activeWorkout.name,
      group: activeWorkout.group,
      durationSeconds: seconds,
      completedAt: now.getTime(),
      dateLabel: now.toLocaleDateString()
    }, ...prev].slice(0, 100));

    // Save in MongoDB
    try {
      const token = localStorage.getItem("forge_token");

      if (!token) {
        throw new Error("Please login again.");
      }

      const response = await fetch("http://localhost:5000/api/workouts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          exerciseName: activeWorkout.name,
          muscleGroup: activeWorkout.group || "General",
          sets: Number(activeWorkout.sets) || 3,
          reps: Number(activeWorkout.reps) || 12,
          duration: seconds,
          weight: 0
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Workout save failed.");
      }

      setNotice(`${activeWorkout.name} saved to MongoDB and workout history!`);

    } catch (error) {
      console.error("Workout sync error:", error);
      setNotice(`${activeWorkout.name} saved locally. Server sync failed.`);
    }

    closeWorkout();
    setTimeout(() => setNotice(""), 3500);
  };


  const addPlanExercise = () => {
    const exercise = exercises.find(e => e.id === planExercise);
    setPlan(prev => prev.map(day => day.day === planDay
      ? {
        ...day,
        exerciseIds: day.exerciseIds.includes(exercise.id)
          ? day.exerciseIds
          : [...day.exerciseIds, exercise.id],
        focus: day.focus === "Recovery" || day.focus === "Rest"
          ? exercise.group
          : day.focus
      }
      : day
    ));
  };

  const removePlanExercise = (dayName, id) => {
    setPlan(prev => prev.map(day => day.day === dayName
      ? { ...day, exerciseIds: day.exerciseIds.filter(item => item !== id) }
      : day
    ));
  };

  const resetPlan = () => {
    setPlan(starterPlan);
    setNotice("Weekly plan reset to the starter schedule.");
    setTimeout(() => setNotice(""), 3000);
  };
  function handleLogout() {
    localStorage.removeItem("forge_token");
    localStorage.removeItem("forge_user");

    setLoggedInUser(null);
    setAuthPage("login");
  }

  const nav = [
    { id: "library", label: "Exercise library", icon: Activity },
    { id: "planner", label: "Workout planner", icon: CalendarDays },
    { id: "progress", label: "My progress", icon: ChartNoAxesCombined },
    { id: "nutrition", label: "Nutrition planner", icon: Flame }
  ];
  if (authPage === "login") {
    return (
      <Login
        onLogin={(user) => {
          setLoggedInUser(user);
          setAuthPage("home");
        }}
        onSwitchRegister={() => setAuthPage("register")}
      />
    );
  }

  if (authPage === "register") {
    return (
      <Register
        onRegistered={() => setAuthPage("login")}
        onSwitchLogin={() => setAuthPage("login")}
      />
    );
  }
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <a className="brand" href="#" onClick={() => setView("library")}>
          <span className="brand-mark"><Dumbbell size={21} /></span>
          <span>FORGE<span className="brand-ai"> AI</span></span>
        </a>
        <div className="sidebar-profile">
          <div className="profile-avatar">
            {loggedInUser?.name?.charAt(0)?.toUpperCase() || "U"}
          </div>

          <div className="profile-info">
            <strong>{loggedInUser?.name || "FORGE Member"}</strong>
            <span>{loggedInUser?.email || "Welcome to FORGE AI"}</span>
            <span>{loggedInUser?.fitnessGoal || "Fitness Journey"}</span>
          </div>
        </div>

        <div className="side-label">WORKSPACE</div>

        {nav.map(item => (
          <button
            key={item.id}
            className={`nav-item ${view === item.id ? "active" : ""}`}
            onClick={() => setView(item.id)}
          >
            <item.icon size={18} />
            {item.label}
          </button>
        ))}
        <button
          className="nav-item"
          onClick={handleLogout}
          style={{ marginTop: "20px", color: "#c6f36b" }}
        >
          <span>↪</span>
          Logout
        </button>

        <div className="sidebar-bottom">
          <div className="mini-avatar">F</div>
          <div>
            <b>Your training space</b>
            <small>Local-first · saved on this device</small>
          </div>
        </div>
      </aside>

      <main className="main">
        <header className="topbar">
          <div className="breadcrumb">
            Workspace <span>/</span> {nav.find(n => n.id === view)?.label}
          </div>
          <div className="top-right">
            <span className="status-dot" /> LOCAL MODE
            <div className="avatar">A</div>
          </div>
        </header>

        {view === "library" && (
          <>
            <section className="hero">
              <div className="hero-copy">
                <div className="eyebrow"><span /> YOUR TRAINING STARTS HERE</div>
                <h1>Train with intent.<br /><em>Get stronger.</em></h1>
                <p>
                  Find the right movement, learn the basics, and build
                  consistency — one session at a time.
                </p>
                <button
                  className="hero-btn"
                  onClick={() => document.getElementById("library").scrollIntoView({ behavior: "smooth" })}
                >
                  Explore exercises <ArrowRight size={17} />
                </button>
              </div>

              <div className="hero-art">
                <div className="orbit orbit-one" />
                <div className="orbit orbit-two" />
                <div className="hero-figure">
                  <div className="figure-head" />
                  <div className="figure-body" />
                  <div className="figure-arm left" />
                  <div className="figure-arm right" />
                  <div className="figure-leg left" />
                  <div className="figure-leg right" />
                </div>
                <div className="art-tag"><Sparkles size={14} /> BUILT FOR PROGRESS</div>
              </div>
            </section>

            <section className="stats">
              <div className="stat-card">
                <div className="stat-icon"><Dumbbell size={18} /></div>
                <div><strong>{exercises.length}</strong><small>EXERCISES</small></div>
              </div>
              <div className="stat-card">
                <div className="stat-icon"><Target size={18} /></div>
                <div><strong>{groups.length - 1}</strong><small>MUSCLE GROUPS</small></div>
              </div>
              <div className="stat-card">
                <div className="stat-icon"><Check size={18} /></div>
                <div><strong>{completedToday}</strong><small>COMPLETED TODAY</small></div>
              </div>
            </section>

            <section id="library" className="library-section">
              <div className="section-heading">
                <div>
                  <div className="eyebrow muted">THE MOVEMENT LIBRARY</div>
                  <h2>Find your next <em>move.</em></h2>
                </div>
                <span className="result-count">{visible.length} exercises available</span>
              </div>

              <div className="filters">
                <div className="searchbox">
                  <Search size={18} />
                  <input
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Search exercises or equipment..."
                  />
                  {search && (
                    <button onClick={() => setSearch("")}><X size={15} /></button>
                  )}
                </div>

                <label className="select-wrap">
                  <select value={level} onChange={e => setLevel(e.target.value)}>
                    <option>All levels</option>
                    <option>Beginner</option>
                    <option>Intermediate</option>
                    <option>Advanced</option>
                  </select>
                  <ChevronDown size={15} />
                </label>

                <label className="select-wrap">
                  <select value={place} onChange={e => setPlace(e.target.value)}>
                    <option>Any location</option>
                    <option>Home</option>
                    <option>Gym</option>
                  </select>
                  <ChevronDown size={15} />
                </label>
              </div>

              <div className="category-row">
                {groups.map(g => (
                  <button
                    key={g}
                    onClick={() => setGroup(g)}
                    className={`category ${group === g ? "chosen" : ""}`}
                  >
                    {g}
                  </button>
                ))}
              </div>

              <div className="exercise-grid">
                {visible.map((e, i) => (
                  <article className="exercise-card" key={e.id}>
                    <div
                      className="exercise-card-picture"
                      style={{ position: "relative", borderRadius: 14, overflow: "hidden" }}
                    >
                      <ExercisePicture exercise={e} />
                      <span className="visual-label">{e.group.toUpperCase()}</span>
                      <span className="visual-number">{String(i + 1).padStart(2, "0")}</span>
                    </div>

                    <div className="exercise-info">
                      <div className="card-meta">
                        <span>{e.level}</span><span>·</span><span>{e.place}</span>
                      </div>
                      <h3>{e.name}</h3>
                      <p>{e.description}</p>
                      <div className="card-footer">
                        <span><Dumbbell size={14} />{e.equipment}</span>
                        <button
                          aria-label={`View ${e.name}`}
                          onClick={() => setSelected(e)}
                        >
                          <ArrowRight size={17} />
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              {visible.length === 0 && (
                <div className="empty">
                  No exercises match those filters. Try a different search.
                </div>
              )}
            </section>
          </>
        )}

        {view === "planner" && (
          <section className="workspace-page">
            <div className="section-heading">
              <div>
                <div className="eyebrow muted">PLAN YOUR TRAINING WEEK</div>
                <h2>Weekly workout <em>planner.</em></h2>
                <p className="page-subtitle">
                  Build a simple routine and keep it saved on this device.
                </p>
              </div>
              <button className="secondary reset-button" onClick={resetPlan}>
                <RotateCcw size={15} /> Reset plan
              </button>
            </div>

            <div className="planner-toolbar">
              <label className="select-wrap">
                <select value={planDay} onChange={e => setPlanDay(e.target.value)}>
                  {plan.map(d => <option key={d.day}>{d.day}</option>)}
                </select>
                <ChevronDown size={15} />
              </label>

              <label className="select-wrap exercise-select">
                <select value={planExercise} onChange={e => setPlanExercise(e.target.value)}>
                  {exercises.map(e => (
                    <option key={e.id} value={e.id}>{e.name} · {e.group}</option>
                  ))}
                </select>
                <ChevronDown size={15} />
              </label>

              <button className="primary add-button" onClick={addPlanExercise}>
                <Plus size={16} /> Add exercise
              </button>
            </div>

            <div className="week-grid">
              {plan.map((day, index) => (
                <article className="day-card" key={day.day}>
                  <div className="day-top">
                    <span className="day-index">0{index + 1}</span>
                    <span className="day-name">{day.day}</span>
                  </div>
                  <h3>{day.focus}</h3>

                  {day.exerciseIds.length === 0 ? (
                    <div className="rest-state"><Clock3 size={17} /> Recovery / rest day</div>
                  ) : (
                    <ul className="plan-list">
                      {day.exerciseIds.map(id => {
                        const ex = exercises.find(e => e.id === id);
                        return ex ? (
                          <li key={id}>
                            <span>
                              <b>{ex.name}</b>
                              <small>{ex.sets} sets · {ex.reps}</small>
                            </span>
                            <button
                              title="Remove exercise"
                              onClick={() => removePlanExercise(day.day, id)}
                            >
                              <Trash2 size={14} />
                            </button>
                          </li>
                        ) : null;
                      })}
                    </ul>
                  )}
                </article>
              ))}
            </div>

            <p className="storage-note">
              <Check size={15} /> Your weekly plan saves automatically in this browser using local storage.
            </p>
          </section>
        )}

        {view === "progress" && (
          <section className="workspace-page">
            <div className="section-heading">
              <div>
                <div className="eyebrow muted">YOUR TRAINING ACTIVITY</div>
                <h2>Progress, one session <em>at a time.</em></h2>
                <p className="page-subtitle">
                  A simple view of workouts you have marked complete.
                </p>
              </div>
            </div>

            <div className="progress-stats">
              <div className="progress-card">
                <span>Total sessions</span><b>{history.length}</b><small>Saved workouts</small>
              </div>
              <div className="progress-card">
                <span>Last 7 days</span><b>{weeklyCount}</b><small>Completed sessions</small>
              </div>
              <div className="progress-card">
                <span>Training time</span><b>{totalMinutes} <i>min</i></b><small>Tracked timer duration</small>
              </div>
            </div>

            <div className="history-panel">
              <div className="panel-heading">
                <div><h3>Workout history</h3><p>Most recent completed exercises first</p></div>
                <span className="result-count">{history.length} records</span>
              </div>

              {history.length === 0 ? (
                <div className="empty-history">
                  <ChartNoAxesCombined size={28} />
                  <b>No completed workouts yet</b>
                  <span>Open an exercise and choose “Start guided session”, then mark it complete.</span>
                  <button className="secondary" onClick={() => setView("library")}>Browse exercises</button>
                </div>
              ) : (
                <div className="history-list">
                  {history.map(item => (
                    <div className="history-row" key={item.id}>
                      <div className="history-icon"><Check size={17} /></div>
                      <div className="history-name">
                        <b>{item.exerciseName}</b>
                        <small>{item.group} · {new Date(item.completedAt).toLocaleString()}</small>
                      </div>
                      <span className="history-duration">
                        {Math.floor(item.durationSeconds / 60)}m {item.durationSeconds % 60}s
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {history.length > 0 && (
                <button
                  className="clear-history"
                  onClick={() => {
                    if (confirm("Clear all saved workout history?")) setHistory([]);
                  }}
                >
                  Clear workout history
                </button>
              )}
            </div>

            <p className="storage-note">
              <Check size={15} /> History is stored locally in this browser. It is not synced to another device yet.
            </p>
          </section>
        )}
        {view === "nutrition" && (
          <section className="workspace-page nutrition-page">
            <div className="section-heading">
              <div>
                <div className="eyebrow muted">FUEL YOUR TRAINING</div>
                <h2>Eat well. <em>Recover better.</em></h2>
                <p className="page-subtitle">
                  A flexible Indian-food meal guide. Adjust it to your preferences and tick off meals as you go.
                </p>
              </div>
            </div>

            <div className="nutrition-controls">
              <label className="nutrition-field">
                <span>Food preference</span>
                <select value={dietType} onChange={e => setDietType(e.target.value)}>
                  <option>Vegetarian</option>
                  <option>Non-vegetarian</option>
                  <option>Vegan</option>
                </select>
              </label>

              <label className="nutrition-field">
                <span>Your focus</span>
                <select value={fitnessGoal} onChange={e => setFitnessGoal(e.target.value)}>
                  <option>Build strength</option>
                  <option>General fitness</option>
                  <option>Support endurance</option>
                  <option>Weight management</option>
                </select>
              </label>
            </div>

            <div className="nutrition-note">
              <Sparkles size={17} />
              <span>
                <b>Practical starting point</b> — choose balanced meals with protein,
                vegetables or fruit, and a satisfying carbohydrate source. Portions
                and energy needs vary by person; this is general information, not a
                medical or diet prescription.
              </span>
            </div>

            <div className="meal-heading">
              <div>
                <div className="eyebrow muted">TODAY'S SUGGESTED MENU</div>
                <h3>Simple Indian meals</h3>
              </div>
              <span className="result-count">{mealsDone.length} / 4 meals logged</span>
            </div>

            <div className="meal-grid">
              {[
                {
                  id: "breakfast",
                  time: "BREAKFAST",
                  name: "Moong dal chilla",
                  desc: "Moong dal chilla with curd or unsweetened soy yogurt, plus a fruit.",
                  kind: "Vegetarian",
                  protein: "Protein + fibre"
                },
                {
                  id: "lunch",
                  time: "LUNCH",
                  name: "Dal, rice & vegetable sabzi",
                  desc: "Dal with rice or roti, seasonal sabzi and salad.",
                  kind: "Vegan",
                  protein: "Plant protein + carbs"
                },
                {
                  id: "snack",
                  time: "EVENING SNACK",
                  name: "Roasted chana & fruit",
                  desc: "Roasted chana with banana, guava or another seasonal fruit.",
                  kind: "Vegan",
                  protein: "Fibre + plant protein"
                },
                {
                  id: "dinner",
                  time: "DINNER",
                  name: "Paneer bhurji with roti",
                  desc: "Paneer bhurji, whole-wheat roti and cooked vegetables.",
                  kind: "Vegetarian",
                  protein: "Protein + vegetables"
                }
              ].map(m => (
                <article
                  className={`meal-card ${mealsDone.includes(m.id) ? "meal-complete" : ""}`}
                  key={m.id}
                >
                  <div className="meal-top">
                    <span>{m.time}</span>
                    <span className="meal-tag">{m.protein}</span>
                  </div>

                  <h4>
                    {dietType === "Non-vegetarian" && m.id === "dinner"
                      ? "Egg bhurji with roti"
                      : dietType === "Vegan" && m.id === "dinner"
                        ? "Tofu bhurji with roti"
                        : m.name}
                  </h4>

                  <p>
                    {dietType === "Non-vegetarian" && m.id === "dinner"
                      ? "Egg bhurji, whole-wheat roti and cooked vegetables."
                      : dietType === "Vegan" && m.id === "dinner"
                        ? "Tofu bhurji, whole-wheat roti and cooked vegetables."
                        : dietType === "Vegan" && m.id === "breakfast"
                          ? "Moong dal chilla with unsweetened soy yogurt and a fruit."
                          : m.desc}
                  </p>

                  <button
                    className={mealsDone.includes(m.id) ? "meal-check checked" : "meal-check"}
                    onClick={() => setMealsDone(prev =>
                      prev.includes(m.id)
                        ? prev.filter(x => x !== m.id)
                        : [...prev, m.id]
                    )}
                  >
                    {mealsDone.includes(m.id) ? <Check size={15} /> : <Plus size={15} />}
                    {mealsDone.includes(m.id) ? "Logged" : "Mark as eaten"}
                  </button>
                </article>
              ))}
            </div>

            <div className="hydration-panel">
              <div className="hydration-copy">
                <div className="hydration-icon"><Droplets size={20} /></div>
                <div>
                  <h3>Hydration tracker</h3>
                  <p>
                    Track glasses of water during your day. Adjust your intake for heat,
                    activity and personal needs.
                  </p>
                </div>
              </div>

              <div className="water-count">
                <b>{waterGlasses}</b>
                <span>glasses logged</span>
              </div>

              <div className="water-actions">
                <button
                  className="secondary"
                  onClick={() => setWaterGlasses(v => Math.max(0, v - 1))}
                >
                  − Remove
                </button>
                <button
                  className="primary"
                  onClick={() => setWaterGlasses(v => Math.min(30, v + 1))}
                >
                  <Plus size={15} /> Add a glass
                </button>
              </div>
            </div>

            <p className="storage-note">
              <Check size={15} /> Your food preference, meal log and water count save
              locally in this browser. Meal suggestions are examples; adapt for
              allergies, intolerances, medical needs and your own appetite.
            </p>
          </section>
        )}

        <footer>
          FORGE AI <span>·</span> Train smart. Stay consistent.
          <span className="footer-right">Built as an open, local-first project.</span>
        </footer>
      </main>

      {notice && (
        <div className="toast"><Check size={16} />{notice}</div>
      )}

      {/* EXERCISE DETAIL MODAL */}
      {selected && (
        <div
          className="overlay"
          onMouseDown={e => e.target === e.currentTarget && setSelected(null)}
        >
          <div className="modal">
            <button className="close" onClick={() => setSelected(null)}>
              <X />
            </button>

            <div className="modal-kicker">
              {selected.group} · {selected.level}
            </div>

            <h2>{selected.name}</h2>

            <ExercisePicture
              exercise={selected}
              className="detail-exercise-picture"
            />

            <p>{selected.description}</p>

            <div style={{ margin: "16px 0" }}>
              <h4 style={{ marginBottom: 8 }}>TARGET MUSCLES</h4>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {(muscleTargets[selected.id] || [selected.group]).map(muscle => (
                  <span
                    key={muscle}
                    style={{
                      background: "#26372b",
                      color: "#d9f58b",
                      border: "1px solid #40533c",
                      borderRadius: 20,
                      padding: "7px 11px",
                      fontSize: 12
                    }}
                  >
                    {muscle}
                  </span>
                ))}
              </div>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: 12,
                flexWrap: "wrap",
                margin: "14px 0",
                fontSize: 13
              }}
            >
              <span><b>Equipment:</b> {selected.equipment}</span>
              <span><b>Location:</b> {selected.place}</span>
            </div>

            <div className="detail-stats">
              <div><b>{selected.sets}</b><small>SETS</small></div>
              <div><b>{selected.reps}</b><small>REPS / TIME</small></div>
              <div><b>{selected.rest}s</b><small>REST</small></div>
            </div>

            <h4>HOW TO DO IT</h4>
            <ol>
              {selected.steps.map((step, i) => (
                <li key={i}>{step}</li>
              ))}
            </ol>

            <div className="coach-tip">
              <Sparkles size={16} />
              <span>{selected.tip}</span>
            </div>

            <button
              className="primary wide"
              onClick={() => startWorkout(selected)}
            >
              <Play size={17} fill="currentColor" /> Start guided session
            </button>
          </div>
        </div>
      )}

      {/* STATIC PICTURE WORKOUT MODAL — NO ANIMATION */}
      {activeWorkout && (
        <div className="overlay">
          <div className="workout-modal">
            <button className="close" onClick={closeWorkout}>
              <X />
            </button>

            <div className="eyebrow muted">GUIDED SESSION</div>
            <h2>{activeWorkout.name}</h2>

            <ExercisePicture
              exercise={activeWorkout}
              className="workout-exercise-picture"
            />

            <p className="static-picture-note">
              STATIC EXERCISE REFERENCE · NO ANIMATION
            </p>

            <div className="timer">{time}</div>
            <div className="timer-label">SESSION TIMER</div>

            <div className="workout-actions">
              <button
                className="secondary"
                onClick={() => setRunning(!running)}
              >
                {running ? "Pause" : "Start timer"}
              </button>

              <button className="primary" onClick={completeWorkout}>
                <Check size={16} /> Complete & save
              </button>
            </div>

            <div className="session-prescription">
              <span>{activeWorkout.sets} sets</span>
              <span>{activeWorkout.reps}</span>
              <span>{activeWorkout.rest}s rest</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;