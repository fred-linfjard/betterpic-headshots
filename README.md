# ChatGPT AI Headshots App

A ChatGPT app that lets users generate professional AI headshots via the Runflow API directly inside the ChatGPT interface.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Build the project:
   ```bash
   npm run build
   ```

3. Start the MCP server:
   ```bash
   npm start
   ```
   The server runs on http://localhost:8000

4. For production/local testing with ChatGPT, tunnel with ngrok:
   ```bash
   ngrok http 8000
   ```
   Use the provided URL (e.g., https://abc123.ngrok-free.app/mcp) in ChatGPT Developer Mode settings.

## Usage

- Enable ChatGPT Developer Mode
- Add the app with the MCP URL
- In ChatGPT, invoke the app to see the widget
- Enter your Runflow API key
- Provide 3-10 image URLs (one per line)
- Optionally, set a callback URL (e.g., webhook.site)
- Click "Generate Headshots"
- The widget shows the job ID and confirmation

Results arrive in 1-2 hours via the callback URL.

## Architecture

- **MCP Server** (`src/server.ts`): Handles tool calls, serves the widget HTML
- **Widget** (`public/index.html`): React-free HTML form that calls the tool via `window.openai.callTool`
- **API Integration**: Calls Runflow's generate-headshots endpoint

## Notes

- API key is handled client-side only (not stored on server)
- For MVP, images are provided as URLs; file upload not implemented
- Callback handling is for future phase