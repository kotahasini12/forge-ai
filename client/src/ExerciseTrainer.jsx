import React from "react";
import "./trainer.css";

const muscleMap = {
  "push-up": ["Chest", "Triceps", "Front deltoids"], "plank": ["Core", "Shoulders", "Glutes"],
  "pike-pushup": ["Shoulders", "Triceps"], "crunch": ["Abdominals"], "leg-raise": ["Lower abs", "Hip flexors"],
  "db-press": ["Chest", "Triceps"], squat: ["Quadriceps", "Glutes"], lunges: ["Quads", "Glutes"],
  "lateral-raise": ["Lateral deltoids"], "front-raise": ["Front deltoids"], "shoulder-press": ["Shoulders", "Triceps"],
  bicep: ["Biceps"], triceps: ["Triceps"], row: ["Lats", "Upper back", "Biceps"], "lat-pulldown": ["Lats", "Biceps"]
};
const floorIds = new Set(["push-up", "plank", "pike-pushup", "crunch", "leg-raise"]);

export default function ExerciseTrainer({ exercise }) {
  const id = exercise?.id || "squat";
  const floor = floorIds.has(id);
  const muscles = muscleMap[id] || [exercise?.group || "Target muscles"];
  return <section className={`anatomy-trainer ${floor ? "is-floor" : "is-standing"} move-${id}`} aria-label={`${exercise?.name || "Exercise"} anatomical demonstration`}>
    <div className="anatomy-topline"><span>FORM GUIDE · ILLUSTRATIVE</span><span className="anatomy-live"><i/> MOTION</span></div>
    <div className="anatomy-stage">
      <div className="anatomy-grid" />
      <svg className="anatomy-figure" viewBox="0 0 520 300" role="img" aria-label={`Illustration showing ${exercise?.name || "exercise"}`}>
        <defs>
          <linearGradient id="bodyTone" x1="0" x2="1" y1="0" y2="1"><stop stopColor="#f2d8c5"/><stop offset="1" stopColor="#b98e7c"/></linearGradient>
          <linearGradient id="muscleTone" x1="0" x2="1"><stop stopColor="#ff806f"/><stop offset="1" stopColor="#c83f48"/></linearGradient>
          <filter id="figureShadow"><feGaussianBlur stdDeviation="5"/></filter>
        </defs>
        <ellipse cx="260" cy="270" rx="170" ry="12" fill="#17251f" opacity=".14" filter="url(#figureShadow)"/>
        {floor ? <g className="pose-floor">
          <g className="limb-back"><path d="M315 173 Q370 177 415 193 L475 212 Q490 219 478 231 Q468 239 450 230 L389 213 Q344 208 301 203Z"/><path className="muscle" d="M390 193 Q427 199 462 213 L450 226 Q416 215 386 208Z"/></g>
          <path className="torso" d="M180 130 Q215 105 275 119 L335 151 Q350 164 331 181 L258 194 Q210 190 170 166Z"/><path className="muscle torso-muscle" d="M210 124 Q260 112 302 139 L320 161 Q281 174 243 161Z"/>
          <g className="limb-front"><path d="M188 158 Q160 184 143 221 L125 252 Q115 267 98 260 Q88 253 98 235 L128 180 Q143 144 166 130Z"/><path className="muscle" d="M139 192 Q155 165 170 151 L157 199 L129 245 L113 247Z"/></g>
          <g className="limb-front"><path d="M228 180 Q211 206 203 239 L195 258 Q188 270 172 264 Q162 258 169 242 L180 205 Q187 176 202 164Z"/><path className="muscle" d="M188 207 Q199 182 211 177 L202 228 L188 254 L178 252Z"/></g>
          <path className="head" d="M169 91 Q174 65 199 67 Q223 70 221 96 Q218 121 195 123 Q171 119 169 91Z"/><path d="M186 88 Q200 80 213 89" className="detail"/>
          <path className="arm" d="M294 143 Q328 137 345 160 L361 181 Q366 193 353 200 Q341 204 333 190 L313 174 L285 171Z"/><path className="muscle" d="M315 151 Q336 153 347 176 L337 184 L315 169Z"/>
        </g> : <g className="pose-stand">
          <path className="head" d="M231 38 Q235 14 258 14 Q283 17 282 43 Q279 68 255 70 Q232 65 231 38Z"/><path className="detail" d="M260 43 Q269 47 276 42"/>
          <path className="torso" d="M220 76 Q244 63 273 76 L293 132 Q286 157 271 169 L219 165 Q203 145 205 122Z"/><path className="muscle torso-muscle" d="M225 83 Q244 72 262 82 L269 116 L244 130 L221 115Z"/>
          <g className="arm-left"><path className="limb" d="M216 84 Q197 88 190 113 L176 155 Q172 169 184 174 Q197 177 203 160 L220 119Z"/><path className="muscle" d="M198 108 Q207 95 215 99 L202 145 L188 161Z"/></g>
          <g className="arm-right"><path className="limb" d="M278 84 Q297 88 305 113 L320 154 Q324 169 312 174 Q299 177 293 160 L276 119Z"/><path className="muscle" d="M297 108 Q288 95 280 99 L293 145 L307 161Z"/></g>
          <g className="legs"><path className="limb" d="M220 157 Q242 151 252 166 L246 218 L239 263 Q236 276 220 274 Q208 270 213 256 L215 211Z"/><path className="muscle" d="M222 170 Q239 163 245 176 L235 219 L221 248 L218 208Z"/><path className="limb" d="M255 164 Q276 153 286 169 L292 214 L304 256 Q307 270 292 275 Q278 276 276 260 L260 217Z"/><path className="muscle" d="M264 174 Q280 164 283 181 L286 222 L293 253 L281 248 L268 211Z"/></g>
        </g>}
      </svg>
      <div className="anatomy-label label-one"><b>01</b><span>{muscles[0]}</span></div>
      <div className="anatomy-label label-two"><b>02</b><span>{muscles[1] || "Stabilizers"}</span></div>
    </div>
    <div className="anatomy-footer"><div><small>TARGET MUSCLES</small><strong>{muscles.join(" · ")}</strong></div><span className="anatomy-tag">{floor ? "FLOOR POSITION" : "STANDING POSITION"}</span></div>
    <p className="anatomy-disclaimer">Illustrative movement guide. Use controlled motion and follow the written form cues.</p>
  </section>;
}
