let hp2Current; // Aktualne HP przeciwnika
let hp2Max; // Maksymalne HP przeciwnika
let enemyName; // Imię przeciwnika
let obrona2; // Obrona przeciwnika

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
        let obrona1 = pokemon1.stats.find(stat => stat.stat.name === 'defense').base_stat;
        obrona2 = pokemon2.stats.find(stat => stat.stat.name === 'defense').base_stat; // Zapisujemy w zmiennej globalnej
        
        if (legendarne.includes(pokemonId1)) hp1 *= 2.5;
        if (legendarne.includes(pokemonId2)) hp2 *= 2.5;

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

let enemyAttacks = []; // Przechowywanie ataków przeciwnika

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
        enemyAttacks = movesData.map(moveData => ({
            name: moveData.name,
            type: moveData.type.name,
            power: moveData.power,
            category: moveData.damage_class.name
        }));

        console.log("Ataki przeciwnika:", enemyAttacks); // Wydruk w konsoli
    }).catch(error => console.error("Błąd pobierania ataków przeciwnika:", error));
}

console.log(pokemon2.moves);  // Sprawdzenie, czy mamy dane o atakach


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

                        // Dodanie event listenera do ataku
                        button.addEventListener("click", function() {
                            atakPokemonem(attackPower);
                        });
                    }
                });
        });
    })
    .catch(error => console.error("Error fetching Pokémon data:", error));
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



function ataki() {
    document.querySelector('.przyciski').style.display = "none";
    document.querySelector('.ataki').style.display = "flex";
}

function powracanie() {
    document.querySelector('.przyciski').style.display = "flex";
    document.querySelector('.ataki').style.display = "none";
}
