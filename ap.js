let hp2Current;
let hp2Max;
let enemyName;
let obrona2;
let enemyAttacks = [];
let canAttack = true;
let hp1Current;
let hp1Max;
let obrona1;
let userPokemonName;

const typeColors = {
    grass: 'green',
    fire: 'orange',
    water: 'blue',
    electric: 'yellow',
    ice: 'lightblue',
    fighting: 'brown',
    poison: 'purple',
    ground: 'sandybrown',
    flying: 'skyblue',
    psychic: 'pink',
    bug: 'limegreen',
    rock: 'gray',
    ghost: 'indigo',
    dragon: 'darkblue',
    dark: 'black',
    steel: 'silver',
    fairy: 'lightpink'
};

function isBrightColor(color) {
    if (!color) return false;
    const rgb = color.match(/\d+/g);
    if (!rgb) return false;
    const brightness = Math.sqrt(
        0.299 * (rgb[0] * rgb[0]) +
        0.587 * (rgb[1] * rgb[1]) +
        0.114 * (rgb[2] * rgb[2])
    );
    return brightness > 200;
}

function start() {
    const legendarne = [144, 145, 146, 150, 151, 243, 244, 245, 249, 250, 251, 377, 378, 379, 380, 381, 382, 383, 384, 385, 386, 480, 481, 482, 483, 484, 485, 486, 487, 488, 489, 490, 491, 492, 493, 494, 638, 639, 640, 641, 642, 643, 644, 645, 646, 647];

    let pokemonId1 = Math.floor(Math.random() * 649) + 1;
    let pokemonId2 = Math.floor(Math.random() * 649) + 1;

    Promise.all([
        fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId1}`).then(response => response.json()),
        fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId2}`).then(response => response.json())
    ])
    .then(([pokemon1, pokemon2]) => {
        let hp1 = pokemon1.stats.find(stat => stat.stat.name === 'hp').base_stat;
        let hp2 = pokemon2.stats.find(stat => stat.stat.name === 'hp').base_stat;
        obrona1 = pokemon1.stats.find(stat => stat.stat.name === 'defense').base_stat;
        obrona2 = pokemon2.stats.find(stat => stat.stat.name === 'defense').base_stat; // Zapisujemy w zmiennej globalnej

        if (legendarne.includes(pokemonId1)) hp1 *= 2.5;
        if (legendarne.includes(pokemonId2)) hp2 *= 2.5;

        // Fetch form information for both Pokémon
        Promise.all([
            fetch(pokemon1.species.url).then(response => response.json()),
            fetch(pokemon2.species.url).then(response => response.json())
        ])
        .then(([species1, species2]) => {
            // Check if the Pokémon is in its second or third form and apply HP buffs
            if (species1.evolves_from_species) {
                hp1 *= 2;
            }
            if (species2.evolves_from_species) {
                hp2 *= 2;
            }

            hp1Current = hp1; // Zapisanie aktualnego HP użytkownika
            hp1Max = hp1; // Maksymalne HP użytkownika
            userPokemonName = pokemon1.name; // Zapisanie nazwy użytkownika
            hp2Current = hp2; // Zapisanie aktualnego HP przeciwnika
            hp2Max = hp2; // Maksymalne HP przeciwnika
            enemyName = pokemon2.name; // Zapisanie nazwy przeciwnika

            document.querySelector(".p1").innerHTML = `
                <p>${pokemon1.name} <br> ${hp1} / ${hp1}</p>
                <img src="${pokemon1.sprites.other["showdown"].back_default}" style="width: 100%; height: 100%;">
            `;

            document.querySelector(".p2").innerHTML = `
                <p id="hp2-display">${enemyName} <br> ${hp2Current} / ${hp2Max}</p>
                <img src="${pokemon2.sprites.other["showdown"].front_default}" style="width: 100%; height: 100%;">
            `;

            let attackCount = 0;
            let randomAttackIndices = [];

            for (let i = 0; i < 4; i++) {
                let randomIndex = Math.floor(Math.random() * pokemon1.moves.length);
                while (randomAttackIndices.includes(randomIndex)) {
                    randomIndex = Math.floor(Math.random() * pokemon1.moves.length);
                }
                randomAttackIndices.push(randomIndex);
            }

            randomAttackIndices.forEach((index) => {
                let move = pokemon1.moves[index];
                fetch(move.move.url)
                    .then(response => response.json())
                    .then(moveData => {
                        const attackType = moveData.type.name;
                        const attackPower = moveData.power;
                        const attackCategory = moveData.damage_class.name;

                        if (attackPower !== null && attackPower > 0) {
                            attackCount++;

                            let button = document.querySelector(`#atak${attackCount}`);
                            button.innerHTML = `
                                <div style="display: flex; flex-direction: column; align-items: center;">
                                    <strong>${moveData.name}</strong>
                                    <span>${attackType}</span>
                                    <span class="damage">${attackPower}</span>
                                    <span>${attackCategory}</span>
                                </div>
                            `;
                            button.style.backgroundColor = typeColors[attackType] || 'white';
                            if (['white', 'lightblue', 'pink', 'lightpink', 'skyblue', 'yellow', 'orange'].includes(button.style.backgroundColor)) {
                                button.style.color = 'black';
                            } else {
                                button.style.color = 'white';
                            }

                            // Dodanie event listenera do ataku
                            button.addEventListener("click", function() {
                                if (canAttack) {
                                    atakPokemonem(attackPower);
                                    canAttack = false;
                                    setTimeout(() => {
                                        // Enemy attacks after user attack
                                        enemyAttack();
                                    }, 2000); // 2 seconds delay
                                }
                            });
                        }
                    });
            });

            // Call the function to fetch and log enemy attacks
            losoweAtakiPrzeciwnika(pokemon2);
        })
        .catch(error => console.error("Error fetching Pokémon species data:", error));
    })
    .catch(error => console.error("Error fetching Pokémon data:", error));
}

function changePokemon() {
    let newPokemonId = Math.floor(Math.random() * 649) + 1;

    fetch(`https://pokeapi.co/api/v2/pokemon/${newPokemonId}`)
        .then(response => response.json())
        .then(pokemon => {
            let hp1 = pokemon.stats.find(stat => stat.stat.name === 'hp').base_stat;
            obrona1 = pokemon.stats.find(stat => stat.stat.name === 'defense').base_stat;

            // Fetch form information for the new Pokémon
            fetch(pokemon.species.url)
                .then(response => response.json())
                .then(species => {
                    // Check if the Pokémon is in its second or third form and apply HP buffs
                    if (species.evolves_from_species) {
                        hp1 *= 2;
                    }

                    hp1Current = hp1; // Zapisanie aktualnego HP użytkownika
                    hp1Max = hp1; // Maksymalne HP użytkownika
                    userPokemonName = pokemon.name; // Zapisanie nazwy użytkownika

                    document.querySelector(".p1").innerHTML = `
                        <p>${pokemon.name} <br> ${hp1} / ${hp1}</p>
                        <img src="${pokemon.sprites.other["showdown"].back_default}" style="width: 100%; height: 100%;">
                    `;

                    let attackCount = 0;
                    let randomAttackIndices = [];

                    for (let i = 0; i < 4; i++) {
                        let randomIndex = Math.floor(Math.random() * pokemon.moves.length);
                        while (randomAttackIndices.includes(randomIndex)) {
                            randomIndex = Math.floor(Math.random() * pokemon.moves.length);
                        }
                        randomAttackIndices.push(randomIndex);
                    }

                    randomAttackIndices.forEach((index) => {
                        let move = pokemon.moves[index];
                        fetch(move.move.url)
                            .then(response => response.json())
                            .then(moveData => {
                                const attackType = moveData.type.name;
                                const attackPower = moveData.power;
                                const attackCategory = moveData.damage_class.name;

                                if (attackPower !== null && attackPower > 0) {
                                    attackCount++;

                                    let button = document.querySelector(`#atak${attackCount}`);
                                    button.innerHTML = `
                                        <div style="display: flex; flex-direction: column; align-items: center;">
                                            <strong>${moveData.name}</strong>
                                            <span>${attackType}</span>
                                            <span class="damage">${attackPower}</span>
                                            <span>${attackCategory}</span>
                                        </div>
                                    `;
                                    button.style.backgroundColor = typeColors[attackType] || 'white';
                                    if (['white', 'lightblue', 'pink', 'lightpink'].includes(button.style.backgroundColor)) {
                                        button.style.color = 'black';
                                    } else {
                                        button.style.color = 'white';
                                    }

                                    // Dodanie event listenera do ataku
                                    button.addEventListener("click", function() {
                                        if (canAttack) {
                                            atakPokemonem(attackPower);
                                            canAttack = false;
                                            setTimeout(() => {
                                                // Enemy attacks after user attack
                                                enemyAttack();
                                            }, 2000); // 2 seconds delay
                                        }
                                    });
                                }
                            });
                    });
                })
                .catch(error => console.error("Error fetching Pokémon species data:", error));
        })
        .catch(error => console.error("Error fetching new Pokémon data:", error));
}

function losoweAtakiPrzeciwnika(pokemonId2) {
    let randomAttackIndices = [];

    // Losujemy 4 unikalne ataki przeciwnika
    for (let i = 0; i < 4; i++) {
        let randomIndex = Math.floor(Math.random() * pokemonId2.moves.length);
        while (randomAttackIndices.includes(randomIndex)) {
            randomIndex = Math.floor(Math.random() * pokemonId2.moves.length);
        }
        randomAttackIndices.push(randomIndex);
    }

    // Pobieramy dane ataków
    Promise.all(
        randomAttackIndices.map(index => fetch(pokemonId2.moves[index].move.url).then(res => res.json()))
    ).then(movesData => {
        enemyAttacks = movesData
            .filter(moveData => moveData.power !== null) // Filter out status moves
            .map(moveData => ({
                name: moveData.name,
                type: moveData.type.name,
                power: moveData.power,
                category: moveData.damage_class.name
            }));

        console.log("Ataki przeciwnika:", enemyAttacks); // Wydruk w konsoli
    }).catch(error => console.error("Błąd pobierania ataków przeciwnika:", error));
}

// 🛡️ Funkcja do odejmowania HP przeciwnika
function atakPokemonem(damage) {
    let finalDamage = damage - obrona2 / 4; // Obrona przeciwnika redukuje obrażenia
    if (finalDamage < 0) finalDamage = 0; // Nie pozwalamy na leczenie przeciwnika poprzez zbyt dużą obronę

    hp2Current -= finalDamage; // Odejmujemy obrażenia od HP przeciwnika

    // Upewnienie się, że HP nie jest poniżej 0
    if (hp2Current < 0) hp2Current = 0 ;

    // Aktualizacja wyświetlanego HP przeciwnika
    document.querySelector("#hp2-display").innerHTML = `${enemyName}<br>${hp2Current} / ${hp2Max}`;

    console.log(`Przeciwnik otrzymał ${finalDamage} obrażeń! Pozostałe HP: ${hp2Current}`);

    if (hp2Current <= 0) {
        alert("Wygrałeś!");
    }
}

// 🛡️ Funkcja do odejmowania HP użytkownika
function enemyAttack() {
    if (enemyAttacks.length > 0) {
        let randomAttack = enemyAttacks[Math.floor(Math.random() * enemyAttacks.length)];
        let finalDamage = randomAttack.power - obrona1 / 4; // Obrona użytkownika redukuje obrażenia
        if (finalDamage < 0) finalDamage = 0; // Nie pozwalamy na leczenie użytkownika poprzez zbyt dużą obronę

        hp1Current -= finalDamage; // Odejmujemy obrażenia od HP użytkownika

        // Upewnienie się, że HP nie jest poniżej 0
        if (hp1Current < 0) hp1Current = 0;

        // Aktualizacja wyświetlanego HP użytkownika
        document.querySelector(".p1 p").innerHTML = `${userPokemonName}<br>${hp1Current} / ${hp1Max}`;

        console.log(`Użytkownik otrzymał ${finalDamage} obrażeń! Pozostałe HP: ${hp1Current}`);

        if (hp1Current <= 0) {
            alert("Przegrałeś!");
        }

        // Allow user to attack again after enemy attack
        canAttack = true;
    }
}

function ataki() {
    document.querySelector('.przyciski').style.display = "none";
    document.querySelector('.ataki').style.display = "flex";
}

function powracanie() {
    document.querySelector('.przyciski').style.display = "flex";
    document.querySelector('.ataki').style.display = "none";
}

function plecak() {
    document.querySelector('.przyciski').style.display = "none";
    document.querySelector('.plecak').style.display = "flex";
}

function powracanie2() {
    document.querySelector('.przyciski').style.display = "flex";
    document.querySelector('.plecak').style.display = "none";
}

function hyperpotion() {
    // Hide the plecak div
    document.querySelector('.plecak').style.display = "none";

    // Add 90 HP to p1 but not exceeding the max HP
    hp1Current = Math.min(hp1Current + 90, hp1Max);

    // Update the displayed HP
    document.querySelector(".p1 p").innerHTML = `${userPokemonName}<br>${hp1Current} / ${hp1Max}`;

    // Show the przyciski div
    document.querySelector('.przyciski').style.display = "flex";

    // Make it p2's turn to attack
    canAttack = false;
    setTimeout(() => {
        enemyAttack();
    }, 2000); // 2 seconds delay
}

function runAway() {
    // Roll a random number between 1 and 649
    let newPokemonId = Math.floor(Math.random() * 649) + 1;

    // Fetch the new Pokémon data
    fetch(`https://pokeapi.co/api/v2/pokemon/${newPokemonId}`)
        .then(response => response.json())
        .then(pokemon => {
            let hp2 = pokemon.stats.find(stat => stat.stat.name === 'hp').base_stat;
            obrona2 = pokemon.stats.find(stat => stat.stat.name === 'defense').base_stat;

            // Fetch form information for the new Pokémon
            fetch(pokemon.species.url)
                .then(response => response.json())
                .then(species => {
                    // Check if the Pokémon is in its second or third form and apply HP buffs
                    if (species.evolves_from_species) {
                        hp2 *= 2;
                    }

                    hp2Current = hp2; // Zapisanie aktualnego HP przeciwnika
                    hp2Max = hp2; // Maksymalne HP przeciwnika
                    enemyName = pokemon.name; // Zapisanie nazwy przeciwnika

                    document.querySelector(".p2").innerHTML = `
                        <p id="hp2-display">${enemyName} <br> ${hp2Current} / ${hp2Max}</p>
                        <img src="${pokemon.sprites.other["showdown"].front_default}" style="width: 100%; height: 100%;">
                    `;

                    // Call the function to fetch and log enemy attacks
                    losoweAtakiPrzeciwnika(pokemon);
                })
                .catch(error => console.error("Error fetching Pokémon species data:", error));
        })
        .catch(error => console.error("Error fetching new Pokémon data:", error));
}


document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("change-pokemon-button").addEventListener("click", changePokemon);
    document.getElementById("run-away-button").addEventListener("click", runAway);
});

