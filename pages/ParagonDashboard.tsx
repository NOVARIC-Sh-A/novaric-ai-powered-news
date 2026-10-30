import React, { useEffect, useState } from "react";
import { getParagonDashboard } from "../services/paragonService";
import { ParagonDashboardResponse } from "../types/paragonTypes";

export const ParagonDashboard: React.FC = () => {
  const [data, setData] = useState<ParagonDashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const response = await getParagonDashboard();
      setData(response);
      setLoading(false);
    })();
  }, []);

  if (loading) {
    return (
      <div className="text-center text-white py-10">
        Duke ngarkuar të dhënat e PARAGON®...
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center text-red-400 py-10">
        Nuk u gjetën të dhëna për Dashboard-in PARAGON®.
      </div>
    );
  }

  return (
    <main className="container mx-auto px-4 py-8 text-white">
      <h1 className="text-4xl font-bold mb-6 text-center">
        Dashboard i PARAGON®
      </h1>

      {/* Latest Scores */}
      <section className="mb-10 bg-white/10 p-6 rounded-lg border border-white/20">
        <h2 className="text-2xl font-bold mb-4">Performanca e Fundit</h2>
        <ul className="space-y-2">
          {data.latestScores.slice(0, 15).map((p) => (
            <li key={p.politician_id} className="flex justify-between">
              <span>{p.politicians?.name}</span>
              <span className="font-bold">{p.overall_score}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Top Risers */}
      <section className="mb-10 bg-green-900/40 p-6 rounded-lg border border-green-700">
        <h2 className="text-2xl font-bold mb-4">Rritjet Kryesore</h2>
        <ul className="space-y-2">
          {data.topRisers.map((r) => (
            <li key={r.politician_id} className="flex justify-between">
              <span>{r.name}</span>
              <span className="font-bold text-green-300">+{r.delta}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Top Fallers */}
      <section className="mb-10 bg-red-900/40 p-6 rounded-lg border border-red-700">
        <h2 className="text-2xl font-bold mb-4">Rëniet Kryesore</h2>
        <ul className="space-y-2">
          {data.topFallers.map((f) => (
            <li key={f.politician_id} className="flex justify-between">
              <span>{f.name}</span>
              <span className="font-bold text-red-300">{f.delta}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Trend Entries */}
      <section className="mb-10 bg-white/5 p-6 rounded-lg border border-white/10">
        <h2 className="text-2xl font-bold mb-4">Tendencat e Fundit</h2>
        <p className="text-sm text-slate-300">
          Të dhënat e fundit të analizës (500 rezultate)
        </p>
      </section>
    </main>
  );
};