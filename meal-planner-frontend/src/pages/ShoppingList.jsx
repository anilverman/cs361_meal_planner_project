import { useState } from 'react'
import { getShoppingList } from '../api.js'

export default function ShoppingList(){
  const [weekStart, setWeekStart] = useState(new Date().toISOString().slice(0,10))
  const [items, setItems] = useState([])

  const load = async ()=> setItems(await getShoppingList(weekStart))

  return (
    <div>
      <label>Week start:&nbsp;
        <input type="date" value={weekStart} onChange={e=>setWeekStart(e.target.value)} />
      </label>
      <button onClick={load}>Load List</button>

      <ul>
        {items.map((i, idx)=> <li key={idx}>{i.name}: {i.total_qty} {i.unit}</li>)}
      </ul>
    </div>
  )
}