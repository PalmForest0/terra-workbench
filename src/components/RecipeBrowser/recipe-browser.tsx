import Recipe from '../Recipe/recipe';
import './recipe-browser-styles.scss'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useSearchParams } from "react-router";
import { recipeData, searchParams } from '../../App';

import recipesJson from '../../data/recipes_Vanilla.json'

interface RecipeBrowserProps {
  params: searchParams;
  setSelectedRecipe: (newRecipe: recipeData | undefined) => void;
}

function RecipeBrowser({ params, setSelectedRecipe }: RecipeBrowserProps) {
  // Load all recipes initiallly from JSON file
  const recipes = useMemo<recipeData[]>(() => recipesJson as recipeData[], []);
  
  // Derive filtered recipes from search params
  const filteredRecipes = useMemo<recipeData[]>(() => {
    const query = params.query.toLowerCase().trim();

    return recipes.filter((data, index) => {
      if(!params.showAlternatives && index > 0 && data.result.name == recipes[index - 1].result.name) {
        return false;
      }

      if(params.query.trim() === "") {
        return true;
      }
      
      if(data.result.name.toLowerCase().includes(query)) {
        return true;
      }

      if(params.searchIngredients) {
        for (let i = 0; i < data.ingredients.length; i++) {
          const ingredient = data.ingredients[i];
              
          if(ingredient.name.toLowerCase().includes(query)) {
            return true;
          }
        }
      }

      return false;
    });
  }, [recipes, params]);
  
  // Reset page when filtered recipes change
  useEffect(() => {
    setPageIndex(0);
    resetScroll();
  }, [filteredRecipes]);

  // Update the selected recipe when query params change
  const [queryParams, setQueryParams] = useSearchParams();
  useEffect(() => {
    const selectedId = queryParams.get("selected");

    if(selectedId) {
      const selectedRecipe = recipes.find(recipe => parseInt(selectedId) ===  recipe.id);
      if(selectedRecipe) {
        setSelectedRecipe(selectedRecipe);
      }
      else {
        setQueryParams({}); // Clear garbage query parameter
      }
    }
  }, [queryParams]);

  const pageSize = 100;
  const pageCount = useMemo(() => Math.ceil(filteredRecipes.length / pageSize), [filteredRecipes]);
  const [pageIndex, setPageIndex] = useState(0);

  // Use a DOM element reference to forcefully scroll to the top
  const browserRef = useRef<HTMLDivElement | null>(null);
  const resetScroll = () => {
    if(browserRef.current && browserRef.current.firstChild) {
      (browserRef.current.firstChild as HTMLElement).scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className='recipe-browser'>
      <div className='recipes-container' ref={browserRef} >
        {filteredRecipes.slice(pageSize * pageIndex, pageSize * (pageIndex + 1)).map(recipeData => (
          <Recipe key={recipeData.id} recipeData={recipeData} onClick={() => {
            setSelectedRecipe(recipeData);
            setQueryParams({ selected: recipeData.id.toString() });
          }} />
        ))}
      </div>

      <div className='page-selector'>
        <button onClick={() => setPageIndex(pageIndex - 1)} disabled={pageIndex <= 0} >Previous</button>
        <span>Page {pageIndex + 1}</span>
        <button onClick={() => setPageIndex(pageIndex + 1)} disabled={pageIndex >= pageCount - 1} >Next</button>
      </div>
    </div>
  )
}

export default RecipeBrowser