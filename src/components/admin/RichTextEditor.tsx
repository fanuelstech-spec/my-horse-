import React, { useState, useRef } from 'react';
import {
  Bold,
  Italic,
  Heading2,
  Heading3,
  Quote,
  List,
  Link as LinkIcon,
  Eye,
  Edit3,
} from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (val: string) => void;
  label?: string;
  placeholder?: string;
  rows?: number;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  label,
  placeholder = 'Write editorial copy...',
  rows = 10,
}) => {
  const [tab, setTab] = useState<'write' | 'preview'>('write');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const insertFormat = (before: string, after: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) {
      onChange((value || '') + before + after);
      return;
    }

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = value || '';
    const selected = text.substring(start, end);
    const replacement = before + (selected || 'text') + after;
    const nextVal = text.substring(0, start) + replacement + text.substring(end);

    onChange(nextVal);
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + before.length,
        start + before.length + (selected.length || 4)
      );
    }, 10);
  };

  // Quick word and character calculation
  const words = (value || '').trim() ? (value || '').trim().split(/\s+/).length : 0;
  const chars = (value || '').length;

  const renderPreview = (text: string) => {
    if (!text || !text.trim()) {
      return (
        <p className="text-[#73716B] italic font-serif">
          No content written yet. Switch to "Write" mode to compose.
        </p>
      );
    }

    const lines = text.split('\n');
    return (
      <div className="space-y-2 text-sm text-[#20201E]">
        {lines.map((line, idx) => {
          if (line.startsWith('# ')) {
            return (
              <h2 key={idx} className="font-serif text-2xl text-[#20201E] mt-4 mb-2 font-medium">
                {line.replace('# ', '')}
              </h2>
            );
          }
          if (line.startsWith('## ')) {
            return (
              <h3 key={idx} className="font-serif text-xl text-[#20201E] mt-3 mb-1 font-medium">
                {line.replace('## ', '')}
              </h3>
            );
          }
          if (line.startsWith('### ')) {
            return (
              <h4 key={idx} className="font-serif text-lg text-[#20201E] mt-2 mb-1 font-medium">
                {line.replace('### ', '')}
              </h4>
            );
          }
          if (line.startsWith('> ')) {
            return (
              <blockquote
                key={idx}
                className="border-l-2 border-[#A89472] pl-4 italic text-[#73716B] my-2 font-serif"
              >
                {line.replace('> ', '')}
              </blockquote>
            );
          }
          if (line.startsWith('* ') || line.startsWith('- ')) {
            return (
              <li key={idx} className="ml-5 list-disc text-sm text-[#20201E]">
                {line.replace(/^(\*|-)\s+/, '')}
              </li>
            );
          }
          if (!line.trim()) {
            return <div key={idx} className="h-2" />;
          }
          return (
            <p key={idx} className="leading-relaxed">
              {line}
            </p>
          );
        })}
      </div>
    );
  };

  return (
    <div className="space-y-1.5">
      {label && (
        <div className="flex items-center justify-between">
          <label className="block text-xs uppercase tracking-wider text-[#73716B] font-medium">
            {label}
          </label>
          <span className="text-[10px] text-[#73716B] hidden sm:inline">Markdown supported</span>
        </div>
      )}

      <div className="border border-[#B7B0A4]/40 bg-white">
        {/* Toolbar */}
        <div className="flex items-center justify-between px-2.5 sm:px-3 py-1.5 border-b border-[#B7B0A4]/25 bg-[#FAF9F6] gap-2 overflow-x-auto">
          <div className="flex items-center space-x-1 text-[#73716B] shrink-0">
            <button
              type="button"
              onClick={() => insertFormat('## ')}
              className="p-1.5 hover:text-[#20201E] hover:bg-[#B7B0A4]/20 rounded min-w-[32px] min-h-[32px] flex items-center justify-center cursor-pointer"
              title="Heading 2"
            >
              <Heading2 className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => insertFormat('### ')}
              className="p-1.5 hover:text-[#20201E] hover:bg-[#B7B0A4]/20 rounded min-w-[32px] min-h-[32px] flex items-center justify-center cursor-pointer"
              title="Heading 3"
            >
              <Heading3 className="w-4 h-4" />
            </button>
            <span className="w-[1px] h-4 bg-[#B7B0A4]/40 mx-0.5" />
            <button
              type="button"
              onClick={() => insertFormat('**', '**')}
              className="p-1.5 hover:text-[#20201E] hover:bg-[#B7B0A4]/20 rounded min-w-[32px] min-h-[32px] flex items-center justify-center cursor-pointer"
              title="Bold"
            >
              <Bold className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => insertFormat('*', '*')}
              className="p-1.5 hover:text-[#20201E] hover:bg-[#B7B0A4]/20 rounded min-w-[32px] min-h-[32px] flex items-center justify-center cursor-pointer"
              title="Italic"
            >
              <Italic className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => insertFormat('> ')}
              className="p-1.5 hover:text-[#20201E] hover:bg-[#B7B0A4]/20 rounded min-w-[32px] min-h-[32px] flex items-center justify-center cursor-pointer"
              title="Quote"
            >
              <Quote className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => insertFormat('- ')}
              className="p-1.5 hover:text-[#20201E] hover:bg-[#B7B0A4]/20 rounded min-w-[32px] min-h-[32px] flex items-center justify-center cursor-pointer"
              title="Bullet list"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => insertFormat('[', '](https://)')}
              className="p-1.5 hover:text-[#20201E] hover:bg-[#B7B0A4]/20 rounded min-w-[32px] min-h-[32px] flex items-center justify-center cursor-pointer"
              title="Insert Link"
            >
              <LinkIcon className="w-4 h-4" />
            </button>
          </div>

          {/* Mode Switch Tabs */}
          <div className="flex items-center space-x-1 text-xs shrink-0">
            <button
              type="button"
              onClick={() => setTab('write')}
              className={`px-2.5 py-1 rounded flex items-center space-x-1 transition-colors min-h-[30px] ${
                tab === 'write'
                  ? 'bg-[#24362D] text-white font-medium shadow-xs'
                  : 'text-[#73716B] hover:text-[#20201E] hover:bg-[#B7B0A4]/20'
              }`}
            >
              <Edit3 className="w-3 h-3" />
              <span>Write</span>
            </button>
            <button
              type="button"
              onClick={() => setTab('preview')}
              className={`px-2.5 py-1 rounded flex items-center space-x-1 transition-colors min-h-[30px] ${
                tab === 'preview'
                  ? 'bg-[#24362D] text-white font-medium shadow-xs'
                  : 'text-[#73716B] hover:text-[#20201E] hover:bg-[#B7B0A4]/20'
              }`}
            >
              <Eye className="w-3 h-3" />
              <span>Preview</span>
            </button>
          </div>
        </div>

        {/* Body Editor or Preview */}
        {tab === 'write' ? (
          <textarea
            ref={textareaRef}
            rows={rows}
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full p-3 sm:p-4 text-xs sm:text-sm text-[#20201E] font-sans leading-relaxed bg-white focus:outline-none focus:ring-1 focus:ring-[#24362D] resize-y min-h-[140px]"
          />
        ) : (
          <div className="p-4 sm:p-6 bg-[#FAF9F6] min-h-[140px] max-h-[500px] overflow-y-auto">
            {renderPreview(value)}
          </div>
        )}

        {/* Footer Metrics */}
        <div className="px-3 py-1.5 bg-[#FAF9F6] border-t border-[#B7B0A4]/25 flex items-center justify-between text-[10px] text-[#73716B]">
          <span>{tab === 'write' ? 'Markdown enabled' : 'Rendered preview'}</span>
          <span>
            {words} {words === 1 ? 'word' : 'words'} · {chars} chars
          </span>
        </div>
      </div>
    </div>
  );
};
