# InterprePrep AI - Deployment Guide

This application is built with React and Vite. To ensure it works perfectly on Vercel, follow these steps:

## 1. Environment Variables
You must set the `GEMINI_API_KEY` in your Vercel project settings:
1. Go to your project on the Vercel Dashboard.
2. Navigate to **Settings** > **Environment Variables**.
3. Add a new variable:
   - **Key**: `GEMINI_API_KEY`
   - **Value**: Your Google Gemini API Key.
4. Redeploy your application.

## 2. SPA Routing
A `vercel.json` file has been included to handle SPA routing. This ensures that refreshing the page or navigating directly to sub-routes doesn't result in a 404 error.

## 3. Professional Interface
The interface has been refined to be professional and distraction-free, optimized for the high-focus environment of conference interpreting.
