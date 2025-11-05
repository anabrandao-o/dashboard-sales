import React, { useEffect, useState } from "react";

interface FilterViewProps {
  onApply: (filters: Record<string, string>) => void;
}

const FilterView = ({ onApply }: FilterViewProps) => {
  const [filters, setFilters] = useState<{ stores?: string[]; channels?: string[] }>({});
  const [selectedStore, setSelectedStore] = useState("");
  const [selectedChannel, setSelectedChannel] = useState("");

  useEffect(() => {
    const loadFilters = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/filters");
        const json = await res.json();
        setFilters(json);
      } catch (err) {
        console.error("Erro ao carregar filtros:", err);
      }
    };
    loadFilters();
  }, []);

  const applyFilters = () => {
    onApply({
      store: selectedStore,
      channel: selectedChannel,
    });
  };

  return (
    <div style={{ marginBottom: "20px" }}>
      <select onChange={(e) => setSelectedStore(e.target.value)} value={selectedStore}>
        <option value="">Todas as lojas</option>
        {filters.stores?.map((s) => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>

      <select onChange={(e) => setSelectedChannel(e.target.value)} value={selectedChannel}>
        <option value="">Todos os canais</option>
        {filters.channels?.map((c) => (
          <option key={c} value={c}>{c}</option>
        ))}
      </select>

      <button onClick={applyFilters}>Aplicar</button>
    </div>
  );
};

export default FilterView;
