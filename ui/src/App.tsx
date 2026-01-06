// FILE: ui/src/App.tsx

import { useEffect } from "react";
import "./styles.css";

const AEGIS_BRAND = Object.freeze({
  short: "AEGIS",
  expanded: "Adaptive Equilibrium & Governance Integration System",
  demoTag: "TDemo",
  demoLabel: "Technical Demonstration",
  documentTitle: "AEGIS — Technical Demonstration",
});

export default function App() {
  useEffect(() => {
    document.title = AEGIS_BRAND.documentTitle;
  }, []);

  return (
    <div className="appShell">
      <header className="appHeader">
        <div className="brandBlock">
          <div className="brandTopRow">
            <span className="brandShort">{AEGIS_BRAND.short}</span>
            <span className="brandBadge" title={AEGIS_BRAND.demoLabel}>
              {AEGIS_BRAND.demoTag}
            </span>
          </div>
          <div className="brandExpanded">{AEGIS_BRAND.expanded}</div>
        </div>

        <div className="headerRight">
          {/* Keep open for status pills, environment indicator, etc. */}
        </div>
      </header>

      <main className="appMain">
        {/* ⬇️ Your existing UI can live here (panels, analyzer results, etc.) */}
        <section className="card">
          <div className="cardTitle">System</div>
          <div className="cardBody">
            Canonical name applied. UI is now branded as{" "}
            <strong>{AEGIS_BRAND.short}</strong> — {AEGIS_BRAND.expanded} (
            {AEGIS_BRAND.demoTag}).
          </div>
        </section>
      </main>
    </div>
  );
}
