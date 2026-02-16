export default function TextInput({ value, onChange, darkMode }) {
  return (
    <textarea 
      placeholder="Type your message..."
      rows="4"
      value={value}
      onChange={onChange}
      className={`w-full p-3 sm:p-4 border rounded-lg mb-4 resize-none transition-colors
        ${
          darkMode
            ? "bg-gray-700 text-white border-gray-600 placeholder-gray-400"
            : "bg-white text-black border-gray-300 placeholder-gray-500"
        }
      `}
    />
  );
}