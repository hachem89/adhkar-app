# How to Update and Release Your App

Here is the step-by-step process to make changes and release updates to your users.

## 1. Make Your Changes
Make whatever code changes you want to the application (e.g., change colors, add new dhikr, fix bugs).

## 2. Increment Version
Open `package.json` and increase the version number.
*Example:* Change `"version": "1.0.0"` to `"version": "1.0.1"`

## 3. Build the New Installer
Run the build command for your platform:
```bash
npm run build:win
```
This creates the new installer (e.g., `Adhkar Reminder Setup 1.0.1.exe`) in the `dist` folder.

## 4. Release on GitHub
1. Go to your GitHub repository: https://github.com/hachem89/adhkar-app
2. Click **Releases** (on the right side)
3. Click **Draft a new release**
4. Click **Choose a tag**, type `v1.0.1` (matching your new version), and click "Create new tag"
5. Add a title like "Version 1.0.1" and some notes
6. **Important:** Drag and drop your new `.exe` file from the `dist` folder into the "Attach binaries" area
7. Click **Publish release**

## 5. Trigger the Update for Users
Now you need to tell the app that a new version exists.

1. Open `version.json` in your local project
2. Update the `version` to match your new version:
   ```json
   {
     "version": "1.0.1",
     "downloadUrl": "https://github.com/hachem89/adhkar-app/releases/latest",
     "releaseNotes": "Description of what changed..."
   }
   ```
   *(Note: You usually don't need to change `downloadUrl` if you keep it pointing to `latest`, but you can point to the specific release if you prefer)*

3. Push this change to GitHub:
   ```bash
   git add version.json
   git commit -m "Update version to 1.0.1"
   git push
   ```

## What Happens Next?
1. GitHub Pages will detect the change to `version.json` and update the live file (usually takes 1-2 minutes).
2. Users' apps check this file periodically.
3. When they see `"version": "1.0.1"` is higher than their installed `1.0.0`, they get a notification!
