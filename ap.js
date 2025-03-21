let hp2Current; // Aktualne HP przeciwnika
let hp2Max; // Maksymalne HP przeciwnika
let enemyName; // Imię przeciwnika
let obrona2; // Obrona przeciwnika
let enemyAttacks = []; // Przechowywanie ataków przeciwnika
let canAttack = true; // Flaga do kontrolowania możliwości ataku
let hp1Current; // Aktualne HP użytkownika
let hp1Max; // Maksymalne HP użytkownika
let obrona1; // Obrona użytkownika
let userPokemonName; // Imię użytkownika

function start() {
    const legendarne = [144, 145, 146, 150, 151, 243, 244, 245, 249, 250, 251, 377, 378, 379, 380, 381, 382, 383, 384, 385, 386, 480, 481, 482, 483, 484, 485, 486, 487, 488, 489, 490, 491, 492, 493, 494, 638, 639, 640, 641, 642, 643, 644, 645, 646, 647];

    const druga = [
        2, 5, 8, 11, 14, 17, 24, 28, 31, 34, 37, 40, 42, 44, 47, 49, 51, 53, 55, 57,
        59, 61, 64, 67, 70, 73, 76, 78, 80, 82, 87, 89, 91, 94, 97, 99, 101, 103, 105,
        110, 113, 115, 117, 119, 121, 123, 126, 128, 130, 134, 135, 136, 139, 141,
        143, 148, 153, 156, 159, 162, 164, 166, 168, 171, 178, 180, 182, 184, 186,
        189, 192, 195, 197, 199, 202, 205, 208, 210, 212, 214, 217, 219, 221, 224,
        226, 229, 232, 248, 267, 269, 271, 274, 277, 279, 282, 284, 286, 289, 292,
        295, 297, 301, 306, 308, 310, 317, 319, 323, 326, 330, 332, 334, 337, 340,
        342, 346, 348, 350, 354, 356, 359, 362, 365, 368, 370, 373, 376, 378, 380,
        382, 384, 387, 389, 392, 395, 398, 400, 402, 405, 407, 409, 411, 414, 416,
        419, 423, 426, 429, 432, 435, 437, 440, 442, 445, 448, 450, 452, 455, 457,
        460, 462, 465, 468, 470, 472, 474, 477, 478, 530, 533, 536, 539, 542, 545,
        547, 549, 552, 555, 558, 561, 565, 567, 569, 571, 573, 576, 579, 581, 584,
        587, 589, 591, 594, 596, 598, 601, 604, 606, 609, 612, 614, 617, 620, 623,
        625, 628, 631, 634, 637, 640, 642, 646
      ];
      
      const trzecia = [
        3, 6, 9, 12, 15, 18, 36, 38, 45, 53, 59, 62, 65, 68, 71, 76, 79, 83, 85, 94,
        97, 101, 103, 107, 110, 113, 119, 121, 126, 130, 134, 136, 139, 141, 143,
        149, 154, 157, 160, 181, 186, 189, 192, 195, 199, 202, 205, 208, 212, 214,
        217, 221, 226, 230, 233, 248, 254, 257, 260, 272, 275, 279, 282, 286, 289,
        292, 295, 301, 306, 310, 319, 323, 326, 330, 334, 340, 344, 348, 356,
        359, 362, 365, 368, 373, 376, 378, 380, 384, 389, 392, 395, 398, 400, 405,
        409, 411, 414, 419, 423, 426, 429, 432, 437, 445, 448, 450, 452, 460, 462,
        464, 468, 472, 474, 477, 530, 533, 536, 539, 542, 545, 549, 553, 556, 560,
        563, 566, 569, 571, 576, 579, 581, 587, 589, 591, 596, 601, 606, 609, 612,
        614, 617, 620, 623, 625, 628, 631, 635, 637, 640, 642, 646
      ];
      
      

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

        if (druga.includes(pokemonId1)) hp1 *= 1.5;
        if (druga.includes(pokemonId2)) hp2 *= 1.5;

        if (trzecia.includes(pokemonId1)) hp1 *= 2;
        if (trzecia.includes(pokemonId2)) hp2 *= 2;

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

                        // Dodanie event listenera do ataku
                        button.addEventListener("click", function() {
                            if (canAttack) {
                                atakPokemonem(attackPower);
                                canAttack = false;
                                setTimeout(() => {
                                    canAttack = true;
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
    .catch(error => console.error("Error fetching Pokémon data:", error));
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
