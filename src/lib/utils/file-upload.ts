import { v4 as uuidv4 } from 'uuid';
import { Readable } from 'stream';
import cloudinary from '../config/cloudinary';

export interface CloudinaryUploadResult {
  url: string;
  public_id: string;
  resource_type: string;
  format: string;
  bytes: number;
  width?: number;
  height?: number;
  duration?: number;
  original_filename: string;
  secure_url: string;
}

interface FileData {
  buffer: Buffer;
  mimetype: string;
  originalname: string;
  size: number;
}

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/quicktime'];
const ALLOWED_DOC_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'text/plain'
];

export const uploadFile = async (file: FileData): Promise<CloudinaryUploadResult> => {
  if (!file?.buffer || !file.mimetype) {
    throw new Error('Invalid file or file type');
  }

  // Validate file size
  if (file.size > MAX_FILE_SIZE) {
    throw new Error(`File size exceeds the limit of ${MAX_FILE_SIZE / (1024 * 1024)}MB`);
  }

  // Determine resource type and validate MIME type
  let resourceType: 'image' | 'video' | 'raw' = 'raw';
  let folder = 'gig-workers/attachments';

  if (ALLOWED_IMAGE_TYPES.includes(file.mimetype)) {
    resourceType = 'image';
    folder = 'gig-workers/thumbnails';
  } else if (ALLOWED_VIDEO_TYPES.includes(file.mimetype)) {
    resourceType = 'video';
  } else if (!ALLOWED_DOC_TYPES.includes(file.mimetype)) {
    throw new Error(`Unsupported file type: ${file.mimetype}`);
  }

  // Generate a unique filename
  const originalName = file.originalname.split('.');
  const extension = originalName.pop() || '';
  const name = originalName
    .join('.')
    .replace(/[^a-z0-9]/gi, '_')
    .toLowerCase();
  const publicId = `${name}_${uuidv4()}.${extension}`;

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: resourceType,
        public_id: publicId,
        overwrite: false,
        format: extension || undefined,
        transformation: resourceType === 'image' ? [{ width: 1200, crop: 'limit', quality: 'auto' }, { fetch_format: 'auto' }] : undefined
      },
      (error: any, result: any) => {
        if (error) {
          return reject(new Error(`Cloudinary error: ${error.message}`));
        }
        if (!result) {
          return reject(new Error('Upload failed: No result from Cloudinary'));
        }
        if (!result?.secure_url || !result?.public_id) {
          return reject(new Error('Cloudinary upload failed'));
        }
        resolve({
          url: result.secure_url,
          public_id: result.public_id,
          resource_type: result.resource_type,
          format: result.format,
          bytes: result.bytes,
          width: result.width,
          height: result.height,
          duration: result.duration,
          original_filename: file.originalname,
          secure_url: result.secure_url
        });
      }
    );

    Readable.from(file.buffer).pipe(uploadStream);
  });
};

export const saveFileToCloud = async (file: FileData): Promise<CloudinaryUploadResult> => {
  try {
    return await uploadFile(file);
  } catch (error) {
    console.error('Error uploading file to Cloudinary:', error);
    throw new Error('Failed to upload file to Cloudinary');
  }
};

export const deleteFromCloudinary = async (publicId: string, resourceType?: string): Promise<void> => {
  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType
    });
    if (result.result !== 'ok') {
      throw new Error(`Failed to delete asset: ${publicId}`);
    }
    return result;
  } catch (error) {
    console.error('Cloudinary deletion error:', error);
    throw new Error(`Failed to delete asset: ${publicId}`);
  }
};
