# Cybersecurity News Next.js Application

A comprehensive cybersecurity news and information platform built with Next.js.

## Features

### Dynamic Scroll URL Updates
The home page now features dynamic URL updates while scrolling through different sections:

- **Automatic URL Updates**: As you scroll through the page, the URL automatically updates to reflect the current section (e.g., `/#awareness`, `/advanced#security-requirements`, `/advanced#concepts`)
- **Browser Navigation**: When you navigate to a page within any section and press the browser's back button, you'll return to the exact section you were viewing
- **Smooth Scrolling**: All section navigation includes smooth scrolling for a better user experience
- **Debounced Updates**: URL updates are debounced to prevent excessive history entries

### How It Works

1. **Scroll Detection**: The `useScrollUrl` hook monitors scroll position and detects which section is currently in view
2. **URL Updates**: When a new section comes into view, the URL is updated using `window.history.replaceState()`
3. **Browser Back/Forward**: The hook listens for `popstate` events to handle browser navigation
4. **Section Anchors**: Each section has a `.section-anchor` class with a unique ID for detection

### Sections Supported

- `/#awareness` - Awareness section
- `/advanced#security-requirements` - Security requirements section  
- `/advanced#concepts` - Cybersecurity concepts section
- `/advanced#media` - Media library section
- `/#helpers` - Helper systems section
- `/advanced#systems` - Main systems section

### Technical Implementation

The feature is implemented using:

- **Custom Hook**: `useScrollUrl` in `core/hooks/use-scroll-url.ts`
- **Scroll Detection**: Uses `getBoundingClientRect()` to determine section visibility
- **Debouncing**: 100ms debounce to prevent excessive updates
- **History API**: Uses `replaceState` to update URLs without creating new history entries
- **Event Handling**: Listens for `popstate` events for browser navigation

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

1. Navigate to the home page
2. Scroll through different sections
3. Notice the URL updates automatically (e.g., `/#awareness`, `/advanced#concepts`)
4. Click on any navigation item in the header to jump to a specific section
5. Navigate to any sub-page and use the browser's back button to return to your previous section

## Browser Support

This feature works in all modern browsers that support:
- `window.history.replaceState()`
- `getBoundingClientRect()`
- `addEventListener` with `passive: true`
