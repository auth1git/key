import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createHash } from 'crypto';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow POST from your Roblox game
  if (req.method !== 'POST') return res.status(405).send('Use POST');

  const { user, hashInput } = req.body;

  if (!user || !hashInput) {
    return res.status(400).json({ authorized: false, error: "Missing data" });
  }

  // --- REPLICATE YOUR HASH LOGIC ---
  
  // 1. Generate SHA-512
  const hash = createHash('sha512').update(user).digest();
  const bytes = Array.from(hash);
  
  // 2. Convert to hex
  let hex = bytes.map(b => b.toString(16).padStart(2, "0")).join("");

  // 3. Stretch to 400+ chars
  while (hex.length < 400) {
    hex += hex;
  }

  // 4. Calculate exact length (the 300 + bytes[0] % 26 part)
  const length = 300 + (bytes[0] % 26);
  const expectedHash = hex.slice(0, length);

  // --- COMPARE ---
  if (hashInput === expectedHash) {
    return res.status(200).json({ authorized: true });
  } else {
    return res.status(401).json({ authorized: false });
  }
}
