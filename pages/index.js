// pages/index.js
import dynamic from "next/dynamic";
import "mapbox-gl/dist/mapbox-gl.css";
import "@/styles/globals.css";

const HuMap = dynamic(() => import("@/components/HuMap"), { ssr: false });

export default function Home() {
  return <HuMap />;
}
