import './styles/App.scss';
import "./styles/theme.scss";

import { useState } from 'react';

import Sidebar from './components/Sidebar/sidebar';
import SearchBar from './components/SearchBar/search-bar';
import RecipeBrowser from './components/RecipeBrowser/recipe-browser';

export type recipeData = { result: itemData, ingredients: itemData[], workstations: itemData[], id: number }
export type itemData = { name: string, tooltip: string, quantity: number }
export type searchParams = { query: string, searchIngredients: boolean, showAlternatives: boolean }

function App() {
  const [selectedRecipe, setSelectedRecipe] = useState<recipeData>();
  const [searchParams, setSearchParams] = useState<searchParams>({ query: "", searchIngredients: false, showAlternatives: false });
  
  return (
    <>
      <div className='left-side'>
        <div className='header'>
          <img src='./images/icon.png'/>
          <h1>TerraWorkbench</h1>
        </div>

        <SearchBar paramsChanged={(params: searchParams) => {setSearchParams(params)}}/>
        <RecipeBrowser params={searchParams} setSelectedRecipe={setSelectedRecipe} />
      </div>

      <Sidebar selectedRecipe={selectedRecipe} />
    </>
  )
}

export default App