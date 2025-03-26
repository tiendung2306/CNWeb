import logo from './logo.svg';
import './App.css';
import Headers from './components/Headers';
import Home from './page/home/Home';
import AdminPage from './page/adminPage/AdminPage.jsx';
import OrderPage from './page/orderPage/OrderPage.jsx';

function App() {
  return (
    <div className="App">
      <Headers />
      {/* <Home /> */}
      {/* <AdminPage /> */}
      <OrderPage />
    </div>
  );
}

export default App;
