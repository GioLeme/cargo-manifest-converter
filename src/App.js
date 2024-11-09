import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import AWB from "./pages/AWB"
import ULD from "./pages/ULD"
import logo from "./assets/logo.png"


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
            <NavLink
              to="/AWB"
              className={({ isActive }) =>
                isActive ? 'header__nav_AWB active' : 'header__nav_AWB'
              }
            >
              Convert Manifest by AWB
            </NavLink>
            <NavLink
              to="/ULD"
              className={({ isActive }) =>
                isActive ? 'header__nav_ULD active' : 'header__nav_ULD'
              }
            >
              CrossDocking
            </NavLink>
          </nav>
        </header>

        <Routes>
          <Route path="/" element={<AWB />} />
          <Route path="/AWB" element={<AWB />} />
          <Route path="/ULD" element={<ULD />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
