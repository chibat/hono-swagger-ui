import { html } from "hono/html";
import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";

const app = new OpenAPIHono();

const ParamsSchema = z.object({
  id: z
    .string()
    .min(3)
    .openapi({
      param: {
        name: "id",
        in: "path",
      },
      example: "1212121",
    }),
});

const UserSchema = z
  .object({
    id: z.string().openapi({
      example: "123",
    }),
    name: z.string().openapi({
      example: "John Doe",
    }),
    age: z.number().openapi({
      example: 42,
    }),
  })
  .openapi("User");

const route = createRoute({
  method: "get",
  path: "/users/{id}",
  request: {
    params: ParamsSchema,
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: UserSchema,
        },
      },
      description: "Retrieve the user",
    },
  },
});

app.openapi(route, (c) => {
  const { id } = c.req.valid("param");
  return c.jsonT({
    id,
    age: 20,
    name: "Ultra-man",
  });
});

const SPEC_PATH = "/doc";

app.doc(SPEC_PATH, {
  openapi: "3.0.0",
  info: {
    version: "1.0.0",
    title: "My API",
  },
});

app.get("/swagger-ui", (c) => {
  const url = new URL(c.req.url);
  const specUrl = url.protocol + "//" + url.host + SPEC_PATH;
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

Deno.serve(app.fetch);
