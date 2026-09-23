import { useEffect, useState } from 'react';
export default function IpSubnetCalculator() {
  const [ip, setIp] = useState('192.168.1.0');
  const [cidr, setCidr] = useState(24);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [fetchError, setFetchError] = useState('');
  useEffect(() => {
    let cancelled = false;
    const timer = setTimeout(() => {
      setFetchError('');
      fetch('/api/tools/ip-subnet-calculator', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ input: { ip, cidr } })
      })
        .then((r) => r.json())
        .then((data) => {
          if (cancelled) return;
          if (data.error) {
            setError(data.error);
            setResult(null);
          } else {
            setError('');
            setResult(data);
          }
        })
        .catch((e) => { if (!cancelled) setFetchError(e.message || 'Failed to compute'); });
    }, 250);
    return () => { cancelled = true; clearTimeout(timer); };
  }, [ip, cidr]);
  return (
    <div className="tool-page">
      <h1>IP Subnet Calculator</h1>
      <p className="tool-description">
        Enter an IPv4 address and CIDR prefix to calculate the network address, broadcast address,
        subnet mask, and usable host range.
      </p>
      <div className="tool-controls">
        <label>
          IP address:
          <input type="text" value={ip} onChange={(e) => setIp(e.target.value)} placeholder="192.168.1.0" style={{ width: '140px' }} />
        </label>
        <label>
          / CIDR prefix:
          <input
            type="number"
            min={0}
            max={32}
            value={cidr}
            onChange={(e) => setCidr(e.target.value)}
            style={{ width: '70px' }}
          />
        </label>
      </div>
      {fetchError && <div className="agent-error">{fetchError}</div>}
      {error && (
        <div className="tool-error">
          <strong>Error:</strong> {error}
        </div>
      )}
      {result && !error && (
        <div className="timestamp-result">
          <div>
            <strong>Network address:</strong> <code>{result.network}</code>
          </div>
          <div>
            <strong>Broadcast address:</strong> <code>{result.broadcast}</code>
          </div>
          <div>
            <strong>Subnet mask:</strong> <code>{result.mask}</code>
          </div>
          <div>
            <strong>Wildcard mask:</strong> <code>{result.wildcard}</code>
          </div>
          <div>
            <strong>First usable host:</strong> <code>{result.firstHost}</code>
          </div>
          <div>
            <strong>Last usable host:</strong> <code>{result.lastHost}</code>
          </div>
          <div>
            <strong>Usable hosts:</strong> {result.usableHosts.toLocaleString()}
          </div>
          <div>
            <strong>Total addresses:</strong> {result.totalAddresses.toLocaleString()}
          </div>
        </div>
      )}
    </div>
  );
}
