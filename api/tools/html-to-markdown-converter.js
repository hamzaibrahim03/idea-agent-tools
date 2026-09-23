import { createComputeHandler } from '../_lib/computeHandler.js';

const VOID_TAGS = new Set(['br', 'hr', 'img', 'input', 'meta', 'link']);

function decodeEntities(str) {
  const named = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ' };
  return str.replace(/&(#x?[0-9a-fA-F]+|[a-zA-Z]+);/g, (m, ent) => {
    if (ent[0] === '#') {
      const isHex = ent[1] === 'x' || ent[1] === 'X';
      const codepoint = isHex ? parseInt(ent.slice(2), 16) : parseInt(ent.slice(1), 10);
      if (Number.isNaN(codepoint)) return m;
      try {
        return String.fromCodePoint(codepoint);
      } catch {
        return m;
      }
    }
    return Object.prototype.hasOwnProperty.call(named, ent) ? named[ent] : m;
  });
}

function parseHtml(html) {
  let i = 0;
  const len = html.length;
  function parseNodes() {
    const nodes = [];
    while (i < len) {
      if (html[i] === '<') {
        if (html.slice(i, i + 2) === '</') {
          const close = html.indexOf('>', i);
          i = close === -1 ? len : close + 1;
          return nodes;
        }
        const close = html.indexOf('>', i);
        if (close === -1) {
          i = len;
          break;
        }
        let tagContent = html.slice(i + 1, close);
        const selfClosing = /\/\s*$/.test(tagContent);
        tagContent = tagContent.replace(/\/\s*$/, '').trim();
        const tagMatch = tagContent.match(/^([a-zA-Z][a-zA-Z0-9]*)/);
        const tag = tagMatch ? tagMatch[1].toLowerCase() : '';
        const attrsStr = tagMatch ? tagContent.slice(tagMatch[0].length) : '';
        const attrs = {};
        const attrRe = /([a-zA-Z0-9-]+)\s*=\s*"([^"]*)"|([a-zA-Z0-9-]+)\s*=\s*'([^']*)'/g;
        let am;
        while ((am = attrRe.exec(attrsStr))) {
          if (am[1] !== undefined) attrs[am[1].toLowerCase()] = am[2];
          else attrs[am[3].toLowerCase()] = am[4];
        }
        i = close + 1;
        if (!tag) continue;
        if (selfClosing || VOID_TAGS.has(tag)) {
          nodes.push({ type: 'element', tag, attrs, children: [] });
        } else {
          const children = parseNodes();
          nodes.push({ type: 'element', tag, attrs, children });
        }
      } else {
        const next = html.indexOf('<', i);
        const text = next === -1 ? html.slice(i) : html.slice(i, next);
        if (text) nodes.push({ type: 'text', text: decodeEntities(text) });
        i = next === -1 ? len : next;
      }
    }
    return nodes;
  }
  return { children: parseNodes() };
}

function inline(node) {
  let result = '';
  for (const child of node.children) {
    if (child.type === 'text') {
      result += child.text;
      continue;
    }
    const tag = child.tag;
    const inner = inline(child);
    if (tag === 'strong' || tag === 'b') result += `**${inner}**`;
    else if (tag === 'em' || tag === 'i') result += `*${inner}*`;
    else if (tag === 'code') result += `\`${inner}\``;
    else if (tag === 'a') result += `[${inner}](${child.attrs.href || ''})`;
    else if (tag === 'br') result += '\n';
    else result += inner;
  }
  return result;
}
function rawText(node) {
  let result = '';
  for (const child of node.children) {
    if (child.type === 'text') result += child.text;
    else result += rawText(child);
  }
  return result;
}
function block(node, lines) {
  for (const child of node.children) {
    if (child.type === 'text') {
      const text = child.text.trim();
      if (text) lines.push(text);
      continue;
    }
    const tag = child.tag;
    if (/^h[1-6]$/.test(tag)) {
      const level = Number(tag[1]);
      lines.push(`${'#'.repeat(level)} ${inline(child).trim()}`);
      lines.push('');
    } else if (tag === 'p') {
      lines.push(inline(child).trim());
      lines.push('');
    } else if (tag === 'ul' || tag === 'ol') {
      let idx = 1;
      for (const li of child.children) {
        if (li.type !== 'element' || li.tag !== 'li') continue;
        const prefix = tag === 'ul' ? '-' : `${idx}.`;
        lines.push(`${prefix} ${inline(li).trim()}`);
        idx++;
      }
      lines.push('');
    } else if (tag === 'blockquote') {
      lines.push(`> ${inline(child).trim()}`);
      lines.push('');
    } else if (tag === 'pre') {
      lines.push('```');
      lines.push(rawText(child));
      lines.push('```');
      lines.push('');
    } else if (tag === 'hr') {
      lines.push('---');
      lines.push('');
    } else if (tag === 'br') {
      lines.push('');
    } else {
      block(child, lines);
    }
  }
}
function htmlToMarkdown(html) {
  const doc = parseHtml(html);
  const lines = [];
  block(doc, lines);
  return lines.join('\n').replace(/\n{3,}/g, '\n\n').trim();
}

function compute({ input }) {
  const output = (input || '').trim() ? htmlToMarkdown(input) : '';
  return { output };
}

export default createComputeHandler(compute);
