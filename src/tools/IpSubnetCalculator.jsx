import { useState } from 'react';
function parseIp(str) {
  const parts = str.trim().split('.');
  if (parts.length !== 4) throw new Error('IP address must have 4 octets, e.g. 192.168.1.0.');
  const octets = parts.map((p) => {
    if (!/^\d{1,3}$/.test(p)) throw new Error(`Invalid octet "${p}" - must be a number.`);
    const n = Number(p);
    if (n < 0 || n > 255) throw new Error(`Octet ${n} out of range - must be 0-255.`);
    return n;
  });
  return octets;
}
function octetsToInt(octets) {
  return ((octets[0] << 24) | (octets[1] << 16) | (octets[2] << 8) | octets[3]) >>> 0;
}
function intToOctets(int) {
  return [(int >>> 24) & 255, (int >>> 16) & 255, (int >>> 8) & 255, int & 255].join('.');
}
function calculateSubnet(ipStr, cidrStr) {
  const cidr = Number(cidrStr);
  if (!Number.isInteger(cidr) || cidr < 0 || cidr > 32) {
    throw new Error('CIDR prefix must be an integer between 0 and 32.');
  }
  const octets = parseIp(ipStr);
  const ipInt = octetsToInt(octets);
  const maskInt = cidr === 0 ? 0 : (0xffffffff << (32 - cidr)) >>> 0;
  const wildcardInt = (~maskInt) >>> 0;
  const networkInt = (ipInt & maskInt) >>> 0;
  const broadcastInt = (networkInt | wildcardInt) >>> 0;
  const totalAddresses = 2 ** (32 - cidr);
  const usableHosts = cidr >= 31 ? 0 : totalAddresses - 2;
  const firstHost = cidr >= 31 ? networkInt : (networkInt + 1) >>> 0;
  const lastHost = cidr >= 31 ? broadcastInt : (broadcastInt - 1) >>> 0;
  return {
    network: intToOctets(networkInt),
    broadcast: intToOctets(broadcastInt),
    mask: intToOctets(maskInt),
    wildcard: intToOctets(wildcardInt),
    firstHost: intToOctets(firstHost),
    lastHost: intToOctets(lastHost),
    usableHosts,
    totalAddresses,
  };
}
export default function IpSubnetCalculator() {
  const [ip, setIp] = useState('192.168.1.0');
  const [cidr, setCidr] = useState(24);
  let result = null;
  let error = '';
  try {
    result = calculateSubnet(ip, cidr);
  } catch (e) {
    error = e.message;
  }
  return (
    <div className="tool-page">
      <h1>IP Subnet Calculator</h1>
      <p className="tool-description">
        Enter an IPv4 address and CIDR prefix to calculate the network address, broadcast address,
        subnet mask, and usable host range. Runs entirely in your browser.
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
