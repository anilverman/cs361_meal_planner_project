import { useEffect, useMemo, useState } from 'react'
import { getRecipes, getWeekPlan, savePlan } from '../api.js'

const dayNames = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun']
const slotNames = ['Breakfast','Lunch','Dinner']

export default function Planner(){
  const [recipes, setRecipes] = useState([])
  const [weekStart, setWeekStart] = useState(new Date().toISOString().slice(0,10))
  // plan[day][slot] = recipe_id | ''
  const [plan, setPlan] = useState(() => Array.from({length:7},()=>Array(3).fill('')))
  const recipeOptions = useMemo(()=> [{id:'', title:'— Select —'}, ...recipes], [recipes])

  useEffect(()=>{ getRecipes().then(setRecipes) },[])
  useEffect(()=>{ (async ()=>{
    const rows = await getWeekPlan(weekStart)
    // reset grid
    const grid = Array.from({length:7},()=>Array(3).fill(''))
    for (const r of rows) {
      grid[r.day_index][r.meal_slot] = r.recipe_id
    }
    setPlan(grid)
  })() },[weekStart])

  const setCell = (day, slot, value) => {
    setPlan(prev => prev.map((row,i)=> i!==day ? row : row.map((v,j)=> j===slot ? value : v)))
  }

  const onSave = async () => {
    const entries = []
    for (let d=0; d<7; d++) {
      for (let s=0; s<3; s++) {
        const recipe_id = plan[d][s]
        if (recipe_id) entries.push({ day_index: d, meal_slot: s, recipe_id })
      }
    }
    await savePlan({ weekStart, entries })
    alert('Plan saved')
  }

  return (
    
    <div>
      <div>
        <h4>Instructions: Add recipes, then create a meal plan. Now you are able to generate a shopping list! </h4>
      </div>

      <label>Week start:&nbsp;
        <input type="date" value={weekStart} onChange={e=>setWeekStart(e.target.value)} />
      </label>

      <div style={{overflowX:'auto', marginTop:12}}>
        <table style={{ borderCollapse:'collapse', minWidth:700 }}>
          <thead>
            <tr>
              <th style={{textAlign:'left', padding:8}}>Day</th>
              {slotNames.map(s=> (
                <th key={s} style={{textAlign:'left', padding:8}}>{s}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {dayNames.map((dName, dIdx)=> (
              <tr key={dName}>
                <td style={{padding:8, fontWeight:600}}>{dName}</td>
                {slotNames.map((_, sIdx)=> (
                  <td key={sIdx} style={{padding:8}}>
                    <select value={plan[dIdx][sIdx]}
                            onChange={e=>setCell(dIdx, sIdx, e.target.value ? Number(e.target.value) : '')}
                            style={{padding:6, minWidth:180}}>
                      {recipeOptions.map(r => (
                        <option value={r.id} key={String(r.id)}>{r.title}</option>
                      ))}
                    </select>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{marginTop:12}}>
        <button onClick={onSave}>Save Plan</button>
      </div>
      <div style={{marginTop:12}}>
        <button>Randomly Generate Plan</button>
      </div>
    </div>
  )
}