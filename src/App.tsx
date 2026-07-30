import { ThemeProvider } from "@/contexts/ThemeContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import Index from "./pages/Index";

const App = () => (
  <ThemeProvider>
    <LanguageProvider>
      <Index />
    </LanguageProvider>
  </ThemeProvider>
);

export default App;
