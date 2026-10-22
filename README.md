# Threadbase - Avatar Upload

A React avatar uploader with drag-and-drop, client-side image checks, a local
preview, and upload progress. The Express server accepts the `avatar` form
field and returns a URL for the uploaded image.

## Run locally

```bash
# Terminal 1 - upload server
cd server && cp .env.example .env && npm install && npm start

# Terminal 2 - React app
cd client && cp .env.development.example .env.development && npm install && npm run dev
```

The server runs at `http://localhost:3001`. Vite prints the client URL when it
starts.

## Upload behavior

- Drop an image onto the upload area or choose one from your device.
- JPEG, PNG, WebP, and GIF images up to 5 MB are accepted.
- A local preview is shown before upload. The preview URL is released when the
  selected image changes or the page is closed.
- Uploading sends the image as multipart form data in the `avatar` field and
  displays transfer progress. The server's response includes a link to the
  uploaded image.
- Unsupported file types and oversized images are rejected before upload.
