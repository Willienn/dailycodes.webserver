export default async function ServerStatus() {
  let error = false;
  const data = await fetch("https://api.mcsrvstat.us/3/play.dailycodes.dev")
    .then((value) => value.json())
    .catch((cause) => {
      console.error("Error fetching server status:", cause);
      error = true;
    });

  if (error) return <>Ocorreu um erro :O</>;

  return (
    <div className="p-4 bg-gray-800 rounded-lg text-white">
      <h2 className="text-2xl font-bold mb-2">Server Status</h2>

      <div className="flex gap-2">
        {data?.icon && (
          <img src={data.icon} alt="Server Icon" className="w-16 h-16" />
        )}

        <div className="flex flex-col gap-2">
          <p className="flex justify-between">
            {data?.online ? (
              <span className="text-green-500">Online</span>
            ) : (
              <span className="text-red-500">Offline</span>
            )}

            {data?.players && (
              <span>
                {data.players.online} / {data.players.max}
              </span>
            )}
          </p>

          {data?.motd && (
            <div className="text-sm text-gray-300">{data.motd.clean}</div>
          )}
        </div>
      </div>
    </div>
  );
}
