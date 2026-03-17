## FEATURE:
Build a ChatGPT App using OpenAI's Apps SDK that lets users generate professional 
AI headshots via the Runflow API directly inside the ChatGPT interface.

A user can:
- Open the app inside ChatGPT via the + menu
- See a widget/form where they enter their Runflow API key (stored for the session)
- Upload 3–10 portrait photos directly in the widget
- Submit the job to the Runflow API and receive a headshots_id
- See a confirmation message with the job ID and a note that results arrive in 1–2 hours
- (Stretch) Provide a callback/webhook URL and see the 60 generated headshots displayed 
  in the widget when the job completes

## EXAMPLES & DOCUMENTATION:
- OpenAI Apps SDK examples repo: https://github.com/openai/openai-apps-sdk-examples
  (clone and reference the pizzaz example for MCP server + frontend widget pattern)
- ChatGPT app setup guide: https://dev.to/lingodotdev/how-to-create-a-chatgpt-app-with-openais-apps-sdk-1213
- Runflow generate-headshots API: https://runflow.io/docs/generate-headshots
  (POST /api/v1/images/generate-headshots, async, returns headshots_id immediately)

## OTHER CONSIDERATIONS:
- The Runflow API is ASYNC — it returns a headshots_id immediately, and sends 
  results to a callback_url 1-2 hours later. The widget must reflect this clearly.
  Don't try to poll or wait for results in the initial build.
- API key must NEVER be hardcoded — store it in the widget session only, 
  never in code or committed files.
- The callback_url is required by the Runflow API. For local MVP, use a free 
  webhook inspector like https://webhook.site to catch and display the callback.
- ChatGPT Apps require an MCP server exposed via public HTTPS URL. 
  For local dev, use ngrok to tunnel localhost.
- The app has two parts: (1) MCP server (Node.js, handles tool calls) and 
  (2) frontend widget (React, renders inside ChatGPT).
- Image URLs in the webhook response expire after 24 hours — note this in the UI.
- For local MVP: skip the webhook display. Just submit the job and show the 
  headshots_id confirmation. Webhook handling is Phase 2.

## SUCCESS LOOKS LIKE:
1. Run `pnpm dev` and `pnpm start` — both servers start without errors
2. Tunnel MCP server with ngrok, register app in ChatGPT Developer Mode
3. Open ChatGPT, invoke the app, see the widget with API key input + image upload
4. Enter a Runflow API key, upload 3 photos, click Submit
5. Widget shows: "Job submitted ✓ — headshots_id: [uuid]. Results arrive in ~2 hours."
