
export const AdoreScore = ({ data }) => {
    const { adorescore, emotions: analysisEmotions } = data.analysis;
  const adorescoreValue =
    adorescore && adorescore.overall !== undefined
      ? `+${adorescore.overall}`
      : "+0";

    return <>
    <div className="w-1/2 flex flex-col items-center bg-gray-50 p-2 rounded-md border-neutral-500 border-[1px]">
          <h2 className="text-xl font-bold mb-2">Adorescore</h2>
          <p className="text-3xl font-extrabold text-green-600 mb-4">
            {adorescoreValue}
          </p>
          <p className="text-sm text-gray-600">
            Primary Emotion:{" "}
            <span className="font-semibold">
              {analysisEmotions?.primary?.emotion || "N/A"}
            </span>{" "}
            (
            {Math.round((analysisEmotions?.primary?.intensity || 0) * 100)}
            %)
          </p>
          <p className="text-sm text-gray-600">
            Secondary Emotion:{" "}
            <span className="font-semibold">
              {analysisEmotions?.secondary?.emotion || "N/A"}
            </span>{" "}
            (
            {Math.round((analysisEmotions?.secondary?.intensity || 0) * 100)}
            %)
          </p>
        </div>
    </>
}
