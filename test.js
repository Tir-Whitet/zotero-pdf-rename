var test_result = firstLetterOfEachWord("Journal of the ACM and IEEE");
console.log(test_result);
function firstLetterOfEachWord(str) {
    if (str === "") {
        return "Unknown";
    }
    // Use each capitalized initial letter of the journal title as an abbreviation
    var words = str.split(" ");
    // remove lowercase words and "IEEE", "ACM", "The", numbers, etc.
    var capitalizedWords = words.filter(function (word) {
        return word[0] === word[0].toUpperCase() &&
            word !== "The" &&
            !word.match(/\d+/);
    });
    // use first letter of each word as abbreviation
    var jab = capitalizedWords.map(function (word) { return word[0]; }).join("");
    return jab;
}
