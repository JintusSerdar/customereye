import { promises as fs } from 'fs';
import path from 'path';

// File system configuration
const UPLOAD_DIR = path.join(process.cwd(), 'uploads');
const REPORTS_DIR = path.join(UPLOAD_DIR, 'reports');
const IMAGES_DIR = path.join(UPLOAD_DIR, 'images');
const PDFS_DIR = path.join(UPLOAD_DIR, 'pdfs');

// Ensure upload directories exist
export async function ensureUploadDirs() {
  const dirs = [UPLOAD_DIR, REPORTS_DIR, IMAGES_DIR, PDFS_DIR];
  
  for (const dir of dirs) {
    try {
      await fs.access(dir);
    } catch {
      await fs.mkdir(dir, { recursive: true });
    }
  }
}

// File type enum
export enum FileType {
  REPORT = 'report',
  IMAGE = 'image',
  PDF = 'pdf'
}

// File info interface
export interface FileInfo {
  filename: string;
  originalName: string;
  path: string;
  type: FileType;
  size: number;
  mimeType: string;
  url: string;
}

// Save file to appropriate directory
export async function saveFile(
  file: Buffer,
  originalName: string,
  type: FileType
): Promise<FileInfo> {
  await ensureUploadDirs();
  
  const timestamp = Date.now();
  const extension = path.extname(originalName);
  const filename = `${timestamp}-${path.basename(originalName, extension)}${extension}`;
  
  let targetDir: string;
  let relativePath: string;
  
  switch (type) {
    case FileType.REPORT:
      targetDir = REPORTS_DIR;
      relativePath = `reports/${filename}`;
      break;
    case FileType.IMAGE:
      targetDir = IMAGES_DIR;
      relativePath = `images/${filename}`;
      break;
    case FileType.PDF:
      targetDir = PDFS_DIR;
      relativePath = `pdfs/${filename}`;
      break;
    default:
      throw new Error(`Unsupported file type: ${type}`);
  }
  
  const filePath = path.join(targetDir, filename);
  await fs.writeFile(filePath, file);
  
  const stats = await fs.stat(filePath);
  
  return {
    filename,
    originalName,
    path: relativePath,
    type,
    size: stats.size,
    mimeType: getMimeType(extension),
    url: `/api/files/${relativePath}`
  };
}

// Get MIME type from file extension
function getMimeType(extension: string): string {
  const mimeTypes: Record<string, string> = {
    '.txt': 'text/plain',
    '.md': 'text/markdown',
    '.json': 'application/json',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.pdf': 'application/pdf',
    '.doc': 'application/msword',
    '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  };
  
  return mimeTypes[extension.toLowerCase()] || 'application/octet-stream';
}

// Read file content
export async function readFile(filePath: string): Promise<Buffer> {
  const fullPath = path.join(UPLOAD_DIR, filePath);
  return await fs.readFile(fullPath);
}

// Delete file
export async function deleteFile(filePath: string): Promise<void> {
  const fullPath = path.join(UPLOAD_DIR, filePath);
  try {
    await fs.unlink(fullPath);
  } catch {
    console.warn(`File not found for deletion: ${fullPath}`);
  }
}

// List files in directory
export async function listFiles(dir: string): Promise<string[]> {
  const fullPath = path.join(UPLOAD_DIR, dir);
  try {
    const files = await fs.readdir(fullPath);
    return files.filter(file => !file.startsWith('.'));
  } catch {
    return [];
  }
}

// Get file info
export async function getFileInfo(filePath: string): Promise<FileInfo | null> {
  const fullPath = path.join(UPLOAD_DIR, filePath);
  try {
    const stats = await fs.stat(fullPath);
    const extension = path.extname(filePath);
    
    return {
      filename: path.basename(filePath),
      originalName: path.basename(filePath),
      path: filePath,
      type: getFileTypeFromPath(filePath),
      size: stats.size,
      mimeType: getMimeType(extension),
      url: `/api/files/${filePath}`
    };
  } catch {
    return null;
  }
}

// Determine file type from path
function getFileTypeFromPath(filePath: string): FileType {
  const extension = path.extname(filePath).toLowerCase();
  
  if (['.jpg', '.jpeg', '.png', '.gif', '.svg'].includes(extension)) {
    return FileType.IMAGE;
  } else if (extension === '.pdf') {
    return FileType.PDF;
  } else {
    return FileType.REPORT;
  }
}

// Create sample report file
export async function createSampleReport(companyName: string, content: string): Promise<string> {
  await ensureUploadDirs();
  
  const filename = `${companyName.toLowerCase().replace(/\s+/g, '-')}-report.txt`;
  const filePath = path.join(REPORTS_DIR, filename);
  
  await fs.writeFile(filePath, content);
  
  return `reports/${filename}`;
}

// Create sample company image placeholder
export async function createSampleImage(companyName: string): Promise<string> {
  await ensureUploadDirs();
  
  // For now, we'll use emojis as placeholders
  // In a real app, you'd generate or upload actual images
  const emojiMap: Record<string, string> = {
    'restaurant': '🍽️',
    'tech': '💻',
    'fitness': '💪',
    'beauty': '💄',
    'health': '🏥',
    'education': '📚',
    'finance': '🏦',
    'transport': '🚚',
    'default': '🏢'
  };
  
  // Determine emoji based on company name or industry
  let emoji = emojiMap.default;
  for (const [key, value] of Object.entries(emojiMap)) {
    if (companyName.toLowerCase().includes(key)) {
      emoji = value;
      break;
    }
  }
  
  return emoji;
}
