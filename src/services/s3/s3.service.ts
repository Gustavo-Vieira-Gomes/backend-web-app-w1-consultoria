import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v4 as uuid } from 'uuid';
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { extname } from 'path';

@Injectable()
export class S3Service {
    private s3: S3Client;
    constructor(private readonly configService: ConfigService) {
        this.s3 = new S3Client({
            region: this.configService.get<string>('AWS_REGION'),
            credentials: {
                accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY_ID'),
                secretAccessKey: this.configService.get<string>('AWS_SECRET_ACCESS_KEY'),
            },
        });
    }

    async uploadFile(file: Express.Multer.File, folder: string){
        const fileExtension = extname(file.originalname);
        const key = `${folder}/${uuid()}${fileExtension}`;
        const command = new PutObjectCommand({
            Bucket: this.configService.get<string>('AWS_BUCKET_NAME'),
            Key: key,
            Body: file.buffer,
            ContentType: file.mimetype
        });
        await this.s3.send(command);
        return key;
    }

    async deleteFile(key: string){
        const command = new DeleteObjectCommand({
            Bucket: this.configService.get<string>('AWS_BUCKET_NAME'),
            Key: key,
        });
        await this.s3.send(command);
    }
}
