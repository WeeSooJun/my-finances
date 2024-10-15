import { useState } from "react";
import Main from "./Main";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Login from "./Login";

const queryClient = new QueryClient();

function App() {
  const [showEnterPassword, setShowEnterPassword] = useState(true);

  return (
    <QueryClientProvider client={queryClient}>
      {showEnterPassword && (
        <Login setShowEnterPassword={setShowEnterPassword} />
      )}
      {!showEnterPassword && <Main />}
    </QueryClientProvider>
  );
}

export default App;
