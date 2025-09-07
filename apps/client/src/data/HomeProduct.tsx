"use client";
import React from "react";
import { HeroParallax } from "@/src/components/ui/hero-parallax";

export function HeroParallaxDemo() {
 return <HeroParallax products={products} />;
}

// Array of your local images
const localImages = [
 "/images/map.png",
 "/images/wallet.png",
 "/images/dashboard.png",
 "/images/chats.png",
 "/images/friends.png",
];

// Function to get random image
const getRandomImage = () => {
 return localImages[Math.floor(Math.random() * localImages.length)];
};

export const products = [
 {
   title: "Moonbeam",
   link: '',
   thumbnail: getRandomImage(),
 },
 {
   title: "Cursor",
   link: "",
   thumbnail: getRandomImage(),
 },
 {
   title: "Rogue",
   link: "",
   thumbnail: getRandomImage(),
 },
 {
   title: "Editorially",
   link: "",
   thumbnail: getRandomImage(),
 },
 {
   title: "Editrix AI",
   link: "",
   thumbnail: getRandomImage(),
 },
 {
   title: "Pixel Perfect",
   link: "",
   thumbnail: getRandomImage(),
 },
 {
   title: "Algochurn",
   link: "",
   thumbnail: getRandomImage(),
 },
 {
   title: "Aceternity UI",
   link: "",
   thumbnail: getRandomImage(),
 },
 {
   title: "Tailwind Master Kit",
   link: "",
   thumbnail: getRandomImage(),
 },
 {
   title: "SmartBridge",
   link: "",
   thumbnail: getRandomImage(),
 },
 {
   title: "Renderwork Studio",
   link: "",
   thumbnail: getRandomImage(),
 },
 {
   title: "Creme Digital",
   link: "",
   thumbnail: getRandomImage(),
 },
 {
   title: "Golden Bells Academy",
   link: "",
   thumbnail: getRandomImage(),
 },
 {
   title: "Invoker Labs",
   link: "",
   thumbnail: getRandomImage(),
 },
 {
   title: "E Free Invoice",
   link: "",
   thumbnail: getRandomImage(),
 },
];