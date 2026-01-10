import { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, Trash2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface MultiDragDropUploadProps {
    onUpload: (files: File[]) => void;
    isUploading: boolean;
    currentImages: string[];
    onRemove: (index: number) => void;
    maxFiles?: number;
}

export const MultiDragDropUpload = ({ onUpload, isUploading, currentImages, onRemove, maxFiles = 10 }: MultiDragDropUploadProps) => {
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);

        const files = Array.from(e.dataTransfer.files).filter(file => file.type.startsWith('image/'));
        if (files.length > 0) {
            if (currentImages.length + files.length > maxFiles) {
                toast.error(`อัพโหลดได้สูงสุด ${maxFiles} รูป`);
                onUpload(files.slice(0, maxFiles - currentImages.length));
            } else {
                onUpload(files);
            }
        }
    }, [onUpload, currentImages.length, maxFiles]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []).filter(file => file.type.startsWith('image/'));
        if (files.length > 0) {
            if (currentImages.length + files.length > maxFiles) {
                toast.error(`อัพโหลดได้สูงสุด ${maxFiles} รูป`);
                onUpload(files.slice(0, maxFiles - currentImages.length));
            } else {
                onUpload(files);
            }
        }
        // Reset input
        if (e.target) e.target.value = '';
    };

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-5 gap-3">
                {currentImages.map((img, index) => (
                    <div key={index} className="relative group aspect-square rounded-lg overflow-hidden border bg-muted">
                        <img
                            src={img}
                            alt={`Gallery ${index + 1}`}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute top-1 right-1 bg-black/60 text-white text-xs px-1.5 py-0.5 rounded">
                            {index + 1}
                        </div>
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <Button
                                type="button"
                                variant="destructive"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => onRemove(index)}
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                ))}
                {currentImages.length < maxFiles && (
                    <div
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        onClick={() => !isUploading && fileInputRef.current?.click()}
                        className={cn(
                            "aspect-square rounded-lg border-2 border-dashed transition-all cursor-pointer",
                            "flex flex-col items-center justify-center gap-1",
                            isDragging
                                ? "border-primary bg-primary/10"
                                : "border-muted-foreground/30 hover:border-primary/50 hover:bg-muted/50",
                            isUploading && "pointer-events-none opacity-70"
                        )}
                    >
                        {isUploading ? (
                            <Loader2 className="h-5 w-5 text-primary animate-spin" />
                        ) : (
                            <>
                                <Upload className="h-5 w-5 text-muted-foreground" />
                                <span className="text-[10px] text-muted-foreground text-center px-1">เพิ่มรูป</span>
                            </>
                        )}
                    </div>
                )}
            </div>
            <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
            />
            <p className="text-xs text-muted-foreground">
                {currentImages.length}/{maxFiles} รูป (ลากไฟล์มาวางหรือคลิกเพื่อเพิ่ม)
            </p>
        </div>
    );
};
