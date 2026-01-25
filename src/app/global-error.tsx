"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0, fontFamily: "system-ui, sans-serif" }}>
        <div
          style={{
            backgroundColor: "#030204",
            color: "#fef8f1",
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
          }}
        >
          <div
            style={{
              maxWidth: "600px",
              width: "100%",
              textAlign: "center",
            }}
          >
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                borderRadius: "24px",
                border: "1px solid #ef4444",
                padding: "8px 12px",
                marginBottom: "24px",
              }}
            >
              <span
                style={{
                  width: "9px",
                  height: "9px",
                  borderRadius: "50%",
                  backgroundColor: "#ef4444",
                }}
              />
              <span style={{ fontSize: "14px" }}>Critical Error</span>
            </div>
            <h1
              style={{
                fontSize: "48px",
                fontWeight: "800",
                marginBottom: "16px",
                lineHeight: "1.2",
              }}
            >
              System <span style={{ color: "#4649d6" }}>Error</span>
            </h1>
            <p
              style={{
                fontSize: "18px",
                color: "#999999",
                marginBottom: "32px",
                lineHeight: "1.6",
              }}
            >
              A critical error occurred. Please refresh the page or contact
              support if the problem persists.
            </p>
            {error.digest && (
              <p
                style={{
                  fontSize: "12px",
                  color: "#999999",
                  fontFamily: "monospace",
                  marginBottom: "32px",
                }}
              >
                Error ID: {error.digest}
              </p>
            )}
            <div
              style={{
                display: "flex",
                gap: "16px",
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
              <button
                onClick={reset}
                style={{
                  backgroundColor: "#4649d6",
                  color: "#fef8f1",
                  border: "none",
                  borderRadius: "40px",
                  padding: "12px 32px",
                  fontSize: "18px",
                  fontWeight: "600",
                  cursor: "pointer",
                }}
              >
                Try Again
              </button>
              <button
                onClick={() => window.location.href = "/"}
                style={{
                  backgroundColor: "transparent",
                  color: "#fef8f1",
                  border: "1.5px solid #4649d6",
                  borderRadius: "40px",
                  padding: "12px 32px",
                  fontSize: "18px",
                  fontWeight: "600",
                  cursor: "pointer",
                }}
              >
                Go Home
              </button>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
