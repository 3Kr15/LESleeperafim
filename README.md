# SleepWell (Web App + Chrome Browser Extension)

## Overview
SleepWell is a web and browser extension application designed to help users achieve better rest, deeper relaxation, and more refreshing nights. It creates a calming sleep environment through features like white noise playback, vibration patterns, and visual night mode. When sleep mode is enabled, browser extensions kicks in to filter allowed sites only and block access for other websites

## Features
- **Sleep Mode:** Switch to a peaceful night interface with relaxing visuals
- **Winddown Guardian:** The browser extension that enables only authorized sites, with informative screen time usage when ext is clicked.
- **White Noise:** Plays continuous calming sounds to aid sleep.
- **Sleep Timer:** Tracks sleep duration in real-time while sleep mode is active.
- **Time-Based Themes:** Automatically adapts the interface to morning, afternoon, or night.
- **Informative Dashboard:** Display users sleep patterns and quality
- **Friends Leaderboard:** Compare amount of sleeps clocked in by your friends, gain streaks, and gentle nudges

## ⚙️ Problem and Significance
Many people struggle to achieve restful and uninterrupted sleep due to environmental distractions, stress, or irregular routines. Poor sleep can lead to decreased productivity, weakened immunity, and negative effects on mental health.  

SleepWell addresses this problem by creating a controlled, relaxing environment that helps users unwind and sleep better. By combining soothing sounds, gentle vibration cues, and visual cues tailored to the time of day, SleepWell aims to improve sleep quality, promote relaxation, and support overall well-being. H

**Problem Statement:** *How might we help people sleep more soundly, relax more deeply, and wake more refreshed—by reducing late-night digital stimulation and offering an automated, compassionate way to wind down?*

## 💡 Inspiration
Our idea grew out of three simple observations: school and workplace policies (like MOE’s Mobile Guardian and recent company restrictions during our internships) already show that limiting access reduces distraction; people naturally turn to music and calming sounds to relax; and less access often means less screen time and better wind-down routines. SleepWell combines these lessons — gentle, user-controlled blocking plus soothing audio and visual cues — to create a compassionate, automated wind-down that reduces late-night stimulation and helps users fall asleep more easily.

## 🏅 What makes SleepWell unique
- **Whitelist-first enforcement:** the extension defaults to allowing only designated sites (e.g., our own app / school websites), but is flexible — users can request temporary access to blocked pages or choose from multiple override options.  
- **Built-in Sleep Mode with audio integration:** seamless night UI + forced white-noise/music playback that connects to your chosen tracks when sleep mode starts.  
- **Resumable sleep timer:** tracks sleep duration across reloads and sessions so users get accurate nightly totals.  
- **Social motivation for Gen-Z:** optional friends leaderboard, streaks, and gentle nudges to encourage consistent wind-down habits.  
- **Privacy-minded:** local-first storage by default (showcase by using -local in memory); any sharing or cloud sync is explicit and opt-in.

## 📝 How the product is meant to be used
Use the SleepWell web app to track your sleep streaks and view the friends leaderboard. When you’re ready to wind down, enable Sleep Mode to block distractions, play calming sounds, and track your sleep duration for a more refreshing rest.

## Quick start (dev)
1. Run Node server: `npm install && node app.js`  
2. Load extension in Chrome (Developer mode) using the `chrome-extension-pack-winddown/` folder.  
3. Open web app, sign in (any credentials will do) and enable Sleep Mode, and test blocking + sleep timer.

## 🛠️ Technologies and Techniques Used
- **JavaScript** for the extension logic and Node.js server
- **HTML and CSS** styling for visuals 

## 🧗 Challenges 
1. **Learning Browser Extension Development**: Extensions are slightly different compared to standard web development. We spent hours figuring out the standard layout and structure and chromes functionalities in tracking browser permission.
2. **Integrating Webapp with Browser Extension**: We had no prior experience and we had to research more on this for both to send data interchangeability.

## 💼 The product as a business / at scale
**Vision:**  
Turn SleepWell into a privacy-first sleep-wellness platform that helps other reclaim better evenings through behavior change, calming content, and optional device integrations.

**Business model & revenue streams**
- Browser extensions are more portable and easily work across other devices, only needing to install from the store
- Premium subscription feature: with the social element leaderboard, this product can be marketed to enable 
- Advertisement: with the Winddown Guardian, we can display advertisement to earn revenues, promoting according to interest

**Go-to-market / distribution**
- Chrome Web Store (extension) + direct web app sign-up.  
- Campus pilots & partnerships with universities/colleges (student wellbeing programs). 
- Social growth: Gen-Z-friendly features (leaderboards, streaks) + influencers and student ambassadors.

**Scaling & operations**
- Auto-scale via serverless or container orchestration, only need to deploy Webapp, can be done via example EC2 Instance.
- Browser Extension to be compatible with all other browsers.

**Future Plan**
- **Mobile app:** full controller for schedules, remote Sleep Mode, audio, and streaks (Android first; iOS more restrictive). Browser extension not needed
- **ESP32 companion:** low-cost bedside/ wearable (accelerometer, optional PPG, I²S mic) that detects motion/snore events on-device and sends lightweight events to the app. If not, preferrably a smartwatch gadget which has the same functionality
  



