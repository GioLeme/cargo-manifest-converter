import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import AWB from "./pages/AWB"
import logo from "./assets/logo.png"


const ULD = () => <div><h2>Manifest by ULD</h2></div>;

function App() {
  return (
    <div className="App">
      <Router>
        <header className="header" >
          <div className="logo" >
            <img src={logo} alt="logo" className="logo-image" />
            <h1>Import JIT Handling</h1>
          </div>
          <nav className="header__nav">
            <Link to="/AWB" className="header__nav_AWB">Manifest by AWB</Link>
            <Link to="/ULD" className="header__nav_ULD">Manifest by ULD</Link>
          </nav>
        </header>

        <Routes>
          <Route path="/AWB" element={<AWB />} />
          <Route path="/ULD" element={<ULD />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
