import { Injectable, BadRequestException } from '@nestjs/common';
import {
  v2 as cloudinary,
  UploadApiResponse,
  UploadApiErrorResponse,
  TransformationOptions,
} from 'cloudinary';

@Injectable()
export class CloudinaryService {
  async uploadImage(
    file: Express.Multer.File,
    folder: string,
    transformationOption: TransformationOptions = [
      { height: 300, width: 300, crop: 'limit' },
    ],
  ): Promise<UploadApiResponse> {
    if (!file?.buffer) {
      throw new BadRequestException('Image file is required');
    }

    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: folder,
          allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
          transformation: transformationOption,
        },
        (error: UploadApiErrorResponse, result: UploadApiResponse) => {
          if (error) {
            return reject(new BadRequestException('Failed to uploading image'));
          }
          resolve(result);
        },
      );

      uploadStream.end(file.buffer);
    });
  }

  async deleteImage(publicId: string): Promise<void> {
    try {
      if (!publicId) return;
      await cloudinary.uploader.destroy(publicId);
    } catch (error) {
      console.error('[Cloudinary] Delete image failed:', error);
    }
  }
}
