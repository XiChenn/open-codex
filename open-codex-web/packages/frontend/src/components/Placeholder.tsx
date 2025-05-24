import React, { useEffect, useState } from 'react';

interface HealthStatus {
  status: string;
  message?: string;
}

const Placeholder: React.FC = () => {
  const [backendStatus, setBackendStatus] = useState<HealthStatus | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/health') // Proxied by Vite
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data: HealthStatus) => {
        setBackendStatus(data);
      })
      .catch(err => {
        console.error("Failed to fetch backend status:", err);
        setError(err.message);
        setBackendStatus({ status: 'error', message: 'Failed to connect to backend' });
      });
  }, []);

  return (
    <div>
      <h1>Open Codex Web UI - Placeholder</h1>
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      {backendStatus ? (
        <p>
          Backend Status: <span style={{ color: backendStatus.status === 'ok' ? 'green' : 'red' }}>{backendStatus.status}</span>
          {backendStatus.message && ` - ${backendStatus.message}`}
        </p>
      ) : (
        <p>Loading backend status...</p>
      )}
    </div>
  );
};

export default Placeholder;
