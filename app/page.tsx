"use client";
import Image from "next/image";
import downloadImage from "./assets/download.jpg";
import { useState } from "react";

export default function Home() {
  const [progress, setProgress] = useState<number>(0);
  const imageUrl =
    "https://images.unsplash.com/photo-1712828816586-32503ef619f0?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";
  const handleDownload = async () => {
    const res = await fetch(
      "https://videos.pexels.com/video-files/16879171/16879171-hd_1080_1920_30fps.mp4"
    );

    if (!res.body) return;
    const contentLegth = res.headers.get("Content-Length");
    const totalLength =
      typeof contentLegth === "string" && parseInt(contentLegth);

    const reader = res.body.getReader();

    const chunks = [];
    let recievedLength = 0;
    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        console.log("done", done);
        break;
      }
      recievedLength += value.length;
      if (typeof totalLength === "number") {
        const step = (recievedLength / totalLength) * 100;
        setProgress(step);
      }
      chunks.push(value);
    }
    const blob = new Blob(chunks);
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "file.mp4";

    const handleOnDownload = () => {
      setTimeout(() => {
        URL.revokeObjectURL(url);
        a.removeEventListener("click", handleOnDownload);
      }, 150);
    };
    a.addEventListener("click", handleOnDownload, false);

    a.click();
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Image width={600} src={imageUrl} alt="" height={100} />

      <div className="h-[40px] border border-black rounded-[50px] w-[600px] my-2">
        <div
          className={`bg-blue-500 h-[39px] rounded-[50px]`}
          style={{
            width: progress === 100 ? "100%" : `${progress}%`,
          }}
        ></div>
      </div>
      <p className="text-black">{progress.toFixed()} complete</p>

      <button
        onClick={handleDownload}
        className="h-[40px] w-[200px] bg-blue-200 border rounded-md text-black"
      >
        Download
      </button>
    </main>
  );
}
