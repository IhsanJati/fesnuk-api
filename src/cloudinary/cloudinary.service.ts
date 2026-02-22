import { Injectable, BadRequestException } from '@nestjs/common';
import {
  v2 as cloudinary,
  UploadApiResponse,
  UploadApiErrorResponse,
} from 'cloudinary';

@Injectable()
export class CloudinaryService {
  async uploadImage(
    file: Express.Multer.File,
    folder: string = 'general',
  ): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: folder,
          allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
          transformation: [{ height: 300, width: 300, crop: 'limit' }],
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
}
