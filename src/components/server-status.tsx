"use client";
import { useState, useEffect } from "react";

const SERVER_URL = "play.dailycodes.dev"; // Your Minecraft server URL
const API_BASE_URL = "https://api.mcsrvstat.us/3/";

export default function ServerStatus() {
  const [status, setStatus] = useState<string | null>(null);
  const [players, setPlayers] = useState<string | null>(null);
  const [motd, setMotd] = useState<string | null>(null);
  const [icon, setIcon] = useState<string | null>(null);

  useEffect(() => {
    async function fetchServerStatus() {
      try {
        const response = await fetch(`${API_BASE_URL}${SERVER_URL}`);
        const data = await response.json();
        console.log(data);

        if (data.online) {
          setStatus("Online");
          setPlayers(`${data.players.online} / ${data.players.max}`);
          setIcon(data.icon);
          setMotd(data.motd.clean.join(""));
        } else {
          setStatus("Offline");
          setPlayers(null);
          setMotd(null);
          setIcon(null);
        }
      } catch (error) {
        console.error("Error fetching server status:", error);
        setStatus("Offline");
      }
    }

    fetchServerStatus();
  }, []);

  return (
    <div className="p-4 bg-gray-800 rounded-lg text-white">
      <h2 className="text-2xl font-bold mb-2">Server Status</h2>

      <div className="flex gap-2">
        {icon && <img src={icon} alt="Server Icon" className="w-16 h-16" />}

        <div className="flex flex-col gap-2">
          <p className="flex justify-between">
            {status === "Online" ? (
              <span className="text-green-500">Online</span>
            ) : (
              <span className="text-red-500">Offline</span>
            )}

            {players && <span>{players}</span>}
          </p>

          {motd && <div className="text-sm text-gray-300">{motd}</div>}
        </div>
      </div>
    </div>
  );
}
