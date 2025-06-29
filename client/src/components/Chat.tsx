import { useState } from 'react';
import axios from 'axios';

export default function Chat() {
  const [messages, setMessages] = useState([
    { role: 'system', content: 'You are a helpful assistant.' },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input) return;
    const userMsg = { role: 'user', content: input };
    const updated = [...messages, userMsg];
    setMessages(updated);
    setLoading(true);

    try {
      const { data } = await axios.post('http://localhost:4000/api/chat', { messages: updated });
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
    <div>
      <div className="border p-4 h-80 overflow-auto mb-4 ">
        {messages
          .filter((m) => m.role !== 'system')
          .map((m, i) => (
            <div key={i} className={m.role === 'user' ? 'text-right mb-2' : 'text-left mb-2'}>
              <span className="inline-block bg-black rounded p-2">
                {m.content}
              </span>
            </div>
          ))}
      </div>
      <div className="flex">
        <input
          className="flex-1 border rounded p-2"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          disabled={loading}
        />
        <button
          className="ml-2 px-4 py-2 bg-blue-600 text-white rounded"
          onClick={sendMessage}
          disabled={loading}
        >
          {loading ? '...' : 'Send'}
        </button>
      </div>
    </div>
  );
}