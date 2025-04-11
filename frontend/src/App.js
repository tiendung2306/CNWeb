import logo from './logo.svg';
import './App.css';
import Headers from './components/Headers';
import Home from './page/home/Home';
import AdminPage from './page/adminPage/AdminPage.jsx';
import OrderPage from './page/orderPage/OrderPage.jsx';
import ListUserOrder from './page/listUserOrder/ListUserOrder.jsx';
import AdminOrderList from './page/adminOrderList/AdminOrderList.jsx';
import MenuManager from './page/menuManager/MenuManager.jsx';

function App() {
  return (
    <div className="App">
      {/* <Headers /> */}
      {/* <Home /> */}
      {/* <AdminPage /> */}
      {/* <OrderPage /> */}
      {/* <ListUserOrder /> */}
      <MenuManager />
      {/* <AdminOrderList /> */}
      {/* <img src={logo} className="App-logo" alt="logo" /> */}
    </div>
  );
}

export default App;
