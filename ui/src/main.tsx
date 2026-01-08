import React, { useState } from 'react';
import { GlassGate } from './components/GlassGate';
import './main.css';

/**
 * The InteractionPortal facilitates peer engagement.
 * It fulfills AXIOM_4_FLOW through bidirectional exchange.
 */
const App: React.FC = () => {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState<any>(null);
  const [sessionId] = useState(`session_${Date.now()}`);

  const handleProcess = async () => {
    const res = await fetch('/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId, text: input })
    });
    const data = await res.json();
    setResponse(data);
    if (!data.pause_triggered) setInput(""); // Clear on Flow
  };

  return (
    <div className="app-container">
      {/* Left Column: Interaction */}
      <div className="left-column">
        <h3>Interaction Portal</h3>
        <textarea 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Peer Input..."
          className="interaction-textarea"
        />
        <button onClick={handleProcess} className="primary-button">
          INITIATE TURN
        </button>

        {response && (
          <div className="response-box">
            <p><strong>STATUS:</strong> {response.status.toUpperCase()}</p>
            {response.ids && (
              <>
                <p><em>IDENTIFY:</em> {response.ids.identify}</p>
                <p><em>DEFINE:</em> {response.ids.define}</p>
                <ul>
                  {response.ids.suggest.map((s: string, i: number) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              </>
            )}
            {response.pause_triggered && (
              <p className="pause-message">!!! SELF-CARE PAUSE ACTIVE !!!</p>
            )}
          </div>
        )}
      </div>

      {/* Right Column: Visibility (The Mirror) */}
      <div className="right-column">
        <GlassGate />
      </div>
    </div>
  );
};

export default App;