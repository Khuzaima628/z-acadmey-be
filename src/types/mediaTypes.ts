// The folders we allow inside the bucket. Add a word here and it works everywhere.
export const folders = ["profile", "course_thumbnails","course_videos","course_attachments","course_downloads"] as const;

// Only these image types are allowed
export const allowedTypes = ["image/png", "image/jpeg", "image/webp","video/mp4"];

// Biggest file we accept: 5 MB
export const MAX_FILE_SIZE = 5 * 1024 * 1024;

// What the frontend sends us
export interface presignedUrlType {
    fileName: string;
    fileType: string;
    fileSize: number;
    folder: (typeof folders)[number];
}

export interface presignedUrlResponseType {
    uploadUrl: string;
    fileUrl: string;
}
