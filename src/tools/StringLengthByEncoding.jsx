import { useMemo, useState } from 'react';
function measure(text) {
  const utf16Length = text.length;
  const codePointLength = [...text].length;
  const utf8ByteLength = new TextEncoder().encode(text).length;
  return { utf16Length, codePointLength, utf8ByteLength };
}
export default function StringLengthByEncoding() {
  const [input, setInput] = useState('');
  const { utf16Length, codePointLength, utf8ByteLength } = useMemo(() => measure(input), [input]);
  return (
    <div className="tool-page">
      <h1>String Length By Encoding</h1>
      <p className="tool-description">
        Paste text to see its length measured three ways: the JS string length (UTF-16 code units,
        what <code>.length</code> returns), the actual Unicode code point count (correctly counts
        emoji and other characters outside the Basic Multilingual Plane), and the UTF-8 byte length
        (what it costs to store or transmit as UTF-8). Useful for understanding why an emoji like
        "😀" has a JS <code>.length</code> of 2 but is 1 character and 4 UTF-8 bytes. Runs entirely
        in your browser.
      </p>
      <div className="tool-panel">
        <label htmlFor="strlen-input">Text</label>
        <textarea
          id="strlen-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type or paste text here, try including an emoji like 😀"
        />
      </div>
      <div className="timestamp-result">
        <span>
          <strong>UTF-16 code units (.length):</strong> {utf16Length}
        </span>
        <span>
          <strong>Unicode code points:</strong> {codePointLength}
        </span>
        <span>
          <strong>UTF-8 bytes:</strong> {utf8ByteLength}
        </span>
      </div>
    </div>
  );
}
