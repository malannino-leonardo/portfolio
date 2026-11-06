"use client";

import { useEffect, useRef, useState } from "react";

type Day = { date: string; count: number; level: number };
export type ContribData = { total: number; days: Day[] };

const USER = "malannino-leonardo";
let cache: ContribData | null = null;
let inflight: Promise<ContribData> | null = null;

export function loadContributions(): Promise<ContribData> {
  if (cache) return Promise.resolve(cache);
  inflight ??= fetch(
    `https://github-contributions-api.jogruber.de/v4/${USER}?y=last`
  )
    .then((r) => {
      if (!r.ok) throw new Error(String(r.status));
      return r.json();
    })
    .then((j) => {
      const days: Day[] = j.contributions;
      const total =
        j.total?.lastYear ?? days.reduce((s: number, d: Day) => s + d.count, 0);
      cache = { total, days };
      return cache;
    })
    .catch((e) => {
      inflight = null;
      throw e;
    });
  return inflight;
}

export function computeStats(days: Day[]) {
  let longest = { length: 0, start: "", end: "" };
  let run = { length: 0, start: "" };
  let best = { count: 0, date: "" };
  days.forEach((d, i) => {
    if (d.count > best.count) best = { count: d.count, date: d.date };
    if (d.count > 0) {
      if (run.length === 0) run.start = d.date;
      run.length++;
      if (run.length > longest.length)
        longest = { length: run.length, start: run.start, end: d.date };
    } else run = { length: 0, start: "" };
  });
  // current streak: walk back from the last day (today may still be 0)
  let i = days.length - 1;
  if (i >= 0 && days[i].count === 0) i--;
  let cur = { length: 0, start: "", end: i >= 0 ? days[i].date : "" };
  while (i >= 0 && days[i].count > 0) {
    cur.length++;
    cur.start = days[i].date;
    i--;
  }
  return { longest, current: cur, best, active: days.filter((d) => d.count > 0).length };
}

const LEVELS = ["var(--m-lv0)", "var(--m-lv1)", "var(--m-lv2)", "var(--m-lv3)", "var(--m-lv4)"];

export function useContributions() {
  const [state, setState] = useState<{ data?: ContribData; error?: boolean }>({});
  useEffect(() => {
    let alive = true;
    loadContributions()
      .then((data) => alive && setState({ data }))
      .catch(() => alive && setState({ error: true }));
    return () => {
      alive = false;
    };
  }, []);
  return state;
}

export function ContributionHeatmap() {
  const { data, error } = useContributions();
  const scroller = useRef<HTMLDivElement>(null);
  useEffect(() => {
    // show the most recent weeks first
    const el = scroller.current;
    if (el) el.scrollLeft = el.scrollWidth;
  }, [data]);
  if (error)
    return (
      <span className="t-dim">
        could not reach the GitHub contributions API (offline?). see github.com/{USER}
      </span>
    );
  if (!data) return <span className="t-dim">fetching contributions...</span>;
  return (
    <div data-ascii="skip">
      <div className="t-dim mb-1">
        {data.total.toLocaleString()} contributions in the last year
      </div>
      <div ref={scroller} className="overflow-x-auto pb-1">
        <div
          className="grid"
          style={{
            gridAutoFlow: "column",
            gridTemplateRows: "repeat(7, 10px)",
            gap: 2,
            width: "max-content",
          }}
        >
          {/* pad so the first column starts on the right weekday */}
          {Array.from({ length: new Date(data.days[0].date + "T00:00:00Z").getUTCDay() }).map(
            (_, i) => (
              <span key={"p" + i} style={{ width: 10, height: 10 }} />
            )
          )}
          {data.days.map((d) => (
            <span
              key={d.date}
              title={`${d.count} contribution${d.count === 1 ? "" : "s"} on ${d.date}`}
              style={{
                width: 10,
                height: 10,
                borderRadius: 2,
                background: LEVELS[d.level] ?? LEVELS[0],
                boxShadow: d.level >= 3 ? "var(--m-lvglow)" : undefined,
              }}
            />
          ))}
        </div>
      </div>
      <div className="t-dim mt-1 flex items-center gap-1 text-[11px]">
        less
        {LEVELS.map((c) => (
          <span key={c} style={{ width: 10, height: 10, borderRadius: 2, background: c }} />
        ))}
        more
      </div>
    </div>
  );
}

export function StreakStats() {
  const { data, error } = useContributions();
  if (error) return <span className="t-dim">GitHub API unreachable right now.</span>;
  if (!data) return <span className="t-dim">crunching numbers...</span>;
  const s = computeStats(data.days);
  const row = (k: string, v: string) => (
    <div>
      <span className="t-green inline-block w-[16ch]">{k}</span>
      <span>{v}</span>
    </div>
  );
  return (
    <div>
      {row("current streak:", `${s.current.length} days${s.current.length ? ` (${s.current.start} → ${s.current.end})` : ""}`)}
      {row("longest streak:", `${s.longest.length} days${s.longest.length ? ` (${s.longest.start} → ${s.longest.end})` : ""}`)}
      {row("best day:", `${s.best.count} contributions on ${s.best.date}`)}
      {row("active days:", `${s.active} of ${data.days.length}`)}
      {row("total (1y):", data.total.toLocaleString())}
    </div>
  );
}
