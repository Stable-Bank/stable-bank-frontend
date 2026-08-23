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
      <body style={{ margin: 0, padding: 0, fontFamily: "system-ui, -apple-system, sans-serif" }}>
        <div
          style={{
            backgroundColor: "#FAFAFC",
            color: "#09090B",
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
                border: "1px solid #fecaca",
                backgroundColor: "#fef2f2",
                padding: "6px 14px",
                marginBottom: "24px",
              }}
            >
              <span
                style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  backgroundColor: "#dc2626",
                }}
              />
              <span style={{ fontSize: "13px", fontWeight: "600", color: "#b91c1c", fontFamily: "monospace" }}>Critical Error</span>
            </div>
            <h1
              style={{
                fontSize: "48px",
                fontWeight: "800",
                marginBottom: "16px",
                lineHeight: "1.2",
                color: "#09090B",
              }}
            >
              System <span style={{ color: "#4649d6" }}>Error</span>
            </h1>
            <p
              style={{
                fontSize: "18px",
                color: "#52525b",
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
                  color: "#71717a",
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
                  color: "#ffffff",
                  border: "none",
                  borderRadius: "40px",
                  padding: "12px 32px",
                  fontSize: "16px",
                  fontWeight: "700",
                  cursor: "pointer",
                  boxShadow: "0 4px 12px rgba(70, 73, 214, 0.25)",
                }}
              >
                Try Again
              </button>
              <button
                onClick={() => window.location.href = "/"}
                style={{
                  backgroundColor: "#ffffff",
                  color: "#18181b",
                  border: "1px solid #d4d4d8",
                  borderRadius: "40px",
                  padding: "12px 32px",
                  fontSize: "16px",
                  fontWeight: "600",
                  cursor: "pointer",
                  boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
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
