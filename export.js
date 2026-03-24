/**
 * export.js — Session export to Markdown and Notion
 */

import { getFullMessages, getTranscripts, getSession } from './db.js';

// ── Markdown export ───────────────────────────────────────────────────────────
export function sessionToMarkdown(sessionId) {
  const session = getSession(sessionId);
  if (!session) return null;

  const messages = getFullMessages(sessionId);
  const date = new Date(session.created_at * 1000).toLocaleString('en-US', {
    weekday:'long', year:'numeric', month:'long', day:'numeric',
    hour:'2-digit', minute:'2-digit'
  });

  const pairs = [];
  for (let i = 0; i < messages.length - 1; i++) {
    if (messages[i].role === 'user' && messages[i+1]?.role === 'assistant') {
      pairs.push({ q: messages[i], a: messages[i+1] });
    }
  }

  const tags = (() => {
    try { return JSON.parse(session.tags || '[]'); } catch { return []; }
  })();

  const avgMs = session.answer_count > 0
    ? Math.round(session.total_ms / session.answer_count)
    : 0;

  let md = `# ${session.title}\n\n`;
  md += `> 📅 ${date}  \n`;
  md += `> 💬 ${session.answer_count} answers  `;
  md += `• ⚡ avg ${avgMs}ms response  \n`;
  if (tags.length) md += `> 🏷 ${tags.join(', ')}\n`;
  md += `\n---\n\n`;

  pairs.forEach((pair, i) => {
    md += `## Q${i+1}. ${pair.q.content}\n\n`;
    md += `${pair.a.content}\n\n`;
    const pairTags = (() => { try { return JSON.parse(pair.a.tags||'[]'); } catch { return []; } })();
    if (pairTags.length) md += `*Tags: ${pairTags.join(', ')}*\n\n`;
    if (pair.a.ms) md += `*Response time: ${pair.a.ms}ms${pair.a.rag_used?' · used session context':''}*\n\n`;
    md += `---\n\n`;
  });

  return md;
}

// ── Notion export ─────────────────────────────────────────────────────────────
export async function sessionToNotion(sessionId, notionKey, databaseId) {
  if (!notionKey || !databaseId) throw new Error('NOTION_API_KEY and NOTION_DATABASE_ID required in .env');

  const session = getSession(sessionId);
  if (!session) throw new Error('Session not found');

  const messages = getFullMessages(sessionId);
  const pairs = [];
  for (let i = 0; i < messages.length - 1; i++) {
    if (messages[i].role === 'user' && messages[i+1]?.role === 'assistant') {
      pairs.push({ q: messages[i].content, a: messages[i+1].content });
    }
  }

  const tags = (() => { try { return JSON.parse(session.tags || '[]'); } catch { return []; } })();

  // Build Notion blocks
  const children = [];

  pairs.forEach((pair, i) => {
    // Question heading
    children.push({
      object: 'block', type: 'heading_2',
      heading_2: { rich_text: [{ type:'text', text:{ content:`Q${i+1}: ${pair.q.slice(0,200)}` } }] }
    });

    // Answer — split into paragraphs and code blocks
    const segments = pair.a.split(/(```[\s\S]*?```)/g);
    segments.forEach(seg => {
      if (seg.startsWith('```')) {
        const lines = seg.slice(3,-3).split('\n');
        const lang = lines[0].trim() || 'plain text';
        const code = lines.slice(1).join('\n');
        children.push({
          object:'block', type:'code',
          code: { rich_text:[{type:'text',text:{content:code.slice(0,2000)}}], language: lang }
        });
      } else {
        seg.split('\n\n').filter(Boolean).forEach(para => {
          children.push({
            object:'block', type:'paragraph',
            paragraph: { rich_text:[{type:'text',text:{content:para.replace(/\*\*(.+?)\*\*/g,'$1').slice(0,2000)}}] }
          });
        });
      }
    });

    children.push({ object:'block', type:'divider', divider:{} });
  });

  // Create Notion page
  const body = {
    parent: { database_id: databaseId },
    properties: {
      Name:   { title: [{ text:{ content: session.title } }] },
      Date:   { date:  { start: new Date(session.created_at*1000).toISOString().split('T')[0] } },
      Tags:   { multi_select: tags.map(t => ({ name: t })) },
      Answers:{ number: session.answer_count },
    },
    children: children.slice(0, 100), // Notion API limit per request
  };

  const res = await fetch('https://api.notion.com/v1/pages', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${notionKey}`,
      'Content-Type': 'application/json',
      'Notion-Version': '2022-06-28',
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Notion API error');
  }

  const page = await res.json();
  return { url: page.url, id: page.id };
}
