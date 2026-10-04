import {
    S3Client,
    PutObjectCommand,
    ListObjectsV2Command,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3, BUCKET } from "@src/config/s3";
import type { presignedUrlType } from "@src/types/mediaTypes";

// export interface presignedUrlType {
//   fileName: string;
//   fileType: string;
//   fileSize: number;
//   folder: (typeof folders)[number];
// }

const EXPIRES_IN = 300;

export const presignedUrlService = async(body:presignedUrlType)=>{
    const key = `${body.folder}/${Date.now()}-${body.fileName}`;

    const command = new PutObjectCommand({
    Bucket: BUCKET,
    Key: key,
    ContentType: body.fileType,
    ContentLength: body.fileSize,
  });

  const uploadUrl = await getSignedUrl(s3, command, { expiresIn: EXPIRES_IN });
  const fileUrl = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;

  return { uploadUrl, fileUrl };
}
