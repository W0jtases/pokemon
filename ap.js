function start() {
    // Losowanie dwóch różnych Pokémonów
    let pokemonId1 = Math.floor(Math.random() * 649) + 1;  // Losowy Pokémon 1
    let pokemonId2 = Math.floor(Math.random() * 649) + 1;  // Losowy Pokémon 2
    // Pobranie danych o Pokémonach z API
    Promise.all([
        fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId1}`).then(response => response.json()),
        fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId2}`).then(response => response.json())
    ])
        .then(([pokemon1, pokemon2]) => {
            // Ustawienie obrazu dla p2 (przedni obrazek)
            document.querySelector(".p2").innerHTML = `
            <p>
                ${pokemon2.name} <br>
                ${pokemon2.stats.find(stat => stat.stat.name === 'hp').base_stat} / ${pokemon2.stats.find(stat => stat.stat.name === 'hp').base_stat}
            </p>
            <img
                src="${pokemon2.sprites.other["showdown"].front_default}"
                style="width: 100%; height: 100%;">
        `;

            // Ustawienie obrazu dla p1 (tylny obrazek)
            document.querySelector(".p1").innerHTML = `
            <p>
                ${pokemon1.name} <br>
                ${pokemon1.stats.find(stat => stat.stat.name === 'hp').base_stat} / ${pokemon1.stats.find(stat => stat.stat.name === 'hp').base_stat}
            </p>
            <img
                src="${pokemon1.sprites.other["showdown"].back_default}"
                style="width: 100%; height: 100%;">
        `;

            // Zmienna do przechowywania tylko ataków z mocą
            let attackCount = 0;

            // Tablica, która będzie przechowywać ataki
            let attackData = [];

            // Losowanie 4 ataków Pokémonów (można losować je w zakresie 0-30)
            let randomAttackIndices = [];
            for (let i = 0; i < 4; i++) {
                let randomIndex = Math.floor(Math.random() * pokemon1.moves.length);
                while (randomAttackIndices.includes(randomIndex)) {
                    randomIndex = Math.floor(Math.random() * pokemon1.moves.length);
                }
                randomAttackIndices.push(randomIndex);
            }

            // Sprawdzanie ataków Pokémonów
            randomAttackIndices.forEach((index) => {
                let move = pokemon1.moves[index];  // Wybieramy atak na podstawie wylosowanego indeksu
                fetch(move.move.url)
                    .then(response => response.json())
                    .then(moveData => {
                        const attackType = moveData.type.name;  // Typ ataku
                        const attackPower = moveData.power;  // Moc ataku (ilość obrażeń)
                        const attackCategory = moveData.damage_class.name;  // Kategoria ataku (physical, special, status)

                        // Filtrujemy tylko ataki, które mają kategorię "physical" lub "special" oraz moc większą niż 0
                        if (attackPower !== null && attackPower > 0) {
                            // Zapisz typ ataku, moc i kategorię
                            attackData.push({
                                name: moveData.name,
                                type: attackType,
                                power: attackPower,
                                category: attackCategory
                            });

                            // Zwiększ licznik ataków
                            attackCount++;

                            // Wyświetlanie ataków, typów, mocy i kategorii
                            document.querySelector(`#atak${attackCount}`).innerHTML = `
                               ${moveData.name} <br> 
                               ${attackType} <br> 
                                ${attackPower} <br> 
                               ${attackCategory}
                            `;
                        }
                    });
            });

        })
        .catch((error) => {
            console.error("Error fetching Pokémon data:", error);
            document.querySelector(".p1").innerHTML = `<p>Pokémon not found. Please try again.</p>`;
            document.querySelector(".p2").innerHTML = `<p>Pokémon not found. Please try again.</p>`;
        });
}

function ataki() {
    let menu = document.getElementsByClassName('przyciski')[0];
    let ataki = document.getElementsByClassName('ataki')[0];

    menu.style.display = "none";
    ataki.style.display = "flex";
}

function powracanie() {
    let menu = document.getElementsByClassName('przyciski')[0];
    let ataki = document.getElementsByClassName('ataki')[0];

    menu.style.display = "flex";
    ataki.style.display = "none";
}
