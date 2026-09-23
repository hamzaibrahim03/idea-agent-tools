import { createComputeHandler } from '../_lib/computeHandler.js';

function parseIp(str) {
  const parts = String(str).trim().split('.');
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

function compute({ ip, cidr }) {
  return calculateSubnet(ip, cidr);
}

export default createComputeHandler(compute);
