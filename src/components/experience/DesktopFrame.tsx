import React, { useState, useEffect, type ReactNode } from "react";
import { createPortal } from "react-dom";

interface FrameProps {
  children: ReactNode;
  title?: string;
  width?: number;
  height?: number;
  className?: string;
}

// Global cache for style clones to prevent DOM querying/thrashing on each slide transition
let cachedStyleNodes: Node[] | null = null;

function getCachedStyleNodes(): Node[] {
  if (cachedStyleNodes !== null) {
    return cachedStyleNodes;
  }
  const nodes: Node[] = [];
  const parentStyles = document.querySelectorAll("style, link[rel='stylesheet']");
  parentStyles.forEach((style) => {
    nodes.push(style.cloneNode(true));
  });
  cachedStyleNodes = nodes;
  return nodes;
}

export const DesktopFrame = React.memo(function DesktopFrame({
  children,
  title = "Desktop Preview",
  width = 1280,
  height = 800,
  className = "",
}: FrameProps) {
  const [contentRef, setContentRef] = useState<HTMLIFrameElement | null>(null);
  const mountNode = contentRef?.contentWindow?.document?.body;

  useEffect(() => {
    if (!contentRef) return;
    const doc = contentRef.contentWindow?.document;
    if (!doc) return;

    // Apply cached styles to prevent layout thrashing
    const head = doc.head;
    const styles = getCachedStyleNodes();
    
    // Batch style injection
    const fragment = doc.createDocumentFragment();
    styles.forEach((node) => {
      fragment.appendChild(node.cloneNode(true));
    });
    head.appendChild(fragment);

    // Apply body layout parameters
    if (doc.body) {
      doc.body.style.margin = "0";
      doc.body.style.padding = "0";
      doc.body.style.background = "transparent";
      doc.body.style.overflow = "hidden";
      doc.body.style.width = `${width}px`;
      doc.body.style.height = `${height}px`;
    }
  }, [contentRef, width, height]);

  return (
    <iframe
      ref={setContentRef}
      title={title}
      style={{
        width: `${width}px`,
        height: `${height}px`,
        border: "none",
        background: "transparent",
        overflow: "hidden",
        pointerEvents: "none",
      }}
      className={className}
    >
      {mountNode && createPortal(children, mountNode)}
    </iframe>
  );
});
