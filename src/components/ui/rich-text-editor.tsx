import React, { Suspense, lazy } from 'react';
import 'react-quill/dist/quill.snow.css';

const ReactQuill = lazy(() => import('react-quill'));

interface RichTextEditorProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
}

const modules = {
    toolbar: [
        [{ 'header': [1, 2, 3, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        ['link', 'image'],
        ['clean']
    ],
};

const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'list', 'bullet',
    'link', 'image'
];

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
    value,
    onChange,
    placeholder,
    className
}) => {
    return (
        <div className={`rich-text-editor ${className}`}>
            <Suspense fallback={<div className="h-[150px] w-full animate-pulse rounded-md bg-muted" />}>
                <ReactQuill
                    theme="snow"
                    value={value}
                    onChange={onChange}
                    modules={modules}
                    formats={formats}
                    placeholder={placeholder}
                    className="bg-card text-card-foreground rounded-md border border-input focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2"
                />
            </Suspense>
            <style>{`
        .ql-toolbar {
          border-top-left-radius: 0.5rem;
          border-top-right-radius: 0.5rem;
          border-color: hsl(var(--border)) !important;
          background: hsl(var(--muted) / 0.5);
        }
        .ql-container {
          border-bottom-left-radius: 0.5rem;
          border-bottom-right-radius: 0.5rem;
          border-color: hsl(var(--border)) !important;
          font-family: var(--font-sans);
          font-size: 1rem;
        }
        .ql-editor {
          min-height: 150px;
        }
      `}</style>
        </div>
    );
};
