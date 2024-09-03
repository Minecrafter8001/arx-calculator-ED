document.getElementById("arx-form").addEventListener("submit", function(event) {
    event.preventDefault();

    const targetArx = parseInt(document.getElementById("target_arx").value, 10);
    let currentArx = parseInt(document.getElementById("current_arx").value, 10);
    const currency = document.getElementById("currency").value;

    const resultDiv = document.getElementById("result");
    
    // Clear previous result
    resultDiv.innerHTML = '';
    if (!currentArx) {
        currentArx = 0;
    }
    if (isNaN(targetArx) || isNaN(currentArx) & !currentArx == 0) {
        resultDiv.innerHTML = "<p class='error'>Please enter valid numbers for ARX values.</p>";
        return;
    }

    if (targetArx <= currentArx) {
        resultDiv.innerHTML = "<p class='error'>Target ARX should be greater than current ARX.</p>";
        return;
    }

    const arxNeeded = targetArx - currentArx;

    const packs = [
        { arx: 100000, price: { GBP: 44.99, EUR: 54.99, USD: 59.99 } },
        { arx: 54000, price: { GBP: 24.99, EUR: 29.99, USD: 37.99 } },
        { arx: 26800, price: { GBP: 12.99, EUR: 15.99, USD: 18.99 } },
        { arx: 17700, price: { GBP: 9.59, EUR: 11.49, USD: 12.99 } },
        { arx: 8820, price: { GBP: 4.99, EUR: 5.99, USD: 6.99 } },
        { arx: 5000, price: { GBP: 2.99, EUR: 3.49, USD: 3.99 } }
    ];
    

    let minCost = Infinity;
    let bestCombination = [];
    let leftoverArx = 0;

    for (let r = 1; r <= 10; r++) {
        combinationsWithReplacement(packs, r).forEach(function (combination) {
            const totalArx = combination.reduce((sum, pack) => sum + pack.arx, 0);
            const totalCost = combination.reduce((sum, pack) => sum + (pack.price[currency] || 0), 0);

            if (totalArx >= arxNeeded && totalCost < minCost) {
                minCost = totalCost;
                bestCombination = combination;
            }
        });
    }

    if (bestCombination.length === 0) {
        displayResult([], Infinity, 0, currency);
    } else {
        leftoverArx = bestCombination.reduce((sum, pack) => sum + pack.arx, 0) - arxNeeded;
        displayResult(bestCombination, minCost, leftoverArx, currency);
    }
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
    const currency_symbols = { GBP: "£", EUR: "€", USD: "$" };
    const resultDiv = document.getElementById("result");
    
    if (cost === Infinity) {
        resultDiv.innerHTML = "<p class='error'>Cost error:</p><p>Target ARX must be under one million.</p>";
        return;
    }

    const totalArx = packs.reduce((sum, pack) => sum + pack.arx, 0);
    
    // Group identical packs
    const packCount = {};
    packs.forEach(pack => {
        const key = `${pack.arx}-${currency}`;
        if (packCount[key]) {
            packCount[key].count += 1;
        } else {
            packCount[key] = { pack, count: 1 };
        }
    });

    // Display results
    resultDiv.innerHTML = `<h2>Total ARX: ${totalArx.toLocaleString()}</h2>`;
    resultDiv.innerHTML += `<h2>Total cost: ${currency_symbols[currency]}${cost.toFixed(2).toLocaleString()}</h2>`;
    
    for (const key in packCount) {
        const { pack, count } = packCount[key];
        resultDiv.innerHTML += `<p>Pack: ${count}x ${pack.arx.toLocaleString()} ARX for ${currency_symbols[currency]}${pack.price[currency].toFixed(2).toLocaleString()}</p>`;
    }
    
    if (leftoverArx > 0) {
        resultDiv.innerHTML += `<p>Extra: ${leftoverArx.toLocaleString()} ARX</p>`;
    }
}
