import { useEffect, useState } from 'react'
import { getRecipes, createRecipe } from '../api.js'

export default function Recipes(){
  const [recipes, setRecipes] = useState([])
  const [title, setTitle] = useState('')
  const [ingredients, setIngredients] = useState([{ name: '', qty: 1, unit: 'each' }])

  useEffect(() => { getRecipes().then(setRecipes) }, [])

  const add = async (e) => {
    e.preventDefault()
    if(!title.trim()) return
    const payload = { title, ingredients }
    await createRecipe(payload)
    setTitle('')
    setIngredients([{ name: '', qty: 1, unit: 'each' }])
    getRecipes().then(setRecipes)
  }

  return (
    <div>
      <ul>
        {recipes.map(r => <li key={r.id}>{r.title}</li>)}
      </ul>

      <form onSubmit={add} style={{ display: 'grid', gap: 8, maxWidth: 520 }}>
        <input placeholder="Recipe title" value={title} onChange={e=>setTitle(e.target.value)} />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 100px 100px', gap: 8 }}>
          <input placeholder="Ingredient name" value={ingredients[0].name} onChange={e=>setIngredients([{...ingredients[0], name:e.target.value}])} />
          <input type="number" step="0.01" value={ingredients[0].qty} onChange={e=>setIngredients([{...ingredients[0], qty:+e.target.value}])} />
          <input placeholder="unit" value={ingredients[0].unit} onChange={e=>setIngredients([{...ingredients[0], unit:e.target.value}])} />
        </div>
        <button>Add Recipe</button>
      </form>
    </div>
  )
}