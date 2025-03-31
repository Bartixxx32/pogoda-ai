# Testing the PWA Functionality

This document provides instructions on how to test the Progressive Web App (PWA) functionality of the Weather App.

## Prerequisites

- An Android device or emulator
- Chrome browser installed on the device
- The Weather App deployed to a HTTPS URL (e.g., using Vercel)

## Testing Steps

1. **Open the App in Chrome**
   - Open Chrome on your Android device
   - Navigate to the deployed URL of the Weather App

2. **Check for Install Prompt**
   - After using the app for a few seconds, you should see an "Install App" banner at the bottom of the screen
   - Alternatively, you can tap the three-dot menu in Chrome and look for "Add to Home Screen" or "Install App" option

3. **Install the App**
   - Tap "Install" on the prompt or select "Add to Home Screen" from the menu
   - Confirm the installation

4. **Launch the App from Home Screen**
   - Find the app icon on your home screen or app drawer
   - Tap to launch the app
   - Verify that it opens in standalone mode (without browser UI)

5. **Test Offline Functionality**
   - Use the app normally to load weather data
   - Enable Airplane mode or turn off data/WiFi
   - Refresh the app
   - Verify that previously loaded data is still accessible
   - Try searching for a new location and observe the offline message

6. **Test App Updates**
   - Make changes to the app and redeploy
   - Reopen the installed app
   - The service worker should update the app with the new version

## Troubleshooting

If the install prompt doesn't appear:
- Make sure you're using HTTPS
- Verify that the manifest.json is properly linked
- Check Chrome DevTools > Application > Manifest to see if it's valid
- Visit the site multiple times (Chrome has heuristics for showing the prompt)

If offline functionality doesn't work:
- Check Chrome DevTools > Application > Service Workers to see if it's registered
- Look at the Cache Storage to verify data is being cached
- Check the console for any service worker errors

## Lighthouse Audit

You can run a Lighthouse audit in Chrome DevTools to check PWA compliance:
1. Open DevTools (F12)
2. Go to the Lighthouse tab
3. Select "Progressive Web App" category
4. Run the audit
5. Address any issues found in the report

