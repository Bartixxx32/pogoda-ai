# PWA Icon Requirements

This document explains the icon requirements for the Weather App PWA.

## Icon Types

The app uses two types of icons:

1. **Standard Icons (`any` purpose)**
   - Traditional app icons with potential transparent areas
   - Used in most contexts like browser tabs, app listings, etc.
   - Located in `/public/icons/`

2. **Maskable Icons (`maskable` purpose)**
   - Fill the entire shape of adaptive icons on Android
   - Important visual elements should be within the "safe zone" (central 80%)
   - Located in `/public/icons/maskable/`

## Required Sizes

Both icon types are needed in the following sizes:
- 72×72px
- 96×96px
- 128×128px
- 144×144px
- 152×152px
- 192×192px
- 384×384px
- 512×512px

## Creating Production Icons

For production use, replace the placeholder files with actual PNG icons:

1. Start with high-quality source images (SVG or large PNG)
2. For standard icons:
   - Include some padding/transparent space around the edges
   - Use the template in `/public/icons/icon-base.svg`

3. For maskable icons:
   - Ensure the background extends to the edges
   - Keep important visual elements within the central 80%
   - Use the template in `/public/icons/maskable/maskable-base.svg`

4. Generate all required sizes using an image processing tool like Sharp

## Testing Icons

To test if your icons are properly configured:
1. Deploy your app
2. Open Chrome DevTools
3. Go to Application > Manifest
4. Check that both icon types are recognized
5. Install the app and verify icons appear correctly on home screen and in app switcher

