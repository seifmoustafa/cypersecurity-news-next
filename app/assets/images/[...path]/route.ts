import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  try {
    // Await params in Next.js 15+
    const { path } = await context.params;

    // Reconstruct the image path
    const imagePath = path.join('/');

    // Security: Only allow specific paths
    const allowedPaths = [
      'beginners',
      'cybersecurity-framework-circle.png',
      'cybersecurity-framework-detailed.png',
      'cybersecurity-framework-table.png',
      'definitions.gif',
      'media.gif',
      'news-events.gif',
      'personal_protect.gif'
    ];

    // Check if the requested path is allowed
    const isAllowed = allowedPaths.some(allowedPath =>
      imagePath.startsWith(allowedPath) || imagePath === allowedPath
    );

    if (!isAllowed) {
      return new NextResponse('Not Found', { status: 404 });
    }

    // Build the full file path
    const fullPath = join(process.cwd(), 'public', 'images', imagePath);

    // Check if file exists
    if (!existsSync(fullPath)) {
      return new NextResponse('Image Not Found', { status: 404 });
    }

    // Read the file
    const fileBuffer = await readFile(fullPath);

    // Determine content type based on file extension
    const extension = imagePath.split('.').pop()?.toLowerCase();
    let contentType = 'image/png'; // default

    switch (extension) {
      case 'jpg':
      case 'jpeg':
        contentType = 'image/jpeg';
        break;
      case 'png':
        contentType = 'image/png';
        break;
      case 'gif':
        contentType = 'image/gif';
        break;
      case 'svg':
        contentType = 'image/svg+xml';
        break;
      case 'webp':
        contentType = 'image/webp';
        break;
    }

    // Return the image with proper headers
    return new NextResponse(fileBuffer as any, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable', // Cache for 1 year
        'Content-Length': fileBuffer.length.toString(),
      },
    });

  } catch (error) {
    console.error('Error serving image:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

