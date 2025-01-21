import React, { useState } from "react";
import { MdContentCopy } from "react-icons/md";

const App = () => {
  const [longUrl, setLongUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [copyMessage, setCopyMessage] = useState("");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!longUrl.trim()) {
      alert("Please enter a valid URL.");
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:5000/", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({ long_url: longUrl }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to shorten the URL");
      }

      const data = await response.json();
      setShortUrl(data.short_url);
      setCopyMessage(""); // Reset copy message
    } catch (error: any) {
      console.error("Error:", error.message);
      alert(`An error occurred: ${error.message}`);
    }
  };

  const handleCopy = () => {
    if (shortUrl) {
      navigator.clipboard.writeText(shortUrl).then(() => {
        setCopyMessage("Copied to clipboard!");
        setTimeout(() => setCopyMessage(""), 2000); // Clear message after 2 seconds
      });
    }
  };

  return (
    <div className="w-full min-h-screen flex flex-col items-center gap-20 py-10 px-20 text-neutral-800">
      <div className="flex items-center justify-center flex-col gap-4">
        <h1 className="text-5xl font-bold text-center italic">
          <span className="text-[#fa7275] text-6xl">Welcome</span> to This{" "}
          <span className="bg-[#fa7275] px-3 rounded-full text-white">
            URL Shortener
          </span>{" "}
          Website
        </h1>
        <h2 className="text-3xl italic font-semibold">
          Shorten. Share. Succeed
        </h2>
      </div>
      <form
        onSubmit={handleSubmit}
        className="flex items-center justify-center gap-2"
      >
        <input
          type="text"
          value={longUrl}
          onChange={(e) => setLongUrl(e.target.value)}
          placeholder="Paste your URL"
          className="w-[24rem] h-12 p-2 rounded-lg outline-none border"
        />
        <button
          type="submit"
          className="bg-[#fa7275] duration-200 hover:bg-[#ff6264] h-12 px-4 rounded-lg text-white text-lg font-semibold"
        >
          Submit
        </button>
      </form>
      {shortUrl && (
        <code className="mt-5 text-lg bg-neutral-100 p-6 rounded-lg relative">
          <MdContentCopy
            size={16}
            className="absolute right-2 top-2 text-neutral-600 cursor-pointer"
            onClick={handleCopy}
          />
          <strong>Shortened URL:</strong>{" "}
          <a
            href={shortUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600"
          >
            {shortUrl}
          </a>
          {copyMessage && (
            <span className="block mt-2 text-green-600">{copyMessage}</span>
          )}
        </code>
      )}
    </div>
  );
};

export default App;
