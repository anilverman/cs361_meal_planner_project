import { useEffect, useState } from 'react'
import { getRecipes, generatePlan, getWeekPlan } from '../api.js'

export default function Planner(){
  const [recipes, setRecipes] = useState([])
  const [weekStart, setWeekStart] = useState(new Date().toISOString().slice(0,10))
  const [picked, setPicked] = useState([])
  const [plan, setPlan] = useState([])

  useEffect(()=>{ getRecipes().then(setRecipes) },[])

  const makePlan = async ()=>{
    if(picked.length < 7){ alert('Pick at least 7 recipe IDs (can repeat)'); return }
    await generatePlan({ weekStart, recipeIds: picked })
    const rows = await getWeekPlan(weekStart)
    setPlan(rows)
  }

  return (
    <div>
      <label>Week start:&nbsp;
        <input type="date" value={weekStart} onChange={e=>setWeekStart(e.target.value)} />
      </label>

      <p>Select 7 recipes (you can click the same one multiple times to fill 7 slots):</p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {recipes.map(r => (
          <button key={r.id} onClick={()=>setPicked(p=>[...p, r.id])}>{r.title}</button>
        ))}
      </div>
      <p>Picked: {picked.map(id => (recipes.find(r => r.id === id)?.title || id)).join(', ')}</p>
      <button onClick={makePlan}>Generate Plan</button>

      {!!plan.length && (
        <div style={{marginTop:12}}>
          <h3>Current Week Plan</h3>
          <ol>
            {plan.map(row => <li key={row.day_index}>{row.title}</li>)}
          </ol>
        </div>
      )}
    </div>
  )
}