import { describe, test, expect, vi } from 'vitest';
import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

// Mock html2pdf.js before importing the component
const mockChain = {
  set: vi.fn().mockReturnThis(),
  from: vi.fn().mockReturnThis(),
  save: vi.fn().mockResolvedValue(),
};
vi.mock('html2pdf.js', () => {
  return { default: vi.fn(() => mockChain) };
});

import LatexToPdf from './LatexToPDF.jsx';

// Helper: find preview div(s) by inline style parts
function findPreviewDivs(container) {
  return Array.from(container.querySelectorAll('div')).filter((d) => {
    const s = d.getAttribute('style') || '';
    return s.includes('width: 794px') && s.includes('background: white');
  });
}

describe('JacobUnitTests — LatexToPdf Update PDF Preview', () => {
  test('Task A: Update PDF Preview injects textarea HTML into preview div', () => {
    const initial = { html: '<p>initial</p>' };
    const { container, getByText } = render(<LatexToPdf {...initial} />);

    const textarea = container.querySelector('#editableHTML');
    expect(textarea).toBeTruthy();

    fireEvent.change(textarea, { target: { value: '<h2>Updated Heading</h2><p>body</p>' } });
    fireEvent.click(getByText('Update PDF Preview'));

    const previews = findPreviewDivs(container);
    const anyMatches = previews.some((d) => d.innerHTML.includes('Updated Heading'));
    expect(anyMatches).toBe(true);
  });

  test('Task B: Preview element contains required inline styles for capture', () => {
    const initial = { html: '<p>initial</p>' };
    const { container } = render(<LatexToPdf {...initial} />);

    const previews = findPreviewDivs(container);
    expect(previews.length).toBeGreaterThanOrEqual(1);

    previews.forEach((d) => {
      const style = d.getAttribute('style') || '';
      expect(style).toContain('width: 794px');
      expect(style).toContain('background: white');
    });
  });

  test('Task C: Multiple updates apply latest changes', () => {
    const initial = { html: '<p>initial</p>' };
    const { container, getByText } = render(<LatexToPdf {...initial} />);

    const textarea = container.querySelector('#editableHTML');

    fireEvent.change(textarea, { target: { value: '<p>first update</p>' } });
    fireEvent.click(getByText('Update PDF Preview'));

    fireEvent.change(textarea, { target: { value: '<p>second update — latest</p>' } });
    fireEvent.click(getByText('Update PDF Preview'));

    const previews = findPreviewDivs(container);
    const matchesLatest = previews.some((d) => d.innerHTML.includes('second update — latest'));
    expect(matchesLatest).toBe(true);
  });

  test('Task D: Update uses current textarea value, not the initial prop', () => {
    const initial = { html: '<p>initial-prop</p>' };
    const { container, getByText } = render(<LatexToPdf {...initial} />);

    const textarea = container.querySelector('#editableHTML');
    fireEvent.change(textarea, { target: { value: '<div>user edited content</div>' } });
    fireEvent.click(getByText('Update PDF Preview'));

    const previews = findPreviewDivs(container);
    const matchesEdited = previews.some((d) => d.innerHTML.includes('user edited content'));
    const matchesInitial = previews.some((d) => d.innerHTML.includes('initial-prop'));

    expect(matchesEdited).toBe(true);
    expect(matchesInitial).toBe(false);
  });
});