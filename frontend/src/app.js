import React, { useState } from "react";
import Login from "./pages/Login";
import "./index.css";

function App() {
  const [user, setUser] = useState(null);

  return (
    <div>
      {!user ? <Login setUser={setUser} /> : <h1>Welcome {user.name}</h1>}
    </div>
  );
}

export default App;
