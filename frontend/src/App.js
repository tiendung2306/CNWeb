import logo from './logo.svg';
import './App.css';
import Headers from './components/Headers';
import Home from './page/home/Home';
import AdminPage from './page/adminPage/AdminPage.jsx';

function App() {
  return (
    <div className="App">
      <Headers />
      {/* <Home /> */}
      <AdminPage />
    </div>
  );
}

export default App;
