import { NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

export async function GET() {
  try {
    const iconPath = join(process.cwd(), 'public', 'app-icon.png');
    
    if (!existsSync(iconPath)) {
      return new NextResponse('Icon Not Found', { status: 404 });
    }
    
    const fileBuffer = await readFile(iconPath);
    
    return new NextResponse(fileBuffer as any, {
      status: 200,
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=31536000, immutable', // Cache for 1 year
        'Content-Length': fileBuffer.length.toString(),
      },
    });
    
  } catch (error) {
    console.error('Error serving app icon:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
