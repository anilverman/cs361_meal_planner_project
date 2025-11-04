import { NavLink, Routes, Route } from 'react-router-dom'
import Recipes from './pages/Recipes.jsx'
import Planner from './pages/Planner.jsx'
import ShoppingList from './pages/ShoppingList.jsx'

const linkStyle = ({ isActive }) => ({
  padding: '8px 12px',
  textDecoration: 'none',
  borderRadius: 8,
  background: isActive ? '#222' : '#eee',
  color: isActive ? '#fff' : '#222',
})

function NotFound(){
  return <div style={{padding:16}}>Not found</div>
}

export default function App(){
  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', padding: 16, maxWidth: 920, margin: '0 auto' }}>
      <h1>Meal Planner (MVP)</h1>

      <nav style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <NavLink to="/" style={linkStyle} end>Recipes</NavLink>
        <NavLink to="/planner" style={linkStyle}>Planner</NavLink>
        <NavLink to="/shopping" style={linkStyle}>Shopping List</NavLink>
      </nav>

      <Routes>
        <Route path="/" element={<Recipes/>} />
        <Route path="/planner" element={<Planner/>} />
        <Route path="/shopping" element={<ShoppingList/>} />
        <Route path="*" element={<NotFound/>} />
      </Routes>
    </div>
  )
}