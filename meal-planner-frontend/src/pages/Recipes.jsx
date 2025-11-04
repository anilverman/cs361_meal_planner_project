import { useEffect, useState } from 'react'
import { getRecipes, getRecipe, createRecipe, updateRecipe, deleteRecipe } from '../api.js'

export default function Recipes(){
  const [recipes, setRecipes] = useState([])
  const [selectedId, setSelectedId] = useState(null)
  const [title, setTitle] = useState('')
  const [instructions, setInstructions] = useState('')
  const [ingredients, setIngredients] = useState([{ name: '', qty: 1, unit: 'each' }])
  const [loading, setLoading] = useState(false)

  const refresh = () => getRecipes().then(setRecipes)
  useEffect(() => { refresh() }, [])

  const resetForm = () => {
    setSelectedId(null)
    setTitle('')
    setInstructions('')
    setIngredients([{ name: '', qty: 1, unit: 'each' }])
  }

  const loadForEdit = async (id) => {
    setLoading(true)
    try {
      const r = await getRecipe(id)
      setSelectedId(r.id)
      setTitle(r.title || '')
      setInstructions(r.instructions || '')
      setIngredients(r.ingredients?.length ? r.ingredients : [{ name: '', qty: 1, unit: 'each' }])
    } finally {
      setLoading(false)
    }
  }

  const submit = async (e) => {
    e.preventDefault()
    const payload = { title, instructions, ingredients: ingredients.filter(i=>i.name.trim()) }
    if(!payload.title.trim()) return alert('Title required')
    setLoading(true)
    try {
      if (selectedId) {
        await updateRecipe(selectedId, payload)
      } else {
        await createRecipe(payload)
      }
      await refresh()
      resetForm()
    } finally { setLoading(false) }
  }

  const remove = async () => {
    if(!selectedId) return
    if(!confirm('Delete this recipe?')) return
    setLoading(true)
    try {
      await deleteRecipe(selectedId)
      await refresh()
      resetForm()
    } finally { setLoading(false) }
  }

  const updateIng = (idx, field, value) => {
    setIngredients(prev => prev.map((row,i) => i===idx ? { ...row, [field]: field==='qty' ? Number(value) : value } : row))
  }
  const addRow = () => setIngredients(prev => [...prev, { name:'', qty:1, unit:'each' }])
  const removeRow = (idx) => setIngredients(prev => prev.filter((_,i)=>i!==idx))

  return (
    <div>
      <div style={{ marginBottom:12 }}>
        <h4>Create meal plans, add recipes, generate grocery lists, and more coming soon!</h4>
      </div>
      <div style={{ display:'flex', gap:16 }}>
        <div style={{ flex:1 }}>
          <h3>All Recipes</h3>
          <ul>
            {recipes.map(r => (
              <li key={r.id}>
                <button onClick={()=>loadForEdit(r.id)} style={{all:'unset', cursor:'pointer', color:'#06c'}}>{r.title}</button>
              </li>
            ))}
          </ul>
        </div>

        <div style={{ flex:2 }}>
          <h3>{selectedId ? 'Edit Recipe' : 'New Recipe'}</h3>
          <form onSubmit={submit} style={{ display:'grid', gap:8, maxWidth:620 }}>
            <input placeholder="Recipe title" value={title} onChange={e=>setTitle(e.target.value)} />
            <textarea rows={4} placeholder="Instructions (optional)" value={instructions} onChange={e=>setInstructions(e.target.value)} />

            <div>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                <strong>Ingredients</strong>
                <button type="button" onClick={addRow}>+ Add row</button>
              </div>
              {ingredients.map((ing, idx) => (
                <div key={idx} style={{ display:'grid', gridTemplateColumns:'1fr 120px 120px 80px', gap:8, marginTop:8 }}>
                  <input placeholder="name" value={ing.name} onChange={e=>updateIng(idx,'name',e.target.value)} />
                  <input type="number" step="0.01" value={ing.qty} onChange={e=>updateIng(idx,'qty',e.target.value)} />
                  <input placeholder="unit" value={ing.unit} onChange={e=>updateIng(idx,'unit',e.target.value)} />
                  <button type="button" onClick={()=>removeRow(idx)}>Remove</button>
                </div>
              ))}
            </div>

            <div style={{ display:'flex', gap:8 }}>
              <button type="submit" disabled={loading}>{selectedId ? 'Save Changes' : 'Add Recipe'}</button>
              <button type="button" onClick={resetForm}>New</button>
              {selectedId && <button type="button" onClick={remove} style={{ color:'#b00' }}>Delete</button>}
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
