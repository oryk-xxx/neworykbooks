"use client";

import React from "react";

export default function BackgroundEffects() {
    return (
        <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none bg-black">
            {/* Void Nebula - Base Gradients */}
            <div className="absolute inset-0 opacity-20">
                <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-[radial-gradient(circle,rgba(0,10,50,0.8),transparent_70%)] blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-[radial-gradient(circle,rgba(40,0,60,0.6),transparent_70%)] blur-[120px]" />
            </div>

            {/* Grid Overlay */}
            <div className="oryk-grid absolute inset-0 opacity-40" />

            {/* Floating Orbs */}
            <div className="oryk-orb w-[400px] h-[400px] bg-accent/5 top-[10%] left-[20%] [--star-delay:0s]" />
            <div className="oryk-orb w-[500px] h-[500px] bg-accent/3 bottom-[15%] right-[10%] [--star-delay:-10s]" />

            {/* Star Field */}
            <div className="absolute inset-0">
                {[...Array(40)].map((_, i) => (
                    <div
                        key={i}
                        className="oryk-star absolute"
                        style={{
                            top: `${Math.random() * 100}%`,
                            left: `${Math.random() * 100}%`,
                            "--star-duration": `${2 + Math.random() * 4}s`,
                            "--star-delay": `${Math.random() * -10}s`,
                        } as React.CSSProperties}
                    />
                ))}
            </div>

            {/* Scanline */}
            <div className="oryk-scanline" />

            {/* Noise Texture Overlay */}
            <div className="absolute inset-0 opacity-[0.02] pointer-events-none mix-blend-overlay">
                <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                    <filter id="noiseFilter">
                        <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
                    </filter>
                    <rect width="100%" height="100%" filter="url(#noiseFilter)" />
                </svg>
            </div>
        </div>
    );
}
