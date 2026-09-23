export function createComputeHandler(computeFn) {
  return async function handler(req, res) {
    if (req.method !== 'POST') {
      res.status(405).json({ error: 'Method not allowed' });
      return;
    }
    try {
      const result = await computeFn(req.body?.input || {});
      res.status(200).json(result);
    } catch (e) {
      res.status(400).json({ error: e.message || 'Invalid input' });
    }
  };
}
