import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import express from "express";
import cors from "cors";
let savedApiKey = "";
let savedCallbackUrl = "https://webhook.site/test";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.resolve(__dirname, "..", "public");
const widgetHtml = fs.readFileSync(path.join(publicDir, "index.html"), "utf-8");
const app = express();
app.use(express.json());
app.use(cors({
    origin: ['https://chatgpt.com', 'https://chat.openai.com'],
    credentials: true
}));
const server = new McpServer({
    name: "headshots-generator",
    version: "1.0.0",
});
const scoreImagesSchema = z.object({
    apiKey: z.string().optional(),
    images: z.array(z.string()),
});
const generateHeadshotsSchema = z.object({
    apiKey: z.string().optional(),
    images: z.array(z.string()),
    callbackUrl: z.string().optional(),
});
// Register the widget as a resource
server.registerResource("headshots-widget", "ui://widget/headshots.html", {}, async () => ({
    contents: [{
            uri: "ui://widget/headshots.html",
            mimeType: "text/html+skybridge",
            text: widgetHtml,
            _meta: { "openai/widgetPrefersBorder": true, "openai/widgetCSP": { "connect_domains": ["https://betterpic-headshots-production.up.railway.app"], "resource_domains": ["https://persistent.oaistatic.com"] } }
        }]
}));
// Set up the server with HTTP transport
const port = Number(process.env.PORT ?? 8000);
// Proxy endpoint for widget to call Runflow without CORS issues
app.post('/proxy/score', express.raw({ type: '*/*', limit: '20mb' }), async (req, res) => {
    try {
        const contentType = (req.headers['content-type'] || '');
        if (contentType.includes('multipart/form-data')) {
            const response = await fetch('https://api.runflow.io/api/v1/images/score', {
                method: 'POST',
                headers: { 'x-api-key': savedApiKey, 'content-type': contentType },
                body: req.body
            });
            if (!response.ok) {
                const t = await response.text();
                return res.status(response.status).json({ error: t });
            }
            return res.json(await response.json());
        }
        const { image_base64, mime_type } = JSON.parse(req.body.toString());
        if (!savedApiKey) {
            return res.status(401).json({ error: 'No API key. Open widget settings.' });
        }
        const base64Data = image_base64.replace(/^data:[^;]+;base64,/, '');
        const buffer = Buffer.from(base64Data, 'base64');
        const FormData = (await import('form-data')).default;
        const form = new FormData();
        form.append('image', buffer, { filename: 'photo.jpg', contentType: mime_type || 'image/jpeg' });
        const response = await fetch('https://api.runflow.io/api/v1/images/score', {
            method: 'POST',
            headers: { 'x-api-key': savedApiKey, ...form.getHeaders() },
            body: form
        });
        if (!response.ok) {
            const text = await response.text();
            return res.status(response.status).json({ error: text });
        }
        const data = await response.json();
        res.json(data);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
app.post('/mcp', async (req, res) => {
    const { jsonrpc, method, params = {}, id } = req.body;
    if (jsonrpc !== '2.0') {
        return res.status(400).json({ jsonrpc: '2.0', error: { code: -32600, message: 'Invalid Request' }, id });
    }
    // Handle notifications silently
    if (method.startsWith('notifications/')) {
        return res.status(200).end();
    }
    switch (method) {
        case 'initialize':
            res.json({
                jsonrpc: '2.0',
                id,
                result: {
                    protocolVersion: '2025-06-18',
                    capabilities: { tools: { listChanged: false }, resources: { listChanged: false } },
                    serverInfo: { name: 'headshots-generator', version: '1.0.0' }
                }
            });
            break;
        case 'initialized':
            res.status(200).end();
            break;
        case 'tools/list':
            res.json({
                jsonrpc: '2.0',
                id,
                result: {
                    tools: [
                        {
                            name: "score-images",
                            description: "Automatically score the quality of portrait photos shared in this conversation. Call this immediately whenever the user uploads or drops images into the chat. Do not wait to be asked.",
                            inputSchema: scoreImagesSchema,
                            _meta: {
                                "openai/outputTemplate": "ui://widget/headshots.html",
                                "openai/widgetCSP": { "connect_domains": ["https://betterpic-headshots-production.up.railway.app"], "resource_domains": ["https://persistent.oaistatic.com"] },
                                "openai/toolInvocation/invoking": "Scoring images",
                                "openai/toolInvocation/invoked": "Images scored",
                                "openai/widgetAccessible": true,
                            },
                        },
                        {
                            name: "generate-headshots",
                            description: "Generate 60 AI professional headshots from scored portrait photos. Only call this when the user explicitly clicks Generate in the widget.",
                            inputSchema: generateHeadshotsSchema,
                            _meta: {
                                "openai/outputTemplate": "ui://widget/headshots.html",
                                "openai/toolInvocation/invoking": "Generating headshots",
                                "openai/toolInvocation/invoked": "Headshots job submitted",
                                "openai/widgetAccessible": true,
                            },
                        },
                        {
                            name: "save-settings",
                            description: "Save the Runflow API key and callback URL. The widget calls this automatically when the user enters their API key in settings. Never ask the user to call this manually.",
                            inputSchema: { type: "object", properties: { apiKey: { type: "string" }, callbackUrl: { type: "string" } }, required: ["apiKey"] },
                            _meta: { "openai/widgetAccessible": true }
                        }
                    ]
                }
            });
            break;
        case 'tools/call':
            if (params.name === 'score-images') {
                try {
                    const args = scoreImagesSchema.parse(params.arguments || {});
                    const { apiKey, images } = args;
                    const key = apiKey || savedApiKey;
                    if (!key)
                        throw new Error("No API key. Please open widget settings (⚙️) and enter your Runflow API key.");
                    const results = [];
                    // Score each image
                    for (const imageUrl of images) {
                        const response = await fetch('https://api.runflow.io/api/v1/images/score', {
                            method: 'POST',
                            headers: {
                                'x-api-key': key,
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                image_url: imageUrl,
                            }),
                        });
                        if (!response.ok) {
                            throw new Error(`API error for ${imageUrl}: ${response.status}`);
                        }
                        const data = await response.json();
                        results.push({
                            url: imageUrl,
                            quality_score: data.quality_score,
                            brightness: data.brightness,
                            sharpness: data.sharpness,
                            tips: data.tips,
                        });
                    }
                    res.json({
                        jsonrpc: '2.0',
                        id,
                        result: {
                            content: [
                                {
                                    type: "text",
                                    text: `Scored ${results.length} images. Average quality: ${(results.reduce((sum, r) => sum + r.quality_score, 0) / results.length).toFixed(2)}`,
                                },
                            ],
                            structuredContent: {
                                results,
                            },
                            _meta: {
                                "openai/outputTemplate": "ui://widget/headshots.html",
                            },
                        }
                    });
                }
                catch (error) {
                    const message = error instanceof Error ? error.message : String(error);
                    res.json({
                        jsonrpc: '2.0',
                        id,
                        result: {
                            content: [
                                {
                                    type: "text",
                                    text: `Error scoring images: ${message}`,
                                },
                            ],
                            structuredContent: {
                                error: message,
                                results: [],
                            },
                            _meta: {
                                "openai/outputTemplate": "ui://widget/headshots.html",
                            },
                        }
                    });
                }
            }
            else if (params.name === 'generate-headshots') {
                try {
                    const args = generateHeadshotsSchema.parse(params.arguments || {});
                    const { apiKey, images, callbackUrl } = args;
                    const key = apiKey || savedApiKey;
                    const cbUrl = callbackUrl || savedCallbackUrl;
                    if (!key)
                        throw new Error("No API key. Please open widget settings.");
                    const response = await fetch('https://api.runflow.io/api/v1/images/generate-headshots', {
                        method: 'POST',
                        headers: {
                            'x-api-key': key,
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            input_images: images,
                            callback_url: cbUrl,
                        }),
                    });
                    if (!response.ok) {
                        throw new Error(`API error: ${response.status}`);
                    }
                    const data = await response.json();
                    const headshotsId = data.headshots_id;
                    res.json({
                        jsonrpc: '2.0',
                        id,
                        result: {
                            content: [
                                {
                                    type: "text",
                                    text: `Job submitted successfully! Headshots ID: ${headshotsId}. 60 headshots will be ready in approximately 2 hours.`,
                                },
                            ],
                            structuredContent: {
                                headshots_id: headshotsId,
                                status: "processing",
                            },
                            _meta: {
                                "openai/outputTemplate": "ui://widget/headshots.html",
                            },
                        }
                    });
                }
                catch (error) {
                    const message = error instanceof Error ? error.message : String(error);
                    res.json({
                        jsonrpc: '2.0',
                        id,
                        result: {
                            content: [
                                {
                                    type: "text",
                                    text: `Error submitting job: ${message}`,
                                },
                            ],
                            structuredContent: {
                                error: message,
                                status: "error",
                            },
                            _meta: {
                                "openai/outputTemplate": "ui://widget/headshots.html",
                            },
                        }
                    });
                }
            }
            else if (params.name === 'save-settings') {
                try {
                    const { apiKey, callbackUrl } = params.arguments || {};
                    if (apiKey)
                        savedApiKey = apiKey;
                    if (callbackUrl)
                        savedCallbackUrl = callbackUrl;
                    res.json({ jsonrpc: '2.0', id, result: { content: [{ type: 'text', text: 'Settings saved.' }], structuredContent: { success: true } } });
                }
                catch (err) {
                    res.json({ jsonrpc: '2.0', id, result: { content: [{ type: 'text', text: err.message }], isError: true } });
                }
            }
            else {
                res.status(400).json({ jsonrpc: '2.0', error: { code: -32601, message: 'Method not found' }, id });
            }
            break;
        case 'resources/read': {
            const uri = params?.uri;
            if (uri === 'ui://widget/headshots.html') {
                return res.json({
                    jsonrpc: '2.0',
                    id,
                    result: {
                        contents: [{ uri, mimeType: 'text/html+skybridge', text: widgetHtml, _meta: { "openai/widgetPrefersBorder": true, "openai/widgetCSP": { "connect_domains": ["https://betterpic-headshots-production.up.railway.app"], "resource_domains": ["https://persistent.oaistatic.com"] } } }]
                    }
                });
            }
            return res.status(400).json({ jsonrpc: '2.0', error: { code: -32601, message: 'Resource not found' }, id });
        }
        default:
            res.status(400).json({ jsonrpc: '2.0', error: { code: -32601, message: 'Method not found' }, id });
    }
});
app.listen(port, () => {
    console.log(`Headshots MCP server listening on http://localhost:${port}`);
    console.log(`MCP endpoint: POST http://localhost:${port}/mcp`);
});
