import React, { useState } from "react";
import ingredients from "../ingredients.json";
import Poio2 from "../assets/poio2.png";
import Table from "../components/Table";
import Modal from "../components/Modal";
import AlertModal from "../components/AlertModal";

const Home = () => {
  const [page, setPage] = useState(1);
  const [searchText, setSearchText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [ingredientsList, setIngredientsList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [recipeTitle, setRecipeTitle] = useState("");
  const [recipeSteps, setRecipeSteps] = useState("");
  const [ingredientsBackup, setingredientsBackup] = useState([]);

  const handleSearchInputChange = (event) => {
    setSearchText(event.target.value);
  };

  const handleCategorySelectChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  const applyFilter = (ingredient) => {
    const textFilter =
      !searchText ||
      ingredient.name.toLowerCase().includes(searchText.toLowerCase());
    const categoryFilter =
      !selectedCategory || ingredient.category === selectedCategory;
    return textFilter && categoryFilter;
  };

  const filteredIngredients = ingredients.filter(applyFilter);

  const handleIngredientSelect = (ingredientName) => {
    const checkbox = document.getElementById(ingredientName);
    if (checkbox.checked) {
      checkbox.setAttribute("checked", "checked");
      setIngredientsList((prevIngredientsList) => {
        const newIngredientsList = [...prevIngredientsList, checkbox.value];
        return Array.from(new Set(newIngredientsList));
      });
    } else {
      checkbox.removeAttribute("checked");
      setIngredientsList((prevIngredientsList) => {
        return prevIngredientsList.filter(
          (ingredient) => ingredient !== checkbox.value
        );
      });
    }
  };

  async function generateRecipe() {
    if (ingredientsList.length > 2) {
      setIsLoading(true);
      setingredientsBackup(ingredientsList);
      document.getElementById("viewrecipe").showModal();
      const response = await fetch("http://localhost:5000/generateTitle", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(ingredientsList),
      });

      const data = await response.text();
      setRecipeTitle(data);

      const responseRecipe = await fetch(
        "http://localhost:5000/generateRecipe",
        {
          method: "POST",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify(ingredientsList),
        }
      );

      const dataRecipe = await responseRecipe.text();
      setRecipeSteps(dataRecipe);

      ingredientsList.forEach((ingredient) => {
        const checkbox = document.getElementById(ingredient);
        if (checkbox) {
          checkbox.checked = false;
        }
      });
      document.getElementById("viewrecipe").showModal();
      setIsLoading(false);
      setIngredientsList([]);
    } else {
      document.getElementById("alertmodal").showModal();
    }
  }

  return (
    <div className="hero min-h-screen bg-base-100" data-theme="business">
      <div className="hero-content flex-col lg:flex-row space-x-16">
        <img
          src={Poio2}
          alt="logo"
          className="max-w-sm rounded-lg shadow-2xl"
        />
        <div>
          <h1 className="text-4xl font-bold text-center p-4">
            Recipe Generator
          </h1>
          <div className="flex space-x-10 py-4">
            <div className="form-control">
              <input
                type="text"
                placeholder="Search"
                className="input input-bordered w-auto md:w-auto"
                value={searchText}
                onChange={handleSearchInputChange}
              />
            </div>
            <select
              className="select select-bordered w-full max-w-xs"
              value={selectedCategory}
              onChange={handleCategorySelectChange}
            >
              <option value="">Select the category</option>
              {[
                ...new Set(
                  ingredients.map((ingredient) => ingredient.category)
                ),
              ].map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
          <Table
            data={filteredIngredients.slice(page * 6 - 6, page * 6)}
            onIngredientSelect={handleIngredientSelect}
          />
          <div className="justify-center content-center flex py-3 space-x-10">
            <button
              className="btn btn-primary"
              onClick={() => generateRecipe()}
            >
              Generate Recipe
            </button>
            <Modal
              ingredients={ingredientsBackup}
              title={recipeTitle}
              steps={recipeSteps}
              isLoading={isLoading}
            />
            <AlertModal />
            <div className="join">
              <button
                className="join-item btn"
                onClick={() => {
                  page > 1 && setPage(page - 1);
                }}
              >
                «
              </button>
              <button className="join-item btn">Page {page}</button>
              <button
                className="join-item btn"
                onClick={() => {
                  page < 11 && setPage(page + 1);
                }}
              >
                »
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
