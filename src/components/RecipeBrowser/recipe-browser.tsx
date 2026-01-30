import Recipe from '../Recipe/recipe';
import './recipe-browser-styles.scss'

import { useEffect, useRef, useState } from 'react'
import { useSearchParams } from "react-router";
import { recipeData, searchParams } from '../../App';

import recipesJson from '../../data/recipes_Vanilla.json'

function RecipeBrowser({ params, setSelectedRecipe }: { params: searchParams, setSelectedRecipe: (newRecipe: recipeData | undefined) => void }) {
  const [recipeDatas] = useState<recipeData[]>(recipesJson as recipeData[]);
  const [filteredRecipeDatas, setFilteredRecipeDatas] = useState<recipeData[]>(recipeDatas);

  const [searchParams, setSearchParams] = useSearchParams();

  const [pageSize] = useState<number>(100);
  const [pageCount, setPageCount] = useState<number>(Math.ceil(recipeDatas.length / pageSize));
  const [pageNumber, setPageNumber] = useState<number>(() => {
    const page = searchParams.get("page");
    const pageId = page ? parseInt(page) : 0;
    return pageId >= 0 && pageId <= Math.ceil(recipeDatas.length / pageSize) - 1 ? pageId : 0;
  });
 
  const browserRef = useRef<HTMLDivElement | null>(null);

  // Load selection from search params on mount
  useEffect(() => {
    const selectedId = searchParams.get("select");
    if(selectedId) {
      const selectedRecipe = recipeDatas.find(recipe => parseInt(selectedId) ===  recipe.id);
      if(selectedRecipe) {
        setSelectedRecipe(selectedRecipe);
      }
      else {
        removeQueryParam("select"); // Clear garbage query parameter
      }
    }
  }, []);

  // Reset to page 1 when search changes
  useEffect(() => {
    filterRecipes();
    resetScroll();

    // Reset page only if the new filtered recipes don't include the current page
    if (pageNumber > pageCount - 1) {
      setPageNumber(0);
    }
  }, [params]);

  // Scroll to the top when the page is changed
  useEffect(() => {
    resetScroll();

    console.log(pageNumber);
    if(pageNumber != 0) {
      setQueryParam("page", pageNumber.toString());
    }
    else {
      removeQueryParam("page");
    }
  }, [pageNumber]);

  return (
    <div className='recipe-browser'>
      <div className='recipes-container' ref={browserRef} >
        {filteredRecipeDatas.slice(pageSize * pageNumber, pageSize * (pageNumber + 1)).map(recipeData => (
          <Recipe key={recipeData.id} recipeData={recipeData} onClick={() => {
            setSelectedRecipe(recipeData);
            setQueryParam("select", recipeData.id.toString());
          }} />
        ))}
      </div>

      <div className='page-selector'>
        <button onClick={() => setPageNumber(pageNumber - 1)} disabled={pageNumber <= 0} >Previous</button>
        <span>Page {pageNumber + 1}</span>
        <button onClick={() => setPageNumber(pageNumber + 1)} disabled={pageNumber >= pageCount - 1} >Next</button>
      </div>
    </div>
  )


  function filterRecipes() {
    const query = params.query.toLowerCase().trim();
    
    setFilteredRecipeDatas(recipeDatas.filter((data, index) => {
      if(!params.showAlternatives && index > 0 && data.result.name == recipeDatas[index - 1].result.name) {
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
    }));

    setPageCount(Math.ceil(recipeDatas.length / pageSize));
  }

  function resetScroll() {
    if(browserRef.current && browserRef.current.firstChild) {
      (browserRef.current.firstChild as HTMLElement).scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  function setQueryParam(name : string, value : string) {
    const params = new URLSearchParams(searchParams);
    params.set(name, value);
    setSearchParams(params);
  }

  function removeQueryParam(name : string) {
    const params = new URLSearchParams(searchParams);
    params.delete(name);
    setSearchParams(params);
  }
}

export default RecipeBrowser