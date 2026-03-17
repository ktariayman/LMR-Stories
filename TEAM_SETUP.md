# 📚 LMR Stories - Team Development Setup Guide

Welcome to the team! This guide will help you set up the **LMR Stories** children's reading app on your local machine using **IntelliJ**, **Docker**, and **Expo**.

---

## 🛠️ 1. Prerequisites
Ensure you have the following installed:
*   **Node.js** (v20+ recommended)
*   **Docker Desktop** (for the backend)
*   **Android SDK** (usually installed via Android Studio)
*   **IntelliJ IDEA** (Ultimate or Community)

---

## 🐳 2. Backend Setup (Docker)
The backend runs in Docker containers (PostgreSQL, Redis, and a NestJS server).

1.  Navigate to the root directory.
2.  Start the services:
    ```bash
    docker-compose up -d
    ```
3.  The API will be available at `http://localhost:3001`.

---

## 📱 3. Mobile App Setup (Expo & Emulator)

### A. Environment Configuration
1.  Create/Edit the `.env` file in the root directory.
2.  Find your **Laptop's IPv4 address** (run `ipconfig` in terminal).
3.  Update the `EXPO_PUBLIC_API_URL` to point to your laptop's IP so your phone/emulator can connect:
    ```env
    EXPO_PUBLIC_API_URL=http://192.168.1.XX:3001
    GEMINI_API_KEY=YOUR_KEY_HERE
    ```

### B. Starting the Emulator
1.  **IntelliJ**: Go to `Tools` -> `Android` -> `Device Manager` (if missing, ensure the Android plugin is installed).
2.  **Manual (Fastest)**: Run this in terminal:
    ```bash
    %LOCALAPPDATA%\Android\Sdk\emulator\emulator.exe -avd YOUR_DEVICE_NAME
    ```

### C. Running the App
1.  Install dependencies: `npm install`
2.  Start the Metro bundler:
    ```bash
    npx expo start --go --tunnel
    ```
3.  Press **`a`** to open on the Android Emulator.
4.  **Expo Go**: Scan the QR code with your physical phone to test on a real device.

---

## 🎨 4. Architecture: The Persistent Tab Bar
One of the core requirements of this app is a **highly persistent 100px bottom tab bar**.

*   **Location**: Managed in `app/(tabs)/_layout.tsx`.
*   **Persistent Shell**: We use **Expo Router** groups. Any screen inside the `(tabs)` folder (including details like `story/[id]`) will maintain the bottom bar.
*   **Styling**: Height is strictly `100px` with custom padding/centering for readability.

---

## 📦 5. Building the App (APK)
To create a standalone file for your phone:
1.  Login to EAS: `npx eas-cli login`
2.  Start the build:
    ```bash
    npx eas-cli build --platform android --profile preview
    ```
3.  Download the resulting APK from the link provided.

---

## 🚀 Troubleshooting
*   **No Android devices found?** Ensure `adb` is in your Path. Run `$env:Path += ";$env:LOCALAPPDATA\Android\Sdk\platform-tools"` in PowerShell.
*   **API Connection?** Ensure your phone and laptop are on the same Wi-Fi and the `.env` IP matches.
