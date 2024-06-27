#! /usr/bin/env node
import inquirer from "inquirer";
import chalk from "chalk";
import * as readline from "readline";
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});
let currentInput = ''; // Current user input
let timer = null; // Timer for the typing test
let startTime = null; // Start time of the typing test
let correctWords = 0;
let wrongWordsInSentence = [];
let totalCompletedSentences = 0;
let time = {
    simple: 30000,
    Basic: 60000,
    Intermediate: 40000,
    Hard: 30000, // 30 sec
};
const sentences = [
    "The quick brown fox jumps over the lazy dog",
    "The sun is shining brightly today.",
    "Technology is advancing at a rapid pace, transforming our daily lives.",
    "In the midst of chaos, there lies an opportunity for those who are prepared to seize it."
];
let sentenceShown = generateRandomSentences();
// Function to render the current state
function render() {
    readline.cursorTo(process.stdout, 0, 0); // Move cursor to top-left corner
    readline.clearScreenDown(process.stdout); // Clear screen from cursor down
    console.log(chalk.yellow('Type the following sentence (press Enter to start typing):'));
    console.log(chalk.green(sentenceShown)); // Display the current sentence
    console.log(chalk.yellow('Current user input:'));
    // Split expected and actual words
    const expectedWords = sentenceShown.trim().split(' ');
    const actualWords = currentInput.trim().split(' ');
    // Compare words and apply styling
    let output = '';
    for (let i = 0; i < expectedWords.length; i++) {
        if (i < actualWords.length) {
            if (expectedWords[i] === actualWords[i]) {
                output += chalk.green(actualWords[i] + ' ');
            }
            else {
                output += chalk.red(actualWords[i] + ' ');
            }
        }
    }
    console.log(output); // Display current input with styling
}
// Function to handle starting the typing test
function startTypingTest(duration) {
    startTime = Date.now(); // Record the start time
    timer = setTimeout(endTypingTest, duration); // Set timer for typing test
    process.stdin.setRawMode(true); // Enable raw mode to capture each keypress
    process.stdin.resume();
    // Event listener for keypress
    process.stdin.on('keypress', (_, key) => {
        if (key) {
            if (key.name === 'return') {
                // User pressed Enter
                analyzeInput(sentenceShown, currentInput);
                if (currentInput.trim() === sentenceShown.trim()) {
                    // Completed the current sentence correctly
                    currentInput = ''; // Clear current input
                    sentenceShown = generateRandomSentences(); // Generate new sentence
                    totalCompletedSentences++; // Increment completed sentences count
                }
                else {
                    currentInput += '\n'; // Start a new line
                }
                render(); // Render updated screen
            }
            else if (key.name === 'backspace') {
                currentInput = currentInput.slice(0, -1); // Handle backspace
                render(); // Render updated screen
            }
            else {
                currentInput += key.sequence; // Add character to currentInput
                render(); // Render updated screen
            }
        }
    });
    // Initial render
    render();
}
// Function to analyze user input
function analyzeInput(expected, actual) {
    const expectedWords = expected.trim().split(' ');
    const actualWords = actual.trim().split(' ');
    correctWords = 0;
    wrongWordsInSentence = []; // Reset wrong words in sentence
    for (let i = 0; i < expectedWords.length; i++) {
        if (i < actualWords.length) {
            if (expectedWords[i] === actualWords[i]) {
                correctWords++;
            }
            else {
                wrongWordsInSentence.push(actualWords[i]); // Add wrong word to the array
            }
        }
    }
}
// Function to end the typing test
function endTypingTest() {
    process.stdin.removeAllListeners('keypress'); // Remove keypress listeners
    process.stdin.setRawMode(false); // Disable raw mode
    process.stdin.pause();
    if (startTime !== null) {
        // Calculate elapsed time
        const elapsedTime = (Date.now() - startTime) / 1000; // in seconds
        const typingSpeed = (currentInput.trim().split(' ').length / elapsedTime) * 60; // words per minute
        // Analyze user input
        analyzeInput(sentenceShown, currentInput);
        // Display results
        console.log(chalk.yellow('Typing test completed!'));
        console.log(chalk.green(`Typing speed: ${typingSpeed.toFixed(2)} words per minute`));
        console.log(chalk.green(`Correct words: ${correctWords}`));
        console.log(chalk.green(`Accuracy: ${(correctWords / sentenceShown.split(' ').length * 100).toFixed(2)}%`));
        console.log(chalk.green(`Total Completed Sentences: ${totalCompletedSentences}`));
        if (wrongWordsInSentence.length > 0) {
            // Display wrong words underlined in red
            const underlinedWrongWords = wrongWordsInSentence.map(word => chalk.red.underline(word)).join(', ');
            console.log(chalk.red('Wrong Words in the sentence: ' + underlinedWrongWords));
            // Display the correct sentence
            console.log(chalk.blue('Correct sentence: ' + sentenceShown));
        }
        else {
            console.log(chalk.green('No mistakes made!'));
        }
    }
    else {
        console.log(chalk.red('Error: Typing test ended before it started.'));
    }
    // Reset variables for next test
    currentInput = '';
    sentenceShown = generateRandomSentences(); // Generate new random sentence
    // Prompt user to start a new test
    console.log(""); // Add a blank line for spacing
    inquirer.prompt({
        name: "startNewTest",
        type: "list",
        message: "Do you want to start a new typing test?",
        choices: ["Yes", "No"]
    }).then(answer => {
        if (answer.startNewTest === "Yes") {
            startMenu(); // Restart the menu to allow selection
        }
        else {
            console.log(chalk.yellow('Exiting...'));
            process.exit(0); // Exit the process
        }
    });
}
// Function to generate a random sentence from the sentences array
function generateRandomSentences() {
    return sentences[Math.floor(Math.random() * sentences.length)];
}
// Function to display the start menu
function startMenu() {
    console.log(""); // Add a blank line for spacing
    inquirer.prompt({
        name: "selectedOption",
        type: "list",
        message: "Select an Option from the list",
        choices: ["Warm up Exercise (30 sec)", "Basic Level (60 sec)", "Intermediate Level (40 sec)", "Hard Level (30 sec)", "Exit"]
    }).then(answer => {
        switch (answer.selectedOption) {
            case "Warm up Exercise (30 sec)":
                startTypingTest(time.simple);
                break;
            case "Basic Level (60 sec)":
                startTypingTest(time.Basic);
                break;
            case "Intermediate Level (40 sec)":
                startTypingTest(time.Intermediate);
                break;
            case "Hard Level (30 sec)":
                startTypingTest(time.Hard);
                break;
            case "Exit":
                console.log(chalk.yellow('Exiting...'));
                process.exit(0); // Exit the process
            default:
                console.log(chalk.red("Invalid option selected."));
                break;
        }
    });
}
// Start the application
startMenu();
// Clean up on exit
rl.on('close', () => {
    console.log(chalk.yellow('Exiting...'));
    process.exit(0);
});
