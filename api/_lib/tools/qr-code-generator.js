import { createComputeHandler } from '../computeHandler.js';

const QR_API = 'https://api.qrserver.com/v1/create-qr-code/';

function compute({ text, size }) {
  const encoded = encodeURIComponent(text || '');
  const src = text ? `${QR_API}?size=${size}x${size}&data=${encoded}` : '';
  return { src };
}

export default createComputeHandler(compute);
