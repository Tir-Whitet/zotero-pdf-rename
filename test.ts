
const test_result = firstLetterOfEachWord("Journal of the ACM and IEEE");
console.log(test_result);


// test passed
function firstLetterOfEachWord(str: string) {
    if (str === "") {
        return "Unknown";
    }
    // Use each capitalized initial letter of the journal title as an abbreviation
    const words = str.split(" ");
    // remove lowercase words and "IEEE", "ACM", "The", numbers, etc.
    const capitalizedWords = words.filter(
        (word) =>
            word[0] === word[0].toUpperCase() &&
            word !== "The" &&
            !word.match(/\d+/)
    );
    // use first letter of each word as abbreviation
    const jab = capitalizedWords.map((word) => word[0]).join("");
    return jab;
}