# Dashboard de Vendas por Loja / Canal / Item

Este projeto é um **dashboard de vendas** que mostra informações consolidadas por loja, canal de venda e itens vendidos. Todo o código foi escrito e organizado por mim.

---

## Estrutura do Projeto

src/
│
├─ components/
│ ├─ features/
│ │ └─ FilterView.tsx # Componente de filtros (loja, canal, item, datas)
│ ├─ pages/
│ │ └─ SalesSummary.tsx # Página principal do dashboard
│ ├─ types/
│ │ └─ SalesOverview.ts # Tipos TypeScript dos dados de vendas
│
├─ server/
│ ├─ db/ # Conexão e scripts do PostgreSQL
│ ├─ routes/ # Rotas do backend
│ └─ server.js # Servidor Express
│
├─ styles/
│ ├─ components/ # SCSS para cada componente
│ ├─ mixins/ # Mixins SCSS reutilizáveis
│ └─ variables/ # Variáveis SCSS (cores, tamanhos, espaçamentos)
│
├─ public/ # Arquivos públicos (index.html, imagens)
└─ index.tsx # Entrada da aplicação


---

## Funcionalidades

### 1. Filtros (`FilterView.tsx`)

- Dropdowns para selecionar:
  - **Loja**
  - **Canal de venda** (Presencial, iFood, Rappi, Outros)
  - **Item** vendido
- Campos de **data inicial e final**:
  - Limitados a **dados disponíveis** (junho de 2025 em diante)
  - Inicialmente escondidos atrás de um botão “Mais”
- Atualização automática do dashboard ao alterar qualquer filtro

---

### 2. Dashboard (`SalesSummary.tsx`)

- Recebe dados filtrados do backend em formato JSON
- Renderiza **gráfico de barras** usando **Recharts**:
  - **Eixo X**: lojas
  - **Eixo Y**: faturamento (`value_paid`) formatado em R$  
- Tooltip mostra o faturamento detalhado
- Layout responsivo e ajustável para diferentes tamanhos de tela
- Padding de **16px**, números e textos alinhados corretamente

---

### 3. Backend (`server/`)

- Servidor **Express** conectado ao **PostgreSQL**
- Rotas principais:
  - `/api/sales-summary` → retorna resumo das vendas filtradas
  - `/api/items` → retorna lista de itens para o dropdown
  - `/api/stores` → retorna lojas ativas
  - `/api/channels` → retorna canais de venda
- Lógica de filtro:
  - Query SQL dinâmica baseada em parâmetros (`store`, `channel`, `item`, `startDate`, `endDate`)
  - Soma **valor pago** (`value_paid`) para calcular faturamento real

---

### 4. Tipos TypeScript (`SalesOverview.ts`)

- Tipos definidos para:
  - Loja (`store`)
  - Canal (`channel`)
  - Item (`item`)
  - Faturamento (`revenue`)
  - Quantidade total (`total_quantity`)
- Garante **segurança de tipos** e autocompletar no VSCode

---

### 5. Estilização SCSS

- Variáveis definidas em `styles/variables/`:
  - Cores
  - Tamanhos
  - Padding e margin base
- Mixins em `styles/mixins/` para reutilização de código
- SCSS específico em `styles/components/` para:
  - Dashboard
  - Filtros
  - Botões
- Layout moderno e consistente:
  - Padding de **16px**
  - Dropdowns alinhados
  - Campos de data alinhados ao bottom
  - Valores e textos não se sobrepondo

---

## Como Rodar o Projeto

1. Instale as dependências:
```bash
npm install

node src/server/server.js

npm start

http://localhost:3000

Observações

Apenas dados a partir de junho de 2025 estão disponíveis

Layout e gráficos foram planejados para serem limpos, responsivos e fáceis de usar

Fácil de estender para novos filtros ou tipos de gráfico

Todo o código está comentado, explicando cada passo da lógica

Campos de data aparecem apenas ao clicar em “Mais”, mantendo o filtro compacto