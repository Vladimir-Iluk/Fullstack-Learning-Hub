/**
 * ═══════════════════════════════════════════════════════
 * Page: Router Guide — React Router v5 vs v6
 * Topic #4: Відмінності між React Router v5 та v6
 * ═══════════════════════════════════════════════════════
 */

import React from 'react';
import { motion } from 'framer-motion';

const comparisons = [
  {
    title: 'Маршрутизація',
    v5: `import { Switch, Route } from 'react-router-dom';

<Switch>
  <Route path="/about" component={About} />
  <Route exact path="/" component={Home} />
</Switch>`,
    v6: `import { Routes, Route } from 'react-router-dom';

<Routes>
  <Route path="/about" element={<About />} />
  <Route path="/" element={<Home />} />
</Routes>`,
    note: 'v6 замінює <Switch> на <Routes> і замість component={} використовує element={<JSX />}. Більше не потрібен exact — маршрути точні за замовчуванням.',
  },
  {
    title: 'Навігація',
    v5: `import { useHistory } from 'react-router-dom';

const history = useHistory();
history.push('/dashboard');
history.replace('/login');
history.goBack();`,
    v6: `import { useNavigate } from 'react-router-dom';

const navigate = useNavigate();
navigate('/dashboard');
navigate('/login', { replace: true });
navigate(-1);`,
    note: 'useHistory замінено на useNavigate. Замість .push() просто викликаємо navigate(). Для replace передаємо опцію.',
  },
  {
    title: 'Вкладені маршрути',
    v5: `// В батьківському компоненті:
<Route path="/courses/:id" component={CourseLayout} />

// В CourseLayout:
<Switch>
  <Route path="/courses/:id/info" component={Info} />
  <Route path="/courses/:id/quiz" component={Quiz} />
</Switch>`,
    v6: `// В App.tsx:
<Route path="/courses/:id" element={<CourseLayout />}>
  <Route path="info" element={<Info />} />
  <Route path="quiz" element={<Quiz />} />
</Route>

// В CourseLayout:
import { Outlet } from 'react-router-dom';
<Outlet /> // ← рендерить дочірній маршрут`,
    note: 'v6 дозволяє описувати вкладені маршрути декларативно в одному місці. <Outlet> — це слот для рендерингу дочірнього маршруту.',
  },
  {
    title: 'Параметри URL',
    v5: `import { useParams } from 'react-router-dom';

// Тип any, потрібна ручна типізація
const { id } = useParams();`,
    v6: `import { useParams } from 'react-router-dom';

// TypeScript generic для типізації
const { id } = useParams<{ id: string }>();`,
    note: 'В обох версіях useParams працює однаково, але v6 має кращу TypeScript підтримку.',
  },
  {
    title: 'Активне посилання',
    v5: `import { NavLink } from 'react-router-dom';

<NavLink
  to="/about"
  activeClassName="active"
  activeStyle={{ fontWeight: 'bold' }}
>
  About
</NavLink>`,
    v6: `import { NavLink } from 'react-router-dom';

<NavLink
  to="/about"
  className={({ isActive }) =>
    isActive ? 'active' : ''
  }
  style={({ isActive }) =>
    isActive ? { fontWeight: 'bold' } : {}
  }
>
  About
</NavLink>`,
    note: 'v6 використовує render-функцію для className та style, що дає більше гнучкості. activeClassName видалений.',
  },
];

const RouterGuidePage: React.FC = () => {
  return (
    <motion.div
      className="container section"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ textAlign: 'center', marginBottom: '48px' }}
        >
          <span className="badge badge-primary" style={{ marginBottom: '16px', display: 'inline-block' }}>
            📖 Тема #4
          </span>
          <h1>React Router: v5 vs v6</h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '16px', marginTop: '12px', maxWidth: '600px', margin: '12px auto 0' }}>
            Інтерактивний гайд з порівнянням двох версій маршрутизатора.
            Весь цей додаток побудований на React Router v6.
          </p>
        </motion.div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          {comparisons.map((item, index) => (
            <motion.div
              key={item.title}
              className="glass-card"
              style={{ padding: '24px', overflow: 'hidden' }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '20px' }}>🔄</span> {item.title}
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                {/* v5 */}
                <div>
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px',
                  }}>
                    <span className="badge badge-warning">v5</span>
                    <span style={{ fontSize: '12px', color: 'var(--color-text-tertiary)' }}>Стара версія</span>
                  </div>
                  <pre style={{
                    background: 'rgba(244, 63, 94, 0.05)',
                    border: '1px solid rgba(244, 63, 94, 0.15)',
                    borderRadius: 'var(--radius-md)',
                    padding: '16px',
                    fontSize: '12px',
                    fontFamily: 'var(--font-mono)',
                    color: 'var(--color-text-secondary)',
                    overflow: 'auto',
                    lineHeight: 1.6,
                  }}>
                    {item.v5}
                  </pre>
                </div>

                {/* v6 */}
                <div>
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px',
                  }}>
                    <span className="badge badge-success">v6</span>
                    <span style={{ fontSize: '12px', color: 'var(--color-text-tertiary)' }}>Нова версія ✨</span>
                  </div>
                  <pre style={{
                    background: 'rgba(16, 185, 129, 0.05)',
                    border: '1px solid rgba(16, 185, 129, 0.15)',
                    borderRadius: 'var(--radius-md)',
                    padding: '16px',
                    fontSize: '12px',
                    fontFamily: 'var(--font-mono)',
                    color: 'var(--color-text-primary)',
                    overflow: 'auto',
                    lineHeight: 1.6,
                  }}>
                    {item.v6}
                  </pre>
                </div>
              </div>

              <div style={{
                background: 'rgba(99, 102, 241, 0.08)',
                borderRadius: 'var(--radius-md)',
                padding: '12px 16px',
                fontSize: '13px',
                color: 'var(--color-text-accent)',
                lineHeight: 1.6,
              }}>
                💡 {item.note}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default RouterGuidePage;
