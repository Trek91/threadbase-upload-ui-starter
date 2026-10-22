import AvatarUploader from "./components/AvatarUploader.jsx";

export default function App() {
  return (
    <main className="page-shell">
      <header className="site-header">
        <a className="wordmark" href="/" aria-label="Threadbase home">
          <span className="wordmark-icon" aria-hidden="true">
            <span />
            <span />
            <span />
          </span>
          threadbase
        </a>
        <span className="header-note">Your profile</span>
      </header>

      <div className="content-layout">
        <section className="intro">
          <p className="eyebrow">A small personal touch</p>
          <h1>Put a face to your profile.</h1>
          <p className="intro-copy">
            Add a photo so your people know it&apos;s you. Choose an image that
            feels like you; you can always change it later.
          </p>
          <div className="privacy-note">
            <span className="privacy-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M6 10V7a6 6 0 0 1 12 0v3" />
                <rect x="4" y="10" width="16" height="11" rx="2" />
                <circle cx="12" cy="15" r="1.5" />
              </svg>
            </span>
            <p>
              <strong>Your image, your call.</strong>
              <span>It won&apos;t leave your device until you upload it.</span>
            </p>
          </div>
        </section>

        <section className="upload-panel" aria-labelledby="upload-heading">
          <div className="panel-heading">
            <div>
              <h2 id="upload-heading">Profile photo</h2>
              <p>Make it easy for others to recognize you.</p>
            </div>
            <span className="photo-badge" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="8" r="3.5" />
                <path d="M5 20c.5-3.8 3.1-6 7-6s6.5 2.2 7 6" />
              </svg>
            </span>
          </div>
          <AvatarUploader />
        </section>
      </div>

      <footer className="page-footer">
        <span>Threadbase</span>
        <span>Good conversations start with a familiar face.</span>
      </footer>
    </main>
  );
}
