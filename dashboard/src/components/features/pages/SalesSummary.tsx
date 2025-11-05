import React, { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

// ✅ Interface para descrever o formato dos dados de vendas
interface SaleSummary {
  store: string;
  channel: string;
  item: string;
  revenue: number;
  total_quantity: number;
}

const Dashboard = () => {
  // ✅ Estado para armazenar os dados do gráfico
  const [data, setData] = useState<SaleSummary[]>([]);

  // ✅ Estado para armazenar os filtros de pesquisa
  const [filters, setFilters] = useState({
    store: "",
    channel: "",
    item: "",
    startDate: "",
    endDate: "",
  });

  // ✅ Estados separados para datas avançadas
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // ✅ Estado para armazenar todos os itens disponíveis
  const [allItems, setAllItems] = useState<string[]>([]);

  // ✅ Função para buscar os dados do backend com base nos filtros
  const fetchData = async () => {
    // Monta os parâmetros da URL com base nos filtros
    const params = new URLSearchParams(filters as Record<string, string>).toString();
    try {
      const res = await fetch(`http://localhost:5000/api/sales-summary?${params}`);
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error("Erro ao carregar vendas:", err);
    }
  };

  // ✅ Função para carregar todos os itens do backend
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/items"); // precisa existir no backend
        const json = await res.json();
        setAllItems(json.map((i: any) => i.name));
      } catch (err) {
        console.error("Erro ao carregar itens:", err);
      }
    };
    fetchItems();
  }, []);

  // ✅ Atualiza os dados do gráfico sempre que os filtros mudam
  useEffect(() => {
    fetchData();
  }, [filters]);

  // ✅ Extrair valores únicos para dropdowns
  const stores = Array.from(new Set(data.map(d => d.store)));
  const channels = Array.from(new Set(data.map(d => d.channel)));
  const items = allItems; // ✅ usar todos os itens carregados
  const minDate = "2025-06-01"; // início do histórico
  const maxDate = new Date().toISOString().split("T")[0]; // data máxima de hoje

  // ✅ Função para formatar valores monetários
  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);

  return (
    <div className="dashboard-container">
      {/* ✅ Título do gráfico */}
      <h2>📊 Vendas por Loja / Canal / Item</h2>

      {/* ✅ Contêiner dos filtros */}
      <div className="filter-container">
        {/* Loja */}
        <select
          value={filters.store}
          onChange={e => setFilters({ ...filters, store: e.target.value })}
        >
          <option value="">Todas as lojas</option>
          {stores.map(s => <option key={s} value={s}>{s}</option>)}
        </select>

        {/* Canal */}
        <select
          value={filters.channel}
          onChange={e => setFilters({ ...filters, channel: e.target.value })}
        >
          <option value="">Todos os canais</option>
          {channels.map(c => <option key={c} value={c}>{c}</option>)}
        </select>

        {/* Item */}
        <select
          value={filters.item}
          onChange={e => setFilters({ ...filters, item: e.target.value })}
        >
          <option value="">Todos os itens</option>
          {items.map(i => <option key={i} value={i}>{i}</option>)}
        </select>

        {/* ✅ Botão “Mais” para exibir filtros de data avançados */}
        <button
          className="toggle-advanced"
          onClick={() =>
            document.querySelector('.advanced-filters')?.classList.toggle('active')
          }
        >
          Mais
        </button>

        {/* ✅ Filtros avançados de data (inicial e final) */}
        <div className="advanced-filters">
          <input
            type="date"
            value={startDate}
            min={minDate}
            max={maxDate}
            onChange={e => {
              setStartDate(e.target.value);
              setFilters({ ...filters, startDate: e.target.value });
            }}
          />
          <input
            type="date"
            value={endDate}
            min={minDate}
            max={maxDate}
            onChange={e => {
              setEndDate(e.target.value);
              setFilters({ ...filters, endDate: e.target.value });
            }}
          />
        </div>
      </div>

      {/* ✅ Contêiner do gráfico */}
      <div className="chart-wrapper">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <XAxis dataKey="store" />
            <YAxis tickFormatter={formatCurrency} />
            <Tooltip formatter={(value: number) => formatCurrency(value)} />
            <Bar dataKey="revenue" fill="#82ca9d" name="Faturamento (R$)" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Dashboard;
