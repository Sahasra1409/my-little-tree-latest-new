import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.warn('Missing Supabase environment variables. The app will work with limited functionality.');
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseKey || 'placeholder'
);

export interface Note {
  id: string;
  content: string;
  created_at: string;
  claimed_at: string | null;
  status: string;
}

/**
 * Leave a note in the tree
 */
export async function leaveNote(content: string): Promise<{ success: boolean; error?: string }> {
  if (!supabaseUrl || !supabaseKey) {
    return { success: false, error: 'Not connected to database' };
  }

  try {
    const trimmed = content.trim();
    if (!trimmed) {
      return { success: false, error: 'Note cannot be empty' };
    }
    if (trimmed.length > 500) {
      return { success: false, error: 'Note is too long' };
    }

    const { error } = await supabase
      .from('notes')
      .insert({ content: trimmed, status: 'available' });

    if (error) {
      console.error('Error leaving note:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err) {
    console.error('Network error leaving note:', err);
    return { success: false, error: 'Network error' };
  }
}

/**
 * Receive a random note from the tree using the RPC function
 */
export async function receiveNote(): Promise<{ note: Note | null; error?: string }> {
  if (!supabaseUrl || !supabaseKey) {
    return { note: null, error: 'Not connected to database' };
  }

  try {
    const { data, error } = await supabase.rpc('claim_random_note');

    if (error) {
      console.error('Error receiving note:', error);
      return { note: null, error: error.message };
    }

    if (!data) {
      return { note: null };
    }

    // Handle array or single object
    const result = Array.isArray(data) ? data[0] : data;

    if (!result || !result.content) {
      return { note: null };
    }

    return { note: result as Note };
  } catch (err) {
    console.error('Network error receiving note:', err);
    return { note: null, error: 'Network error' };
  }
}

/**
 * Seed the tree with initial notes if empty.
 * Uses localStorage to prevent duplicate seeding.
 */
export async function seedIfEmpty(): Promise<void> {
  if (!supabaseUrl || !supabaseKey) return;

  const seededFlag = 'little-note-seeded-v2';
  if (localStorage.getItem(seededFlag)) return;

  const seedMessages = [
    "I hope something unexpectedly lovely happens to you today.",
    "I hope tomorrow feels a little lighter.",
    "I hope someone makes you laugh so hard today that you forget what you were worried about.",
    "I hope you find money in an old jacket.",
    "I hope your Wi-Fi behaves today.",
    "I hope you eat something really good today.",
    "I hope you get a message you've secretly been waiting for.",
    "I hope you remember that not every day has to be productive.",
    "I hope something small makes you smile today.",
    "I hope the weather is exactly what you need right now.",
    "I hope you hear your favorite song unexpectedly today.",
    "I hope someone holds the door open for you, literally or figuratively.",
    "I hope you find the perfect temperature with your blanket tonight.",
    "I hope your coffee or tea is exactly the right temperature.",
    "I hope you run into someone who reminds you of a happy memory.",
    "I hope you have a moment today where everything feels still.",
    "I hope you sleep really well tonight.",
    "I hope you stumble upon something that makes you curious.",
    "I hope you feel proud of something you did recently, even if it was small.",
    "I hope a stranger smiles at you today.",
    "I hope you find a really good new song to listen to.",
    "I hope something makes you feel cozy today.",
    "I hope you take a deep breath and it feels really good.",
    "I hope you find a reason to look forward to tomorrow.",
    "I hope you get to pet a dog or cat today.",
  ];

  try {
    // Try to check if notes exist, but don't fail if we can't
    const { count, error: countError } = await supabase
      .from('notes')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'available');

    if (countError) {
      // If we can't check, try seeding anyway (RLS insert policy should exist)
      console.warn('Could not check note count, attempting to seed...');
    }

    // Seed if count is 0, null (couldn't check), or very low
    if (countError || count === null || count < 5) {
      // Insert seeds one at a time with small delay to avoid rate limiting
      for (const msg of seedMessages) {
        await supabase.from('notes').insert({ content: msg, status: 'available' });
      }
    }

    localStorage.setItem(seededFlag, 'true');
  } catch (err) {
    console.error('Error seeding notes:', err);
    // Still mark as seeded to avoid repeated failed attempts
    localStorage.setItem(seededFlag, 'true');
  }
}

/**
 * Save a note to local storage for the user to keep
 */
export function saveNoteLocally(content: string): void {
  try {
    const saved = JSON.parse(localStorage.getItem('little-note-kept') || '[]');
    saved.push({
      content,
      keptAt: new Date().toISOString(),
      id: typeof crypto !== 'undefined' && crypto.randomUUID
        ? crypto.randomUUID()
        : Date.now().toString(36) + Math.random().toString(36).slice(2),
    });
    localStorage.setItem('little-note-kept', JSON.stringify(saved));
  } catch {
    // Silent fail for localStorage issues
  }
}

/**
 * Create a printable version of the note
 */
export function printNote(content: string): void {
  const printWindow = window.open('', '_blank', 'width=500,height=400');
  if (!printWindow) return;

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>A Little Note for You</title>
      <link href="https://fonts.googleapis.com/css2?family=Caveat:wght@400;500;600&family=Playfair+Display:ital,wght@0,400;1,400&display=swap" rel="stylesheet" />
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          background: #f5edd8;
          font-family: 'Caveat', cursive;
          padding: 2rem;
        }
        .note {
          max-width: 400px;
          padding: 2.5rem;
          background: linear-gradient(155deg, #f8f2de, #f5edd8, #e8dfc8);
          border: 1px solid #d4c9a8;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          position: relative;
        }
        .note::before {
          content: '';
          position: absolute;
          inset: 0;
          background: repeating-linear-gradient(0deg, transparent, transparent 28px, rgba(180,170,150,0.08) 28px, rgba(180,170,150,0.08) 29px);
          pointer-events: none;
        }
        .text {
          font-size: 1.5rem;
          line-height: 2.2rem;
          color: #2a2520;
          position: relative;
          z-index: 1;
        }
        .footer {
          margin-top: 2rem;
          text-align: center;
          font-family: 'Playfair Display', serif;
          font-style: italic;
          font-size: 0.8rem;
          color: #8b7faa;
        }
        @media print {
          body { background: white; }
          .note { box-shadow: none; border: 1px solid #e0d5b8; }
        }
      </style>
    </head>
    <body>
      <div class="note">
        <div class="text">${content.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</div>
        <div class="footer">A Little Note for You</div>
      </div>
      <script>window.onload = () => { setTimeout(() => window.print(), 300); }</script>
    </body>
    </html>
  `);
  printWindow.document.close();
}
