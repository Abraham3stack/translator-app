export default function TranslateButton({ onClick, loading }) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className={`w-full py-2 rounded-lg font-semibold cursor-pointer transition-colors
        ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-black text-white"}
      `}
    >
      {loading ? "Translating..." : "Translate"} 
    </button>
  );
}