declare module 'react-quill' {
    import React from 'react';

    export interface ReactQuillProps {
        theme?: string;
        modules?: unknown;
        formats?: string[];
        value?: string;
        defaultValue?: string;
        placeholder?: string;
        readOnly?: boolean;
        onChange?: (value: string, delta: unknown, source: unknown, editor: unknown) => void;
        onChangeSelection?: (selection: unknown, source: unknown, editor: unknown) => void;
        className?: string;
        style?: React.CSSProperties;
        children?: React.ReactNode;
    }

    const ReactQuill: React.FC<ReactQuillProps>;
    export default ReactQuill;
}
