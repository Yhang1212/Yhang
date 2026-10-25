import './AdminDashboard.css';

const stats = [
  { title: 'Revenue', value: '$84.2K', change: '+12.4%' },
  { title: 'Orders', value: '1,248', change: '+8.1%' },
  { title: 'Visitors', value: '32.7K', change: '+15.6%' },
  { title: 'Messages', value: '96', change: '+4.2%' },
];

const recentProducts = [
  { name: 'Frost Line 4-Door', status: 'Published', updated: '2h ago' },
  { name: 'Glacier Pro French Door', status: 'Review', updated: '4h ago' },
  { name: 'Nordik Counter-Depth', status: 'Draft', updated: 'Yesterday' },
];

const recentMessages = [
  { sender: 'Mina Chen', subject: 'New showroom inquiry', time: '10 min ago' },
  { sender: 'Daniel Brooks', subject: 'Delivery schedule request', time: '1h ago' },
  { sender: 'Ava Morales', subject: 'Product availability question', time: '3h ago' },
];

const quickActions = ['Create campaign', 'Publish offer', 'Review leads', 'Send report'];

function AdminDashboard() {
  return (
    <div className="admin-page">
      <aside className="sidebar">
        <div>
          <div className="brand">HAILANG</div>
          <div className="brand-subtitle">Admin Console</div>
        </div>

        <nav className="sidebar-nav">
          <a className="active" href="#">Overview</a>
          <a href="#">Products</a>
          <a href="#">Orders</a>
          <a href="#">Messages</a>
          <a href="#">Settings</a>
        </nav>
      </aside>

      <main className="dashboard-main">
        <header className="topbar">
          <div>
            <p className="section-eyebrow">Operations</p>
            <h1>Dashboard Overview</h1>
          </div>

          <div className="topbar-actions">
            <button className="ghost-btn">Export</button>
            <button className="primary-btn">+ New Report</button>
          </div>
        </header>

        <section className="stats-grid">
          {stats.map((item) => (
            <article key={item.title} className="stat-card">
              <p>{item.title}</p>
              <h3>{item.value}</h3>
              <span>{item.change}</span>
            </article>
          ))}
        </section>

        <section className="content-grid">
          <div className="panel">
            <div className="panel-header">
              <h2>Recent Products</h2>
              <a href="#">View all</a>
            </div>
            <ul className="list">
              {recentProducts.map((product) => (
                <li key={product.name}>
                  <div>
                    <strong>{product.name}</strong>
                    <p>{product.updated}</p>
                  </div>
                  <span className="status-pill">{product.status}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="panel">
            <div className="panel-header">
              <h2>Recent Messages</h2>
              <a href="#">Inbox</a>
            </div>
            <ul className="list">
              {recentMessages.map((message) => (
                <li key={message.subject}>
                  <div>
                    <strong>{message.sender}</strong>
                    <p>{message.subject}</p>
                  </div>
                  <span className="time-pill">{message.time}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="panel quick-actions-panel">
          <div className="panel-header">
            <h2>Quick Actions</h2>
          </div>
          <div className="actions-grid">
            {quickActions.map((action) => (
              <button key={action} className="action-btn">{action}</button>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

export default AdminDashboard;
