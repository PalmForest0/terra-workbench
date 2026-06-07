import "./recipe-details-styles.scss";

import { recipeData } from "../../App";
import ItemListElement from "../ItemListElement/item-list-element";

function RecipeDetails({ selectedRecipe }: { selectedRecipe: recipeData }) {
  return (
    <div className="recipe-details-view">
      <h2>{selectedRecipe.result.name}</h2>
      <img src={`${import.meta.env.BASE_URL}/images/items/${selectedRecipe.result.name}.png`} className="result-image" />
      <span className="result-tooltip">{selectedRecipe.result.tooltip}</span>

      <div className="workstation-container">
        {selectedRecipe.workstations.map((workstation) => (
          <img
            src={`${import.meta.env.BASE_URL}/images/items/${workstation.name}.png`}
            className="workstation-image"
            title={workstation.tooltip}
            onError={(e) => {
              (e.target as HTMLImageElement).onerror = null;
              (e.target as HTMLImageElement).src = "./images/undefined.gif";
            }}
          />
        ))}
      </div>

      <div className="item-container">
        {selectedRecipe.ingredients.map((ingredient) => (
          <ItemListElement itemData={ingredient} key={ingredient.name} />
        ))}
      </div>
    </div>
  );
}

export default RecipeDetails;
