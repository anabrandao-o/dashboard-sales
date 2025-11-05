import Dashboard from "./components/features/pages/SalesSummary";
import React from "react";


const App: React.FC = () => {
  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>🧭 Painel de Vendas</h1>
      <Dashboard />
    </div>
  );
};

export default App;
