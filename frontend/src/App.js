import { useState } from "react";
import axios from "axios";

function App() {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState(null);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    try {
      setError("");
      setResponse(null);

      const dataArray = input
        .split(",")
        .map(s => s.trim())
        .filter(s => s.length > 0);

      const res = await axios.post("http://localhost:3000/bfhl", {
        data: dataArray
      });

      setResponse(res.data);
    } catch (err) {
      setError("API call failed. Check backend or CORS.");
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h2>SRM Full Stack Challenge</h2>

      <textarea
        rows="5"
        cols="60"
        placeholder="Example: A->B, A->C, B->D"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />

      <br /><br />

      <button onClick={handleSubmit}>Submit</button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {response && (
        <pre style={{ marginTop: "20px", background: "#f4f4f4", padding: "10px" }}>
          {JSON.stringify(response, null, 2)}
        </pre>
      )}
    </div>
  );
}

export default App;