import { useRef, useState, useEffect } from "react";
import apiClient from "../services/apiClient.js";

const MAX_SIZE = 5 * 1024 * 1024;
const ALLOWED = ["image/jpeg", "image/png", "image/webp", "image/gif"];

function describeSize(bytes) {
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function AvatarUploader() {
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  const [uploadedUrl, setUploadedUrl] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");
  const inputRef = useRef(null);
  const dragDepth = useRef(0);

  useEffect(() => {
    if (!file) {
      setPreviewUrl("");
      return undefined;
    }

    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    return () => {
      URL.revokeObjectURL(url);
    };
  }, [file]);

  function selectFile(candidate) {
    setError("");
    setUploadedUrl("");
    setProgress(0);

    if (!candidate) return;
    if (!ALLOWED.includes(candidate.type)) {
      setFile(null);
      setError("Choose a JPEG, PNG, WebP, or GIF image.");
      return;
    }
    if (candidate.size > MAX_SIZE) {
      setFile(null);
      setError("This image is larger than 5 MB. Choose a smaller file.");
      return;
    }
    setFile(candidate);
  }

  function handleDragEnter(event) {
    event.preventDefault();
    dragDepth.current += 1;
    setIsDragging(true);
  }

  function handleDragOver(event) {
    event.preventDefault();
  }

  function handleDragLeave(event) {
    event.preventDefault();
    dragDepth.current -= 1;
    if (dragDepth.current <= 0) {
      dragDepth.current = 0;
      setIsDragging(false);
    }
  }

  function handleDrop(event) {
    event.preventDefault();
    dragDepth.current = 0;
    setIsDragging(false);
    selectFile(event.dataTransfer.files[0]);
  }

  async function upload() {
    if (!file || isUploading) return;

    setError("");
    setIsUploading(true);
    setProgress(0);

    const formData = new FormData();
    formData.append("avatar", file);

    try {
      const response = await apiClient.post("/api/upload", formData, {
        onUploadProgress(event) {
          if (event.total) {
            setProgress(Math.round((event.loaded * 100) / event.total));
          }
        },
      });
      if (typeof response.data?.url !== "string") {
        throw new Error("The server did not return an image URL.");
      }
      setUploadedUrl(new URL(response.data.url, apiClient.defaults.baseURL).href);
      setProgress(100);
    } catch (uploadError) {
      setError(
        uploadError.response?.data?.error ||
          uploadError.message ||
          "The image could not be uploaded.",
      );
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <section className="uploader" aria-label="Avatar image uploader">
      <button
        className={`drop-zone${isDragging ? " dragging" : ""}${file ? " has-file" : ""}`}
        type="button"
        onClick={() => inputRef.current?.click()}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        disabled={isUploading}
        aria-label={file ? `Change image, selected ${file.name}` : "Choose an image to upload"}
      >
        {previewUrl ? (
          <span className="preview-frame">
            <img className="preview" src={previewUrl} alt="Preview of your selected avatar" />
          </span>
        ) : (
          <span className="upload-mark" aria-hidden="true">
            <svg viewBox="0 0 48 48" fill="none">
              <path d="M24 31V8m0 0-8 8m8-8 8 8" />
              <path d="M10 28v11h28V28" />
            </svg>
          </span>
        )}
        <span className="drop-copy">
          <strong>{file ? "Choose a different image" : "Drop your image here"}</strong>
          <span>{file ? `${file.name} | ${describeSize(file.size)}` : "or browse files on your device"}</span>
          <span className="file-guidance">JPEG, PNG, WebP, or GIF · Up to 5 MB</span>
        </span>
        <input
          ref={inputRef}
          type="file"
          accept={ALLOWED.join(",")}
          hidden
          disabled={isUploading}
          onChange={(event) => {
            selectFile(event.target.files[0]);
            event.target.value = "";
          }}
        />
      </button>

      {error && (
        <p className="error" role="alert">
          {error}
        </p>
      )}

      {isUploading && (
        <div className="upload-progress" role="status" aria-live="polite">
          <div className="progress-label">
            <span>Uploading image</span>
            <span>{progress}%</span>
          </div>
          <div
            className="bar"
            role="progressbar"
            aria-label="Upload progress"
            aria-valuemin="0"
            aria-valuemax="100"
            aria-valuenow={progress}
          >
            <div className="fill" style={{ width: `${progress}%` }} />
          </div>
        </div>
      )}

      <div className="upload-actions">
        <button className="upload-button" onClick={upload} disabled={!file || isUploading}>
          {isUploading ? "Uploading..." : "Upload image"}
        </button>
        {!file && <span className="action-hint">Your image stays private until you upload it.</span>}
      </div>

      {uploadedUrl && (
        <div className="success" role="status">
          <span className="success-mark" aria-hidden="true">OK</span>
          <div>
            <strong>Your avatar is ready</strong>
            <a href={uploadedUrl} target="_blank" rel="noreferrer">
              View uploaded image
            </a>
          </div>
        </div>
      )}
    </section>
  );
}
