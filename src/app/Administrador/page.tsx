"use client"
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Head from 'next/head';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS,CategoryScale,LinearScale,PointElement,LineElement,Title, Tooltip,Legend,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(CategoryScale,LinearScale,PointElement,LineElement, Title, Tooltip,Legend
);
// Define types
type TabType = 'Dashboard' | 'Usuários' | 'Produtos' | 'Pedidos' | 'Transportadoras' | 'Relatórios';
type UserType = 'Agricultor' | 'Compradora' | 'Fornecedor';
type UserStatus = 'Pendente' | 'Aprovado' | 'Rejeitado';

interface User {
  name: string;
  type: UserType;
  date: string;
  status: UserStatus;
}

interface Product {
  name: string;
  seller: string;
  price: string;
  status: string;
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<TabType>('Dashboard');
  const [sidebarActive, setSidebarActive] = useState(false);
  const [users] = useState<User[]>([
    { name: 'João Silva', type: 'Agricultor', date: '2023-08-15', status: 'Pendente' },
    { name: 'Maria Santos', type: 'Compradora', date: '2023-08-15', status: 'Aprovado' },
    { name: 'Pedro Alves', type: 'Fornecedor', date: '2023-08-14', status: 'Rejeitado' }
  ]);
  
  const [products] = useState<Product[]>([
    { name: 'Milho Verde', seller: 'João Silva', price: 'AOA 1,500', status: 'Ativo' },
    { name: 'Feijão', seller: 'Maria Antunes', price: 'AOA 2,300', status: 'Ativo' },
    { name: 'Mandioca', seller: 'Carlos Eduardo', price: 'AOA 1,200', status: 'Ativo' },
    { name: 'Batata Doce', seller: 'Fernanda Silva', price: 'AOA 1,800', status: 'Ativo' },
  ]);

  const handleMenuToggle = () => {
    setSidebarActive(!sidebarActive);
  };

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    if (window.innerWidth <= 768) {
      setSidebarActive(false);
    }
  };

  // Sales chart data
  const chartData = {
    labels: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'],
    datasets: [
      {
        label: 'Vendas (AOA)',
        data: [65000, 59000, 80000, 81000, 56000, 95000, 40000],
        fill: false,
        borderColor: '#43a047',
        tension: 0.1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const sidebar = document.querySelector('.sidebar');
      const menuToggle = document.querySelector('.menu-toggle');
      
      if (
        window.innerWidth <= 768 &&
        sidebar &&
        menuToggle &&
        !sidebar.contains(e.target as Node) &&
        !menuToggle.contains(e.target as Node) &&
        sidebarActive
      ) {
        setSidebarActive(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [sidebarActive]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setSidebarActive(false);
      }
    };

    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <>
      <Head>
        <title>Portal Administrativo - NzoAgro</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link
          href="https://cdn.jsdelivr.net/npm/@mdi/font@7.2.96/css/materialdesignicons.min.css"
          rel="stylesheet"
        />
      </Head>

      <div className="dashboard">
        <button className="menu-toggle" onClick={handleMenuToggle}>
          <i className="mdi mdi-menu"></i>
          jkskj
        </button>

        <aside className={`sidebar ${sidebarActive ? 'active' : ''}`}>
          <div className="logo">beginAtZero
            <h1 className="text-marieth text-2xl font-bold">NzoAgro</h1>
          </div>
          <nav>
            <a 
              href="#dashboard" 
              className={`nav-item ${activeTab === 'Dashboard' ? 'active' : ''}`}
              onClick={() => handleTabChange('Dashboard')}
            >
              <i className="mdi mdi-view-dashboard"></i>
              Dashboard
            </a>
            <a 
              href="#users" 
              className={`nav-item ${activeTab === 'Usuários' ? 'active' : ''}`}
              onClick={() => handleTabChange('Usuários')}
            >
              <i className="mdi mdi-account-group"></i>
              Gestão de Usuários
            </a>
            <a href="#security" className="nav-item">
              <i className="mdi mdi-shield-check"></i>
              Segurança
            </a>
            <a 
              href="#orders" 
              className={`nav-item ${activeTab === 'Pedidos' ? 'active' : ''}`}
              onClick={() => handleTabChange('Pedidos')}
            >
              <i className="mdi mdi-cart"></i>
              Pedidos
            </a>
            <a 
              href="#products" 
              className={`nav-item ${activeTab === 'Produtos' ? 'active' : ''}`}
              onClick={() => handleTabChange('Produtos')}
            >
              <i className="mdi mdi-package"></i>
              Produtos
            </a>
            <a 
              href="#reports" 
              className={`nav-item ${activeTab === 'Relatórios' ? 'active' : ''}`}
              onClick={() => handleTabChange('Relatórios')}
            >
              <i className="mdi mdi-chart-bar"></i>
              Relatórios
            </a>
            <a 
              href="#logistics" 
              className="nav-item"
            >
              <i className="mdi mdi-truck"></i>
              Logística
            </a>
            <a href="#support" className="nav-item">
              <i className="mdi mdi-headset"></i>
              Suporte
            </a>
            <a 
              href="#transportadoras" 
              className={`nav-item ${activeTab === 'Transportadoras' ? 'active' : ''}`}
              onClick={() => handleTabChange('Transportadoras')}
            >
              <i className="mdi mdi-truck-delivery"></i>
              Transportadoras
            </a>
            <a href="#pedidos" className="nav-item">
              <i className="mdi mdi-clipboard-list"></i>
              Controle de Pedidos
            </a>
          </nav>
        </aside>

        <header className="header">
          <div className="search">
            <input 
              type="search" 
              placeholder="Pesquisar..." 
              className="search-input" 
            />
          </div>
          <div className="user-profile">
            <div className="notifications">
              <i className="mdi mdi-bell notification-icon">
                <span className="notification-badge">3</span>
              </i>
            </div>
            <div className="user-avatar">
              <i className="mdi mdi-account"></i>
            </div>
            <div className="user-info">
              <strong>Admin</strong>
            </div>
          </div>
        </header>

        <main className="main-content">
          <div className="tab-container">
            <div className="tabs">
              {(['Dashboard', 'Usuários', 'Produtos', 'Pedidos', 'Transportadoras', 'Relatórios'] as TabType[]).map((tab) => (
                <div 
                  key={tab}
                  className={`tab ${activeTab === tab ? 'active' : ''}`}
                  onClick={() => handleTabChange(tab)}
                >
                  {tab}
                </div>
              ))}
            </div>
          </div>

          {activeTab === 'Dashboard' && (
            <>
              <div className="stats-grid">
                <div className="stat-card">
                  <h3>Usuários Ativos</h3>
                  <div className="value">2,453</div>
                </div>
                <div className="stat-card">
                  <h3>Pedidos Hoje</h3>
                  <div className="value">156</div>
                </div>
                <div className="stat-card">
                  <h3>Produtos Ativos</h3>
                  <div className="value">1,893</div>
                </div>
                <div className="stat-card">
                  <h3>Receita Mensal</h3>
                  <div className="value">AOA 985K</div>
                </div>
              </div>

              <div className="card">
                <div className="card-header">
                  <h2>Últimos Cadastros</h2>
                  <button className="btn btn-primary">Ver Todos</button>
                </div>
                <div className="card-body">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Usuário</th>
                        <th>Tipo</th>
                        <th>Data</th>
                        <th>Status</th>
                        <th>Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user, index) => (
                        <tr key={index}>
                          <td>{user.name}</td>
                          <td>{user.type}</td>
                          <td>{user.date}</td>
                          <td>
                            <span className={`status ${user.status.toLowerCase()}`}>
                              {user.status}
                            </span>
                          </td>
                          <td>
                            <button className="btn btn-primary">
                              {user.status === 'Pendente' ? 'Aprovar' : 
                               user.status === 'Rejeitado' ? 'Revisar' : 'Detalhes'}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="card">
                <div className="card-header">
                  <h2>Vendas dos Últimos 7 Dias</h2>
                </div>
                <div className="card-body">
                  <div className="chart-container">
                    <Line data={chartData} options={chartOptions} />
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === 'Produtos' && (
            <div className="card">
              <div className="card-header">
                <h2>Gerenciamento de Produtos</h2>
                <div className="search">
                  <input type="search" placeholder="Buscar produtos..." className="search-input" />
                </div>
              </div>
              <div className="card-body">
                <div className="product-grid">
                  {products.map((product, index) => (
                    <div key={index} className="product-card">
                      <div className="product-image-placeholder" />
                      <div className="product-info">
                        <h3>{product.name}</h3>
                        <p>Vendedor: {product.seller}</p>
                        <p>Preço: {product.price}</p>
                        <p>Status: {product.status}</p>
                      </div>
                      <div className="product-actions">
                        <button className="btn btn-primary">Editar</button>
                        <button className="delete-btn">Excluir</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'Usuários' && (
            <div className="card">
              <div className="card-header">
                <h2>Gerenciamento de Usuários</h2>
                <div className="search">
                  <input type="search" placeholder="Buscar usuários..." className="search-input" />
                </div>
              </div>
              <div className="card-body">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Nome</th>
                      <th>Email</th>
                      <th>Tipo</th>
                      <th>Status</th>
                      <th>Data de Registro</th>
                      <th>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>João Silva</td>
                      <td>joao.silva@email.com</td>
                      <td>Agricultor</td>
                      <td><span className="status approved">Ativo</span></td>
                      <td>2023-08-15</td>
                      <td>
                        <button className="btn btn-primary">Editar</button>
                      </td>
                    </tr>
                    <tr>
                      <td>Maria Santos</td>
                      <td>maria.santos@email.com</td>
                      <td>Compradora</td>
                      <td><span className="status approved">Ativo</span></td>
                      <td>2023-08-12</td>
                      <td>
                        <button className="btn btn-primary">Editar</button>
                      </td>
                    </tr>
                    <tr>
                      <td>Pedro Alves</td>
                      <td>pedro.alves@email.com</td>
                      <td>Fornecedor</td>
                      <td><span className="status pending">Inativo</span></td>
                      <td>2023-08-10</td>
                      <td>
                        <button className="btn btn-primary">Editar</button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'Pedidos' && (
            <div className="card">
              <div className="card-header">
                <h2>Gestão de Pedidos</h2>
                <div className="search">
                  <input type="search" placeholder="Buscar pedidos..." className="search-input" />
                </div>
              </div>
              <div className="card-body">
                <table className="table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Cliente</th>
                      <th>Data</th>
                      <th>Valor</th>
                      <th>Status</th>
                      <th>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>#12345</td>
                      <td>Ana Maria</td>
                      <td>2023-08-17</td>
                      <td>AOA 5,400</td>
                      <td><span className="order-status status-pending">Pendente</span></td>
                      <td>
                        <button className="btn btn-primary">Detalhes</button>
                      </td>
                    </tr>
                    <tr>
                      <td>#12344</td>
                      <td>Roberto Carlos</td>
                      <td>2023-08-17</td>
                      <td>AOA 2,850</td>
                      <td><span className="order-status status-processing">Processando</span></td>
                      <td>
                        <button className="btn btn-primary">Detalhes</button>
                      </td>
                    </tr>
                    <tr>
                      <td>#12343</td>
                      <td>Carla Silva</td>
                      <td>2023-08-16</td>
                      <td>AOA 7,200</td>
                      <td><span className="order-status status-delivered">Entregue</span></td>
                      <td>
                        <button className="btn btn-primary">Detalhes</button>
                      </td>
                    </tr>
                    <tr>
                      <td>#12342</td>
                      <td>Fernando Mendes</td>
                      <td>2023-08-16</td>
                      <td>AOA 3,150</td>
                      <td><span className="order-status status-cancelled">Cancelado</span></td>
                      <td>
                        <button className="btn btn-primary">Detalhes</button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'Transportadoras' && (
            <div className="card">
              <div className="card-header">
                <h2>Cadastro de Transportadoras</h2>
                <button className="btn btn-primary">Nova Transportadora</button>
              </div>
              <div className="card-body">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Nome</th>
                      <th>CNPJ/NIF</th>
                      <th>Contato</th>
                      <th>Status</th>
                      <th>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>TransRápido Ltda</td>
                      <td>12.345.678/0001-90</td>
                      <td>(+244) 923 456 789</td>
                      <td><span className="status approved">Ativo</span></td>
                      <td>
                        <button className="btn btn-primary">Editar</button>
                      </td>
                    </tr>
                    <tr>
                      <td>Expresso Angola</td>
                      <td>98.765.432/0001-21</td>
                      <td>(+244) 923 987 654</td>
                      <td><span className="status approved">Ativo</span></td>
                      <td>
                        <button className="btn btn-primary">Editar</button>
                      </td>
                    </tr>
                    <tr>
                      <td>LogistiVia</td>
                      <td>45.678.901/0001-23</td>
                      <td>(+244) 923 123 456</td>
                      <td><span className="status pending">Inativo</span></td>
                      <td>
                        <button className="btn btn-primary">Editar</button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'Relatórios' && (
            <div className="card">
              <div className="card-header">
                <h2>Relatórios</h2>
              </div>
              <div className="card-body">
                <div className="stats-grid">
                  <div className="report-card" onClick={() => alert("Gerando relatório de vendas...")}>
                    <i className="mdi mdi-chart-bar" style={{ fontSize: '3rem', color: '#43a047' }}></i>
                    <h3>Relatório de Vendas</h3>
                  </div>
                  <div className="report-card" onClick={() => alert("Gerando relatório de usuários...")}>
                    <i className="mdi mdi-account-group" style={{ fontSize: '3rem', color: '#43a047' }}></i>
                    <h3>Relatório de Usuários</h3>
                  </div>
                  <div className="report-card" onClick={() => alert("Gerando relatório de produtos...")}>
                    <i className="mdi mdi-package" style={{ fontSize: '3rem', color: '#43a047' }}></i>
                    <h3>Relatório de Produtos</h3>
                  </div>
                  <div className="report-card" onClick={() => alert("Gerando relatório financeiro...")}>
                    <i className="mdi mdi-cash-multiple" style={{ fontSize: '3rem', color: '#43a047' }}></i>
                    <h3>Relatório Financeiro</h3>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      <style jsx global>{`
        :root {
          --marieth: #43a047;
          --marieth-dark: #2e7031;
          --marieth-light: #76d275;
          --sidebar-width: 280px;
          --header-height: 60px;
          --danger: #dc3545;
          --warning: #ffc107;
          --success: #28a745;
        }

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: 'Segoe UI', sans-serif;
          background: #f5f5f5;
          color: #333;
        }

        .dashboard {
          display: grid;
          grid-template-areas: 
              "sidebar header"
              "sidebar main";
          grid-template-columns: var(--sidebar-width) 1fr;
          grid-template-rows: var(--header-height) 1fr;
          min-height: 100vh;
          position: relative;
        }

        .menu-toggle {
          display: none;
          position: fixed;
          top: 1rem;
          left: 1rem;
          z-index: 1000;
          background: var(--marieth);
          color: white;
          border: none;
          padding: 0.5rem;
          border-radius: 5px;
          cursor: pointer;
        }

        .sidebar {
          grid-area: sidebar;
          background: white;
          border-right: 1px solid #eee;
          padding: 1rem;
          position: fixed;
          width: var(--sidebar-width);
          height: 100vh;
          overflow-y: auto;
          transition: transform 0.3s ease;
        }

        .header {
          grid-area: header;
          background: white;
          border-bottom: 1px solid #eee;
          padding: 1rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          position: fixed;
          width: calc(100% - var(--sidebar-width));
          right: 0;
          z-index: 100;
        }

        .search-input {
          padding: 0.5rem;
          border-radius: 5px;
          border: 1px solid #ddd;
          width: 300px;
        }

        .main-content {
          grid-area: main;
          padding: 2rem;
          margin-top: var(--header-height);
        }

        .logo {
          margin-bottom: 1.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .nav-item {
          display: flex;
          align-items: center;
          padding: 0.8rem 1rem;
          color: #666;
          text-decoration: none;
          border-radius: 8px;
          margin-bottom: 0.5rem;
          transition: all 0.3s ease;
        }

        .nav-item:hover {
          background: #f5f5f5;
          color: var(--marieth);
        }

        .nav-item.active {
          background: var(--marieth);
          color: white;
        }

        .nav-item i {
          margin-right: 0.8rem;
          font-size: 1.2rem;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .stat-card {
          background: white;
          padding: 1.5rem;
          border-radius: 10px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.05);
        }

        .report-card {
          background: white;
          padding: 1.5rem;
          border-radius: 10px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.05);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          cursor: pointer;
          transition: transform 0.2s;
        }

        .report-card:hover {
          transform: translateY(-5px);
        }

        .stat-card h3 {
          color: #666;
          font-size: 0.9rem;
          margin-bottom: 0.5rem;
        }

        .stat-card .value {
          font-size: 2rem;
          font-weight: bold;
          color: var(--marieth);
        }

        .card {
          background: white;
          border-radius: 10px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.05);
          margin-bottom: 1.5rem;
        }

        .card-header {
          padding: 1.5rem;
          border-bottom: 1px solid #eee;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .card-body {
          padding: 1.5rem;
        }

        .table {
          width: 100%;
          border-collapse: collapse;
        }

        .table th,
        .table td {
          padding: 1rem;
          text-align: left;
          border-bottom: 1px solid #eee;
        }

        .table th {
          background: #f9f9f9;
          font-weight: 600;
        }

        .status {
          padding: 0.3rem 0.8rem;
          border-radius: 20px;
          font-size: 0.85rem;
        }

        .status.pending {
          background: #fff3cd;
          color: #856404;
        }

        .status.approved {
          background: #d4edda;
          color: #155724;
        }

        .status.rejected {
          background: #f8d7da;
          color: #721c24;
        }

        .order-status {
          display: inline-block;
          padding: 0.4rem 1rem;
          border-radius: 20px;
          font-size: 0.85rem;
          font-weight: 500;
        }

        .status-pending { background: #fff3cd; color: #856404; }
        .status-processing { background: #cce5ff; color: #004085; }
        .status-delivered { background: #d4edda; color: #155724; }
        .status-cancelled { background: #f8d7da; color: #721c24; }

        .user-profile {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .user-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: var(--marieth);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .notification-icon {
          font-size: 1.5rem;
          position: relative;
        }

        .notification-badge {
          background: var(--danger);
          color: white;
          border-radius: 50%;
          padding: 0.2rem 0.5rem;
          font-size: 0.8rem;
          position: absolute;
          top: -8px;
          right: -8px;
        }

        .btn {
          padding: 0.5rem 1rem;
          border-radius: 5px;
          border: none;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.3s ease;
        }

        .btn-primary {
          background: var(--marieth);
          color: white;
        }

        .btn-primary:hover {
          background: var(--marieth-dark);
        }

        .chart-container {
          height: 300px;
          margin-top: 1rem;
        }

        .product-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 1.5rem;
          margin-top: 1rem;
        }

        .product-card {
          background: white;
          border-radius: 10px;
          overflow: hidden;
          box-shadow: 0 2px 4px rgba(0,0,0,0.05);
          transition: transform 0.2s;
        }

        .product-card:hover {
          transform: translateY(-5px);
        }

        .product-image-placeholder {
          width: 100%;
          height: 200px;
          background-color: #f0f0f0;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .product-image-placeholder::after {
          content: "Imagem do Produto";
          color: #999;
        }

        .product-info {
          padding: 1rem;
        }

        .product-actions {
          padding: 1rem;
          border-top: 1px solid #eee;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .delete-btn {
          background: var(--danger);
          color: white;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 5px;
          cursor: pointer;
        }

        .delete-btn:hover {
          background: #c82333;
        }

        .tab-container {
          margin-bottom: 2rem;
        }

        .tabs {
          display: flex;
          gap: 1rem;
          margin-bottom: 1.5rem;
          overflow-x: auto;
          padding-bottom: 0.5rem;
        }

        .tab {
          padding: 0.8rem 1.5rem;
          background: white;
          border-radius: 5px;
          cursor: pointer;
          white-space: nowrap;
          transition: all 0.3s;
        }

        .tab.active {
          background: var(--marieth);
          color: white;
        }

        /* Responsive Design */
        @media (max-width: 1024px) {
          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .product-grid {
            grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          }
        }

        @media (max-width: 768px) {
          .dashboard {
            grid-template-areas: 
                "header"
                "main";
            grid-template-columns: 1fr;
          }

          .menu-toggle {
            display: block;
          }

          .sidebar {
            transform: translateX(-100%);
            z-index: 999;
            width: 100%;
            max-width: 100%;
          }

          .sidebar.active {
            transform: translateX(0);
          }

          .header {
            width: 100%;
            padding-left: 4rem;
          }

          .main-content {
            margin-left: 0;
            padding: 1rem;
          }

          .stats-grid {
            grid-template-columns: 1fr;
          }

          .product-grid {
            grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
          }

          .tabs {
            flex-wrap: nowrap;
            overflow-x: auto;
          }

          .table {
            display: block;
            overflow-x: auto;
            white-space: nowrap;
          }
        }

        @media (max-width: 480px) {
          .user-info {
            display: none;
          }

          .card-header {
            flex-direction: column;
            gap: 1rem;
          }

          .product-grid {
            grid-template-columns: 1fr;
          }

          .stat-card {
            padding: 1rem;
          }
        }
      `}</style>
    </>
  );
}