document.getElementById("arx-form").addEventListener("submit", function(event) {
    event.preventDefault();

    const targetArx = parseInt(document.getElementById("target_arx").value);
    let currentArx = parseInt(document.getElementById("current_arx").value);
    const currency = document.getElementById("currency").value;
    if (isNaN(currentArx)) {
        currentArx = 0;
    }

    const arxNeeded = targetArx - currentArx;

    const packs = [
        {arx: 100000, price: {GBP: 44.99, EUR: 54.99, USD: 59.99}},
        {arx: 54000, price: {GBP: 24.99, EUR: 29.99, USD: 37.99}},
        {arx: 26800, price: {GBP: 12.99, EUR: 15.99, USD: 18.99}},
        {arx: 17700, price: {GBP: 9.59, EUR: 11.49, USD: 12.99}},
        {arx: 8820, price: {GBP: 4.99, EUR: 5.99, USD: 6.99}},
        {arx: 5000, price: {GBP: 2.99, EUR: 3.49, USD: 3.99}}
    ];

    let minCost = Infinity;
    let bestCombination = [];
    let leftoverArx = 0;

    for (let r = 1; r <= 10; r++) {
        combinationsWithReplacement(packs, r).forEach(function(combination) {
            const totalArx = combination.reduce((sum, pack) => sum + pack.arx, 0);
            const totalCost = combination.reduce((sum, pack) => {
                if (pack.price[currency] !== undefined) {
                    return sum + pack.price[currency];
                }
                return sum;
            }, 0);

            if (totalArx >= arxNeeded && totalCost < minCost) {
                minCost = totalCost;
                bestCombination = combination;
            }
        });
    }

    leftoverArx = bestCombination.reduce((sum, pack) => sum + pack.arx, 0) - arxNeeded;

    displayResult(bestCombination, minCost, leftoverArx, currency);
});

function combinationsWithReplacement(arr, r) {
    if (r === 1) return arr.map(a => [a]);

    const combinations = [];
    arr.forEach((v, i) => {
        const sub = combinationsWithReplacement(arr.slice(i), r - 1);
        sub.forEach(s => combinations.push([v].concat(s)));
    });

    return combinations;
}

function displayResult(packs, cost, leftoverArx, currency) {
    const resultDiv = document.getElementById("result");
    resultDiv.innerHTML = `<h2>Total cost: ${currency} ${cost.toFixed(2).toLocaleString()}</h2>`;
    packs.forEach(pack => {
        resultDiv.innerHTML += `<p>Pack: ${pack.arx.toLocaleString()} ARX for ${currency} ${pack.price[currency].toFixed(2).toLocaleString()}</p>`;
    });
    if (leftoverArx > 0) {
        resultDiv.innerHTML += `<p>Extra: ${leftoverArx.toLocaleString()} ARX</p>`;
    }
}