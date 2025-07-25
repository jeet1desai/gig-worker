import { useCallback, useEffect, useRef, useState } from 'react';

type FileCategory = 'image' | 'video' | 'audio' | 'document' | 'pdf' | 'all';

type MaxSizeConfig = Partial<Record<FileCategory, number>>;

type UseFileUploaderOptions = {
  allowedCategories?: FileCategory[];
  maxSizes?: MaxSizeConfig;
  multiple?: boolean;
};

const FILE_CATEGORY_MIME_MAP: Record<FileCategory, string[]> = {
  image: ['image/jpeg', 'image/png', 'image/webp', 'image/jpg', 'image/gif'],
  video: ['video/mp4', 'video/webm', 'video/quicktime'],
  audio: ['audio/mpeg', 'audio/wav', 'audio/mp3', 'audio/ogg'],
  document: [
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-powerpoint',
    'application/pdf',
    'text/plain'
  ],
  pdf: ['application/pdf'],
  all: ['*']
};

export function useFilePicker({
  allowedCategories = ['image'],
  maxSizes = { image: 5 },
  multiple = false
}: UseFileUploaderOptions) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const input = document.createElement('input');
    input.type = 'file';
    input.accept = getAcceptedMimeTypes(allowedCategories).join(',');
    input.multiple = multiple;
    input.style.display = 'none';
    input.addEventListener('change', handleChange);
    document.body.appendChild(input);
    inputRef.current = input;

    return () => {
      input.removeEventListener('change', handleChange);
      input.remove();
    };
  }, [allowedCategories, multiple]);

  const getAcceptedMimeTypes = (categories: FileCategory[]) => {
    const types = categories.flatMap(
      (cat) => FILE_CATEGORY_MIME_MAP[cat] || []
    );
    return [...new Set(types)];
  };

  const openFileDialog = useCallback(() => {
    setError(null);
    inputRef.current?.click();
  }, []);

  const handleChange = (e: Event) => {
    const target = e.target as HTMLInputElement;
    if (!target.files) return;

    const selectedFiles = Array.from(target.files);
    const validFiles: File[] = [];
    const previews: string[] = [];

    for (const file of selectedFiles) {
      const category = getCategoryFromMimeType(file.type);
      const maxSizeMB = maxSizes[category] ?? Infinity;

      if (
        !allowedCategories.includes('all') &&
        !allowedCategories.includes(category)
      ) {
        setError(`File type "${file.type}" is not allowed.`);
        return;
      }

      if (file.size > maxSizeMB * 1024 * 1024) {
        setError(
          `${category.charAt(0).toUpperCase() + category.slice(1)} file must be less than ${maxSizeMB}MB`
        );
        return;
      }

      validFiles.push(file);

      if (file.type.startsWith('image/') || file.type.startsWith('video/')) {
        previews.push(URL.createObjectURL(file));
      }
    }

    setFiles(validFiles);
    setPreviewUrls(previews);
    setError(null);
    target.value = '';
  };

  const getCategoryFromMimeType = (type: string): FileCategory => {
    for (const [category, mimeTypes] of Object.entries(
      FILE_CATEGORY_MIME_MAP
    )) {
      if (mimeTypes.includes(type)) return category as FileCategory;
    }
    return 'all';
  };

  const clearFiles = () => {
    setFiles([]);
    setPreviewUrls([]);
    setError(null);
  };

  return {
    file: multiple ? (null as unknown as File) : files[0] || null,
    files,
    previewUrl: previewUrls.length > 0 ? previewUrls[0] : null,
    previewUrls,
    error,
    openFileDialog,
    clearFiles
  };
}
