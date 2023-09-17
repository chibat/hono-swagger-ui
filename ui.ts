import { Hono } from "npm:hono@3.6.3";
import { html } from "hono/html";

export function enableUi(
  param: { app: Hono; uiPath: string; docPath: string },
) {
  param.app.get(param.uiPath, (c) => {
    const url = new URL(c.req.url);
    const specUrl = url.protocol + "//" + url.host + param.docPath;
    const resourceBase = "https://unpkg.com/swagger-ui-dist@5.7.1/";
    return c.html(html`
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <title>Swagger UI</title>
        <link rel="stylesheet" type="text/css" href="${resourceBase}/swagger-ui.css" />
        <link rel="icon" type="image/png" href="${resourceBase}/favicon-32x32.png" sizes="32x32" />
        <link rel="icon" type="image/png" href="${resourceBase}/favicon-16x16.png" sizes="16x16" />
        <style>
          html
          {
            box-sizing: border-box;
            overflow: -moz-scrollbars-vertical;
            overflow-y: scroll;
          }
          *,
          *:before,
          *:after
          {
            box-sizing: inherit;
          }
          body
          {
            margin:0;
            background: #fafafa;
          }
        </style>
      </head>
      <body>
        <div id="swagger-ui"></div>
        <script src="${resourceBase}/swagger-ui-bundle.js" charset="UTF-8"> </script>
        <script src="${resourceBase}/swagger-ui-standalone-preset.js" charset="UTF-8"> </script>
        <script>
        window.onload = function() {
          const ui = SwaggerUIBundle({
            url: "${specUrl}",
            dom_id: '#swagger-ui',
            deepLinking: true,
            presets: [
              SwaggerUIBundle.presets.apis,
              SwaggerUIStandalonePreset
            ],
            plugins: [
              SwaggerUIBundle.plugins.DownloadUrl
            ],
            layout: "StandaloneLayout"
          });
          window.ui = ui;
        };
      </script>
      <style>
        .swagger-ui .topbar .download-url-wrapper { display: none } undefined
      </style>
      </body>
    </html>
    `);
  });
}
