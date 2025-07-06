// App.tsx
import { Outlet } from 'react-router-dom';

function App() {
  return (
    <div>
      <h1>Görev Yönetim Sistemi</h1>
      <Outlet />
    </div>
  );
}

export default App;
