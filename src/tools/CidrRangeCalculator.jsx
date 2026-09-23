import { useState } from 'react';
const PAGE_SIZE = 32;
const LISTABLE_PREFIX_THRESHOLD = 28;
function parseIp(str) {
  const parts = str.trim().split('.');
  if (parts.length !== 4) throw new Error('IP address must have 4 octets, e.g. 10.0.0.0.');
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
function parseCidr(input) {
  const [ipPart, cidrPart] = input.split('/');
  if (!cidrPart) throw new Error('Enter a CIDR block, e.g. 10.0.0.0/24.');
  const cidr = Number(cidrPart);
  if (!Number.isInteger(cidr) || cidr < 0 || cidr > 32) {
    throw new Error('CIDR prefix must be an integer between 0 and 32.');
  }
  const octets = parseIp(ipPart);
  const ipInt = octetsToInt(octets);
  const maskInt = cidr === 0 ? 0 : (0xffffffff << (32 - cidr)) >>> 0;
  const networkInt = (ipInt & maskInt) >>> 0;
  const totalAddresses = 2 ** (32 - cidr);
  const lastInt = (networkInt + totalAddresses - 1) >>> 0;
  return { cidr, networkInt, lastInt, totalAddresses };
}
export default function CidrRangeCalculator() {
  const [input, setInput] = useState('10.0.0.0/28');
  const [page, setPage] = useState(0);
  let result = null;
  let error = '';
  try {
    result = parseCidr(input);
  } catch (e) {
    error = e.message;
  }
  const isListable = result && result.cidr >= LISTABLE_PREFIX_THRESHOLD;
  const totalPages = result ? Math.ceil(result.totalAddresses / PAGE_SIZE) : 0;
  const clampedPage = Math.min(page, Math.max(0, totalPages - 1));
  const pageAddresses = isListable
    ? Array.from({ length: Math.min(PAGE_SIZE, result.totalAddresses - clampedPage * PAGE_SIZE) }, (_, i) =>
      intToOctets((result.networkInt + clampedPage * PAGE_SIZE + i) >>> 0)
    )
    : [];
  function handleInputChange(value) {
    setInput(value);
    setPage(0);
  }
  return (
    <div className="tool-page">
      <h1>CIDR Range Calculator</h1>
      <p className="tool-description">
        Enter a CIDR block (e.g. 10.0.0.0/24) to see its full address range. For small ranges
        (/28 or smaller) every individual IP is listed and paginated; larger ranges show only the
        first and last address, since listing millions of IPs isn't practical. For network,
        broadcast, and subnet mask details, see the IP Subnet Calculator. Runs entirely in your
        browser.
      </p>
      <div className="tool-controls">
        <label>
          CIDR block:
          <input
            type="text"
            value={input}
            onChange={(e) => handleInputChange(e.target.value)}
            placeholder="10.0.0.0/24"
            style={{ width: '160px' }}
          />
        </label>
      </div>
      {error && (
        <div className="tool-error">
          <strong>Error:</strong> {error}
        </div>
      )}
      {result && !error && (
        <>
          <div className="timestamp-result">
            <div>
              <strong>First address:</strong> <code>{intToOctets(result.networkInt)}</code>
            </div>
            <div>
              <strong>Last address:</strong> <code>{intToOctets(result.lastInt)}</code>
            </div>
            <div>
              <strong>Total addresses:</strong> {result.totalAddresses.toLocaleString()}
            </div>
          </div>
          {isListable ? (
            <div className="tool-panel">
              <label>
                All addresses (page {clampedPage + 1} of {totalPages})
              </label>
              <ul className="uuid-list">
                {pageAddresses.map((addr) => (
                  <li key={addr}>
                    <code>{addr}</code>
                  </li>
                ))}
              </ul>
              <div className="tool-controls">
                <button onClick={() => setPage((p) => Math.max(0, p - 1))} disabled={clampedPage === 0}>
                  Previous
                </button>
                <button onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))} disabled={clampedPage >= totalPages - 1}>
                  Next
                </button>
              </div>
            </div>
          ) : (
            <p className="tool-placeholder">
              This range has {result.totalAddresses.toLocaleString()} addresses - too many to list
              individually. Use a /28 or smaller prefix to see a paginated address list.
            </p>
          )}
        </>
      )}
    </div>
  );
}
