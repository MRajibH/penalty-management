import { HashRouter } from "react-router-dom";
import RootRouter from "./routes/RootRouter";
import { Toaster } from "./components/ui/toaster";
import { AuthContextProvider, DataContextProvider } from "@/context";

function App() {
  return (
    <AuthContextProvider>
      <DataContextProvider>
        <HashRouter>
          <RootRouter />
          <Toaster />
        </HashRouter>
      </DataContextProvider>
    </AuthContextProvider>
  );
}

export default App;
