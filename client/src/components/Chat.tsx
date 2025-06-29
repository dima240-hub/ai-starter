import { useState } from 'react';
import axios from 'axios';

export default function Chat() {
  const [messages, setMessages] = useState([
    { role: 'system', content: 'You are a helpful assistant.' },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMsg = { role: 'user', content: input };
    const updated = [...messages, userMsg];
    setMessages(updated);
    setLoading(true);

    try {
      const { data } = await axios.post('http://localhost:4000/api/chat', {
        messages: updated,
      });
      setMessages([...updated, data.message]);
    } catch (e) {
      console.error(e);
      alert('Error sending message');
    } finally {
      setLoading(false);
      setInput('');
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-4 bg-white border rounded shadow-md">
      <div className="h-96 overflow-y-auto mb-4 space-y-3 px-2">
        {messages
          .filter((m) => m.role !== 'system')
          .map((m, i) => (
            <div
              key={i}
              className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs px-4 py-2 rounded-lg text-white text-sm ${
                  m.role === 'user' ? 'bg-blue-600' : 'bg-gray-800'
                }`}
              >
                {m.content}
              </div>
            </div>
          ))}
      </div>
      <div className="flex items-center gap-2">
        <input
          className="flex-1 border border-gray-300 rounded px-3 py-2 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          disabled={loading}
          placeholder="Type your message..."
        />
        <button
          className={`px-4 py-2 rounded text-white ${
            loading ? 'bg-blue-300' : 'bg-blue-600 hover:bg-blue-700'
          }`}
          onClick={sendMessage}
          disabled={loading}
        >
          {loading ? '...' : 'Send'}
        </button>
      </div>
    </div>
  );
}
