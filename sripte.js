const gameCount = document.querySelector("#game-count");
const reviewCount = document.querySelector("#review-count");
const searchForm = document.querySelector("#search-form");
const searchInput = document.querySelector("#game-search");
const searchMessage = document.querySelector("#search-message");
const gameList = document.querySelector("#game-list");

// Charger les statistiques depuis le backend
async function loadStatistics() {
    try {
        const response = await fetch("/api/stats");

        if (!response.ok) {
            throw new Error("Impossible de charger les statistiques");
        }

        const statistics = await response.json();

        gameCount.textContent = Number(statistics.gameCount).toLocaleString("fr-FR");
        reviewCount.textContent = Number(statistics.reviewCount).toLocaleString("fr-FR");
    } catch (error) {
        console.error(error);

        gameCount.textContent = "—";
        reviewCount.textContent = "—";
    }
}

// Rechercher des jeux via le backend
async function searchGames(query) {
    gameList.replaceChildren();
    searchMessage.textContent = "Recherche en cours...";

    try {
        const response = await fetch(
            `/api/games/search?q=${encodeURIComponent(query)}`
        );

        if (!response.ok) {
            throw new Error("La recherche a échoué");
        }

        const games = await response.json();

        if (!Array.isArray(games) || games.length === 0) {
            searchMessage.textContent = "Aucun jeu trouvé.";
            return;
        }

        searchMessage.textContent = `${games.length} jeu(x) trouvé(s).`;

        // Afficher chaque jeu reçu du backend
        for (const game of games) {
            const card = document.createElement("article");
            card.className = "game-card";

            // Image du jeu
            if (game.image) {
                const image = document.createElement("img");
                image.src = game.image;
                image.alt = `Jaquette de ${game.name}`;
                image.loading = "lazy";
                card.appendChild(image);
            }

            // Nom du jeu
            const name = document.createElement("h3");
            name.textContent = game.name;
            card.appendChild(name);

            // Note de la communauté
            const rating = document.createElement("p");

            if (game.averageRating !== null && game.averageRating !== undefined) {
                rating.textContent = `Note : ${Number(game.averageRating).toFixed(1)}/10`;
            } else {
                rating.textContent = "Pas encore noté";
            }

            card.appendChild(rating);

            // Nombre d'avis
            const reviews = document.createElement("p");
            reviews.textContent = `${game.reviewCount ?? 0} avis`;
            card.appendChild(reviews);

            gameList.appendChild(card);
        }
    } catch (error) {
        console.error(error);
        searchMessage.textContent =
            "Impossible de charger les jeux. Vérifie que le serveur fonctionne.";
    }
}

// Quand l'utilisateur lance une recherche
searchForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const query = searchInput.value.trim();

    if (!query) {
        searchMessage.textContent = "Entre le nom d'un jeu.";
        return;
    }

    searchGames(query);
});

// Charger les statistiques au démarrage
loadStatistics();