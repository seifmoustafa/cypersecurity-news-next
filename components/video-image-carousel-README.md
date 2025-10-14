# Video/Image Carousel Component

A sophisticated React component that provides YouTube-like playlist functionality for videos and images, with seamless fallback handling and perfect UI/UX design.

## Features

### 🎥 **Video & Image Support**
- **Smart Fallback**: Automatically shows images when `videoUrl` is null
- **Aspect Ratio Preservation**: Maintains proper aspect ratios for both videos and images
- **Poster Support**: Uses images as video posters when available

### 🎮 **Playlist Navigation**
- **Next/Previous**: Navigate through items like a YouTube playlist
- **Keyboard Controls**: Arrow keys, spacebar, and other shortcuts
- **Thumbnail Strip**: Visual navigation with thumbnails
- **Auto-play**: Seamless transitions between items

### 🎨 **Perfect UI/UX**
- **Modern Design**: Clean, professional interface inspired by Windows Gallery and YouTube
- **Responsive**: Works perfectly on all screen sizes
- **Dark Mode**: Full dark mode support
- **Smooth Animations**: Framer Motion powered transitions
- **Auto-hide Controls**: Controls fade in/out intelligently

### 🎛️ **Advanced Controls**
- **Play/Pause**: Full video control
- **Volume Control**: Mute/unmute functionality
- **Progress Bar**: Clickable progress tracking
- **Fullscreen**: Enter/exit fullscreen mode
- **Time Display**: Current time / total duration

### 🌐 **Internationalization**
- **RTL Support**: Perfect Arabic language support
- **Localized Text**: All UI text supports multiple languages
- **Cultural Adaptation**: UI adapts to reading direction

## Usage

### Basic Usage

```tsx
import VideoImageCarousel from '@/components/video-image-carousel'

const items = [
  {
    id: '1',
    name: 'Video Title',
    nameEn: 'Video Title English',
    summary: 'Video summary',
    summaryEn: 'Video summary English',
    imageUrl: 'https://example.com/image.jpg',
    videoUrl: 'https://example.com/video.mp4',
    order: 1,
    createdAt: '2024-01-01'
  },
  {
    id: '2',
    name: 'Image Title',
    nameEn: 'Image Title English',
    summary: 'Image summary',
    summaryEn: 'Image summary English',
    imageUrl: 'https://example.com/image2.jpg',
    videoUrl: null, // Will show image instead
    order: 2,
    createdAt: '2024-01-02'
  }
]

function MyComponent() {
  const handleItemChange = (item, index) => {
    console.log('Current item:', item, 'Index:', index)
  }

  return (
    <VideoImageCarousel
      items={items}
      initialIndex={0}
      onItemChange={handleItemChange}
      className="w-full h-96"
    />
  )
}
```

### With Personal Protect Steps

```tsx
import { usePersonalProtectControlSteps } from '@/core/hooks/use-personal-protect-control-steps'
import VideoImageCarousel from '@/components/video-image-carousel'

function PersonalProtectStepPage({ controlId }) {
  const { steps } = usePersonalProtectControlSteps(controlId)
  
  const handleStepChange = (step, index) => {
    // Navigate to the new step
    router.push(`/step/${step.id}`)
  }

  return (
    <VideoImageCarousel
      items={steps}
      initialIndex={0}
      onItemChange={handleStepChange}
    />
  )
}
```

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `items` | `MediaItem[]` | ✅ | Array of media items (videos/images) |
| `initialIndex` | `number` | ❌ | Starting index (default: 0) |
| `onItemChange` | `(item: MediaItem, index: number) => void` | ❌ | Callback when item changes |
| `className` | `string` | ❌ | Additional CSS classes |

## MediaItem Interface

```typescript
interface MediaItem {
  id: string
  name: string | null
  nameEn: string | null
  summary: string | null
  summaryEn: string | null
  content: string | null
  contentEn: string | null
  imageUrl: string | null
  videoUrl: string | null
  order: number
  createdAt: string
}
```

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `←` / `→` | Previous/Next item |
| `Space` | Play/Pause video |
| `M` | Mute/Unmute |
| `F` | Toggle fullscreen |
| `Esc` | Exit fullscreen |

## Styling

The component uses Tailwind CSS and supports:
- Custom className prop for additional styling
- Dark mode via `dark:` prefixes
- Responsive design with mobile-first approach
- Smooth transitions and hover effects

## Browser Support

- **Modern Browsers**: Chrome, Firefox, Safari, Edge
- **Video Formats**: MP4, WebM
- **Image Formats**: JPEG, PNG, WebP, AVIF
- **Features**: Fullscreen API, Video API, Keyboard Events

## Performance

- **Lazy Loading**: Images load only when needed
- **Preloading**: Next/previous items preload for smooth transitions
- **Memory Management**: Proper cleanup of event listeners and intervals
- **Optimized Rendering**: Uses React.memo and useCallback for performance

## Accessibility

- **Keyboard Navigation**: Full keyboard support
- **Screen Readers**: Proper ARIA labels and descriptions
- **Focus Management**: Clear focus indicators
- **Color Contrast**: WCAG compliant color schemes

## Examples

### Personal Protect Videos
The component is already integrated into the personal protect videos section at:
`/simple/personal-protect/[id]/[videoId]`

### Personal Protect Steps
The component is integrated into the personal protect steps at:
`/simple/personal-protect/[categoryId]/[subcategoryId]/[controlId]/[stepId]`

## Customization

### Custom Controls
You can customize the appearance by overriding CSS classes:

```css
.video-carousel-controls {
  /* Custom control styling */
}

.video-carousel-thumbnails {
  /* Custom thumbnail styling */
}
```

### Custom Media Types
Extend the MediaItem interface to support additional media types:

```typescript
interface ExtendedMediaItem extends MediaItem {
  audioUrl?: string | null
  documentUrl?: string | null
  // Add more media types as needed
}
```

## Troubleshooting

### Common Issues

1. **Videos not playing**: Check video URL and format support
2. **Images not loading**: Verify image URLs and CORS settings
3. **Controls not showing**: Ensure proper mouse movement detection
4. **Keyboard not working**: Check focus management and event listeners

### Debug Mode

Enable debug logging by setting:
```javascript
localStorage.setItem('video-carousel-debug', 'true')
```

## Contributing

When contributing to this component:
1. Maintain backward compatibility
2. Add proper TypeScript types
3. Include accessibility features
4. Test on multiple browsers
5. Update documentation

## License

This component is part of the cybersecurity news application and follows the same license terms.
