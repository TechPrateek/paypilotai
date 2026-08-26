"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  RotateCcw,
  Sparkles,
  Layers,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Node {
  id: string;
  type: string;
  position: { x: number; y: number };
  data: {
    label: string;
    type: string;
    risk: string;
    entityId: string;
  };
}

interface Edge {
  id: string;
  source: string;
  target: string;
  label: string;
  animated?: boolean;
}

interface InteractiveGraphCanvasProps {
  nodes: Node[];
  edges: Edge[];
  selectedNode?: any;
  onSelectNode: (node: Node) => void;
  height?: number;
}

export function InteractiveGraphCanvas({
  nodes = [],
  edges = [],
  selectedNode,
  onSelectNode,
  height = 480,
}: InteractiveGraphCanvasProps) {
  const [scale, setScale] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [hoveredNode, setHoveredNode] = useState<Node | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleZoomIn = () => setScale((s) => Math.min(s + 0.2, 2.5));
  const handleZoomOut = () => setScale((s) => Math.max(s - 0.2, 0.4));
  const handleReset = () => {
    setScale(1);
    setPan({ x: 0, y: 0 });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.target === containerRef.current || (e.target as HTMLElement).tagName === "svg" || (e.target as HTMLElement).tagName === "rect") {
      setIsDragging(true);
      setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPan({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => setIsDragging(false);

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const zoomFactor = e.deltaY < 0 ? 1.1 : 0.9;
    setScale((s) => Math.min(Math.max(s * zoomFactor, 0.4), 2.5));
  };

  // Find connected node IDs for highlight
  const activeNodeId = hoveredNode?.id || selectedNode?.id;
  const connectedNodeIds = new Set<string>();
  if (activeNodeId) {
    connectedNodeIds.add(activeNodeId);
    edges.forEach((e) => {
      if (e.source === activeNodeId) connectedNodeIds.add(e.target);
      if (e.target === activeNodeId) connectedNodeIds.add(e.source);
    });
  }

  return (
    <div
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onWheel={handleWheel}
      className={`relative w-full rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden select-none cursor-${
        isDragging ? "grabbing" : "grab"
      }`}
      style={{ minHeight: `${height}px` }}
    >
      {/* Background Tech Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:20px_20px] opacity-40 pointer-events-none" />

      {/* Floating Zoom & Canvas Controls */}
      <div className="absolute top-3 right-3 z-20 flex items-center gap-1.5 bg-slate-900/90 backdrop-blur-md p-1.5 rounded-xl border border-slate-800 shadow-md">
        <Button
          size="icon"
          variant="ghost"
          onClick={handleZoomIn}
          className="h-7 w-7 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg"
          title="Zoom In (+)"
        >
          <ZoomIn className="h-3.5 w-3.5" />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          onClick={handleZoomOut}
          className="h-7 w-7 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg"
          title="Zoom Out (-)"
        >
          <ZoomOut className="h-3.5 w-3.5" />
        </Button>
        <span className="text-[10px] font-mono text-slate-400 px-1 font-bold">
          {Math.round(scale * 100)}%
        </span>
        <Button
          size="icon"
          variant="ghost"
          onClick={handleReset}
          className="h-7 w-7 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg"
          title="Reset View / Fit (100%)"
        >
          <Maximize2 className="h-3.5 w-3.5" />
        </Button>
      </div>

      {/* Active Mode Pill */}
      <div className="absolute top-3 left-3 z-20 flex items-center gap-2 bg-slate-900/90 backdrop-blur-md px-2.5 py-1 rounded-xl border border-slate-800 text-[10px] font-mono text-slate-300">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
        <span>Graph Live • Interactive Pan & Zoom</span>
      </div>

      {/* SVG Canvas with Animated Graph */}
      <svg
        viewBox="0 0 800 480"
        className="w-full h-full"
        style={{ minHeight: `${height}px` }}
      >
        <defs>
          {/* Animated Edge Gradient */}
          <linearGradient id="edgeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10B981" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.8" />
          </linearGradient>

          {/* Glow Filter for High Risk */}
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        <g
          transform={`translate(${pan.x}, ${pan.y}) scale(${scale})`}
          style={{ transition: isDragging ? "none" : "transform 0.15s ease-out" }}
        >
          {/* 1. Render Edges with Flow Animation */}
          {edges.map((edge) => {
            const sNode = nodes.find((n) => n.id === edge.source);
            const tNode = nodes.find((n) => n.id === edge.target);
            if (!sNode || !tNode) return null;

            const isConnectedToActive =
              activeNodeId && (edge.source === activeNodeId || edge.target === activeNodeId);
            const isDimmed = activeNodeId && !isConnectedToActive;

            return (
              <g key={edge.id} className="transition-opacity duration-300">
                <line
                  x1={sNode.position.x}
                  y1={sNode.position.y + 20}
                  x2={tNode.position.x}
                  y2={tNode.position.y + 20}
                  stroke={isConnectedToActive ? "#10B981" : isDimmed ? "#334155" : "#475569"}
                  strokeWidth={isConnectedToActive ? 2.5 : 1.2}
                  strokeDasharray={edge.animated ? "6 3" : "none"}
                  className={edge.animated ? "animate-[dash_1.5s_linear_infinite]" : ""}
                  opacity={isDimmed ? 0.25 : 0.85}
                />
              </g>
            );
          })}

          {/* 2. Render Nodes */}
          {nodes.map((node) => {
            const isSel = selectedNode?.id === node.id;
            const isHov = hoveredNode?.id === node.id;
            const isConnected = !activeNodeId || connectedNodeIds.has(node.id);

            const isDev = node.type === "device";
            const isIP = node.type === "ip";
            const isCust = node.type === "customer";
            const isPay = node.type === "payment";

            let fill = "#1E293B";
            let stroke = "#64748B";

            if (isDev) {
              fill = isSel || isHov ? "#DC2626" : "#7F1D1D";
              stroke = "#EF4444";
            } else if (isIP) {
              fill = isSel || isHov ? "#7C3AED" : "#4C1D95";
              stroke = "#A855F7";
            } else if (isCust) {
              fill = isSel || isHov ? "#2563EB" : "#1E3A8A";
              stroke = "#3B82F6";
            } else if (isPay) {
              fill = isSel || isHov ? "#D97706" : "#78350F";
              stroke = "#F59E0B";
            }

            return (
              <g
                key={node.id}
                onClick={() => onSelectNode(node)}
                onMouseEnter={() => setHoveredNode(node)}
                onMouseLeave={() => setHoveredNode(null)}
                className="cursor-pointer transition-all duration-200"
                opacity={isConnected ? 1 : 0.25}
              >
                {/* Glowing Pulsing Outer Ring for Critical Nodes */}
                {(isDev || isIP) && (
                  <circle
                    cx={node.position.x}
                    cy={node.position.y + 20}
                    r={isDev ? "32" : "28"}
                    fill="none"
                    stroke={stroke}
                    strokeWidth="1.5"
                    className="animate-ping opacity-25"
                  />
                )}

                {/* Node Circle */}
                <circle
                  cx={node.position.x}
                  cy={node.position.y + 20}
                  r={isDev ? "24" : "19"}
                  fill={fill}
                  stroke={isSel ? "#10B981" : stroke}
                  strokeWidth={isSel ? 3.5 : isHov ? 2.5 : 1.8}
                  filter={isSel || isHov ? "url(#glow)" : undefined}
                />

                {/* Node Icon Emoji */}
                <text
                  x={node.position.x}
                  y={node.position.y + 25}
                  fill="#FFFFFF"
                  fontSize={isDev ? "11" : "9"}
                  fontWeight="bold"
                  textAnchor="middle"
                  className="pointer-events-none select-none"
                >
                  {isDev ? "📱" : isIP ? "🌐" : isCust ? "👤" : "💳"}
                </text>

                {/* Node Label */}
                <text
                  x={node.position.x}
                  y={node.position.y + (isDev ? 56 : 48)}
                  fill={isSel ? "#10B981" : isHov ? "#FFFFFF" : "#E2E8F0"}
                  fontSize="9"
                  fontWeight={isSel || isHov ? "bold" : "500"}
                  textAnchor="middle"
                  fontFamily="monospace"
                  className="pointer-events-none select-none"
                >
                  {node.data?.label}
                </text>
              </g>
            );
          })}
        </g>
      </svg>

      {/* Bottom Legend */}
      <div className="absolute bottom-2 left-4 right-4 z-20 flex items-center justify-between text-[10px] text-slate-400 font-mono bg-slate-900/70 backdrop-blur-xs px-3 py-1 rounded-xl border border-slate-800/80">
        <div className="flex items-center gap-3">
          <span>📱 Hardware Device</span>
          <span>🌐 Network IP</span>
          <span>👤 Customer Account</span>
          <span>💳 Payment Card</span>
        </div>
        <span className="hidden sm:inline text-slate-500">Scroll to Zoom • Drag to Pan</span>
      </div>
    </div>
  );
}
