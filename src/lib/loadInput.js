export function readFileAsText(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result ?? ''));
    reader.onerror = () => reject(new Error('Failed to read that file.'));
    reader.readAsText(file);
  });
}

export async function loadTextFromUrl(url) {
  let res;
  try {
    res = await fetch(url);
  } catch {
    throw new Error('Could not load that URL directly (likely blocked by CORS or unreachable). Try downloading the file and using Upload instead.');
  }
  if (!res.ok) {
    throw new Error(`Request failed (${res.status}). Try downloading the file and using Upload instead.`);
  }
  return res.text();
}
