// RECIPE DATA

const recipes = {
    pasta: {
        title: "Creamy Pasta 🍝",
        ingredients: [
            "200g pasta",
            "1 cup cream",
            "2 cloves garlic",
            "Parmesan cheese",
            "Salt and pepper"
        ],
        instructions:
            "Cook the pasta. Prepare the creamy garlic sauce in a pan. Mix the pasta with the sauce and add Parmesan cheese."
    },

    cake: {
        title: "Chocolate Cake 🍰",
        ingredients: [
            "2 cups flour",
            "1 cup sugar",
            "2 eggs",
            "1/2 cup cocoa powder",
            "1 cup milk"
        ],
        instructions:
            "Mix the ingredients in a bowl. Pour the mixture into a cake pan and bake until ready."
    },

    salad: {
        title: "Fresh Garden Salad 🥗",
        ingredients: [
            "Lettuce",
            "2 tomatoes",
            "1 cucumber",
            "Olive oil",
            "Lemon juice"
        ],
        instructions:
            "Wash and chop the vegetables. Mix them in a bowl. Add olive oil and lemon juice."
    },

    strawberry: {
        title: "Strawberry Cake 🍓",
        ingredients: [
            "2 cups flour",
            "1 cup sugar",
            "2 eggs",
            "Fresh strawberries",
            "Whipped cream"
        ],
        instructions:
            "Prepare the cake mixture and bake it. Let it cool, then decorate with whipped cream and fresh strawberries."
    }
};


// OPEN RECIPE DETAILS

function showRecipe(recipe) {
    const selectedRecipe = recipes[recipe];

    if (!selectedRecipe) return;

    document.getElementById("modalTitle").textContent =
        selectedRecipe.title;

    const ingredientList =
        document.getElementById("modalIngredients");

    ingredientList.innerHTML = "";

    selectedRecipe.ingredients.forEach(function(item) {
        const li = document.createElement("li");
        li.textContent = item;
        ingredientList.appendChild(li);
    });

    document.getElementById("modalInstructions").textContent =
        selectedRecipe.instructions;

    document.getElementById("recipeModal").classList.add("show");
}


// CLOSE RECIPE DETAILS

function closeRecipe() {
    document.getElementById("recipeModal").classList.remove("show");
}

document.getElementById("recipeModal").addEventListener("click", function(event) {
    if (event.target === this) {
        closeRecipe();
    }
});


// FAVORITES

function toggleFavorite(button) {
    const card = button.closest(".recipe-card");
    const name = card.querySelector("h3").textContent;

    button.classList.toggle("liked");

    if (button.classList.contains("liked")) {
        button.innerHTML = "&#9829;";
        button.textContent = "♥";
    } else {
        button.textContent = "♡";
    }

    updateFavorites();
}

function updateFavorites() {
    const favoriteList = document.getElementById("favoriteList");
    const favoriteButtons = document.querySelectorAll(".favorite-btn");

    favoriteList.innerHTML = "";

    let count = 0;

    favoriteButtons.forEach(function(button) {
        if (button.classList.contains("liked")) {
            count++;

            const card = button.closest(".recipe-card");
            const name = card.querySelector("h3").textContent;

            const item = document.createElement("div");
            item.className = "favorite-item";
            item.textContent = "♥ " + name;

            favoriteList.appendChild(item);
        }
    });

    if (count === 0) {
        favoriteList.innerHTML =
            '<p id="emptyFavorites">You haven\'t added any favorites yet. 🍓</p>';
    }
}


// CATEGORY FILTER

let activeCategory = "all";

function filterRecipes(category, button) {
    activeCategory = category;

    document.querySelectorAll(".category-btn").forEach(function(btn) {
        btn.classList.remove("active");
    });

    button.classList.add("active");

    applyFilters();
}


// SEARCH

document.getElementById("searchInput").addEventListener("input", function() {
    applyFilters();
});


// APPLY SEARCH AND CATEGORY FILTER TOGETHER

function applyFilters() {
    const searchText = document
        .getElementById("searchInput")
        .value.toLowerCase();

    const cards = document.querySelectorAll(".recipe-card");

    let visibleCount = 0;

    cards.forEach(function(card) {
        const category = card.dataset.category;
        const name = card.querySelector("h3").textContent.toLowerCase();

        const matchesCategory =
            activeCategory === "all" || category === activeCategory;

        const matchesSearch = name.includes(searchText);

        if (matchesCategory && matchesSearch) {
            card.style.display = "block";
            visibleCount++;
        } else {
            card.style.display = "none";
        }
    });

    document.getElementById("noResults").style.display =
        visibleCount === 0 ? "block" : "none";
}
/* ADD NEW RECIPE */

document.getElementById("recipeForm").addEventListener("submit", function(event) {

    event.preventDefault();

    const name = document.getElementById("newRecipeName").value.trim();
    const category = document.getElementById("newRecipeCategory").value;
    const description = document.getElementById("newRecipeDescription").value.trim();
    const ingredients = document.getElementById("newRecipeIngredients").value;
    const instructions = document.getElementById("newRecipeInstructions").value.trim();

    if (!name || !category || !description || !ingredients.trim() || !instructions) {
        return;
    }

    const card = document.createElement("div");
    card.className = "recipe-card";
    card.dataset.category = category;

    const recipeId = "custom" + Date.now();

    recipes[recipeId] = {
        title: name,
        ingredients: ingredients.split(",").map(item => item.trim()).filter(Boolean),
        instructions: instructions
    };

    const categoryName = {
        main: "🍝 Main Dish",
        dessert: "🍰 Dessert",
        healthy: "🥗 Healthy"
    };

    card.innerHTML = `
        <div class="new-recipe-placeholder">🍓</div>
        <div class="recipe-info">
            <span>${categoryName[category]}</span>
            <h3></h3>
            <p></p>
            <button class="recipe-button">View Recipe &#9825;</button>
            <button class="favorite-btn">&#9825;</button>
        </div>
    `;

    card.querySelector("h3").textContent = name;
    card.querySelector(".recipe-info p").textContent = description;

    card.querySelector(".recipe-button").addEventListener("click", function() {
        showRecipe(recipeId);
    });

    card.querySelector(".favorite-btn").addEventListener("click", function() {
        toggleFavorite(this);
    });

    document.getElementById("recipeContainer").appendChild(card);

    this.reset();
    applyFilters();

    alert("Your recipe has been added! ♡");
});