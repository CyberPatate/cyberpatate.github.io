/**
 * Lightweight, zero-dependency Markdown parser for release notes and changelogs.
 * Safe for build-time static generation.
 */
export function renderMarkdown(markdown: string): string {
  if (!markdown) return '';

  const lines = markdown.split(/\r?\n/);
  const htmlParts: string[] = [];
  let inList = false;

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i].trim();

    if (!line) {
      if (inList) {
        htmlParts.push('</ul>');
        inList = false;
      }
      continue;
    }

    // Check for headings
    const h3Match = line.match(/^###\s+(.*)$/);
    if (h3Match) {
      if (inList) { htmlParts.push('</ul>'); inList = false; }
      htmlParts.push(`<h4>${formatInline(h3Match[1])}</h4>`);
      continue;
    }

    const h2Match = line.match(/^##\s+(.*)$/);
    if (h2Match) {
      if (inList) { htmlParts.push('</ul>'); inList = false; }
      htmlParts.push(`<h3>${formatInline(h2Match[1])}</h3>`);
      continue;
    }

    const h1Match = line.match(/^#\s+(.*)$/);
    if (h1Match) {
      if (inList) { htmlParts.push('</ul>'); inList = false; }
      htmlParts.push(`<h2>${formatInline(h1Match[1])}</h2>`);
      continue;
    }

    // Check for list items
    const listMatch = line.match(/^[-*]\s+(.*)$/);
    if (listMatch) {
      if (!inList) {
        htmlParts.push('<ul class="changelog-list">');
        inList = true;
      }
      htmlParts.push(`<li>${formatInline(listMatch[1])}</li>`);
      continue;
    }

    // If still in list and non-list item encountered
    if (inList) {
      htmlParts.push('</ul>');
      inList = false;
    }

    // Regular paragraph
    htmlParts.push(`<p>${formatInline(line)}</p>`);
  }

  if (inList) {
    htmlParts.push('</ul>');
  }

  return htmlParts.join('\n');
}

function formatInline(text: string): string {
  return text
    // Escape basic HTML tags to prevent XSS
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    // Bold: **text**
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    // Italic: *text*
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    // Inline code: `code`
    .replace(/`([^`]+)`/g, '<code class="code-token">$1</code>')
    // Links: [text](url)
    .replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
}
