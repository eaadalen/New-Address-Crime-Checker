require('dotenv').config()
import { createRoot } from "react-dom/client";
import { MainView } from "./components/main-view/main-view";
import "./index.css";

const App = () => {
  return (
    <div>
      <MainView />
    </div>
  );
};

const container = document.querySelector("#root");
const root = createRoot(container);
root.render(<App />);