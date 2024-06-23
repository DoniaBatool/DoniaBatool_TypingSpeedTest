#! /usr/bin/env node
import inquirer from "inquirer";
import chalk from "chalk";
import readline from 'readline';
// const sentences:string[] = [
//      "The quick brown fox jumps over the lazy dog",
//      "The sun is shining brightly today.",
//      "Technology is advancing at a rapid pace, transforming our daily lives.",
//      "In the midst of chaos, there lies an opportunity for those who are prepared to seize it."
// ];
// const times: { [key: string]: number } = { 
//     sample: 30000,
//     Basic: 50000,
//     Intermediate: 30000,
//     Hard: 15000
// };
// console.log("WELCOME TO THE SPEED CLUB");
// async function typingTest(duration: number): Promise<void> {
//     const startTime = Date.now();
//     let count = 0;
//     let totalWords = 0;
//     let correctWords = 0;
//     let mistakes: { input: string }[] = [];
//     const rl = readline.createInterface({
//         input: process.stdin,
//         output: process.stdout
//     });
//     const exp = sentences[Math.floor(Math.random() * sentences.length)];
//     console.log(chalk.yellow(`Type the following sentence as many times as you can:\n${exp}`));
//     return new Promise((resolve) => {
//         const interval = setInterval(() => {
//             const currentTime = Date.now();
//             if (currentTime - startTime >= duration) {
//                 clearInterval(interval);
//                 rl.close();
//     const durationMinutes = (Date.now() - startTime) / 60000;
//     const wpm = totalWords / durationMinutes;
//     const accuracy = (correctWords / totalWords) * 100;
//     console.log(chalk.green(`Time's up! You attempted to type the sentence ${count} times.`));
//     console.log(chalk.green(`Words per minute (WPM): ${wpm.toFixed(2)}`));
//     console.log(chalk.green(`Accuracy: ${accuracy.toFixed(2)}%`));
//         if (mistakes.length > 0) {
//         console.log(chalk.red(`\nMistakes made:`));
//         mistakes.forEach((mistake, index) => {
//         console.log(chalk.red(`${index + 1}. Your input: "${highlightMistakes(mistake.input, exp)}"`));
//         console.log(chalk.green(`   Correct: "${exp}"`));
//                     });
//          } else {
//             console.log(chalk.green(`No mistakes made! Great job!`));
//             }
//          resolve(); // Resolve the promise when the test is done
//             }
//         }, 1000);
//         rl.on('line', (input) => {
//             if (Date.now() - startTime < duration) {
//                 count++;
//                 totalWords += input.split(' ').length;
//                 if (input === exp) {
//                     correctWords += input.split(' ').length;
//                     console.log(chalk.green(`Correct!`));
//                 } else {
//                     mistakes.push({ input });
//                     console.log(chalk.red(`Incorrect.`));
//                 }
//             }
//         });
//     });
// }
// function highlightMistakes(input: string, exp: string): string {
//     const inputWords = input.split(' ');
//     const expWords = exp.split(' ');
//     return inputWords.map((word, index) => {
//         if (word !== expWords[index]) {
//             return chalk.red.underline(word);
//         }
//         return word;
//     }).join(' ');
// }
// async function main() {
//     while (true) {
//         const ask = await inquirer.prompt({
//             name: "selectedOption",
//             type: "list",
//             message: "Select an Option from the list",
//             choices: ["Warm up Exercise (30 sec)", "Basic Level (50 sec)", "Intermediate Level (30 sec)", "Hard Level (15 sec)", "Exit"]
//         });
//         switch (ask.selectedOption) {
//             case "Warm up Exercise (30 sec)":
//                 await typingTest(times.sample);
//                 break;
//             case "Basic Level (50 sec)":
//                 await typingTest(times.Basic);
//                 break;
//             case "Intermediate Level (30 sec)":
//                 await typingTest(times.Intermediate);
//                 break;
//             case "Hard Level (15 sec)":
//                 await typingTest(times.Hard);
//                 break;
//             case "Exit":
//                 console.log("Exiting...");
//                 return; // Exit the loop and the function
//             default:
//                 console.log(chalk.red("Invalid option selected."));
//                 break;
//         }
//     }
// }
// main();
const sentences = [
    "The quick brown fox jumps over the lazy dog",
    "The sun is shining brightly today.",
    "Technology is advancing at a rapid pace, transforming our daily lives.",
    "In the midst of chaos, there lies an opportunity for those who are prepared to seize it."
];
const times = {
    sample: 30000,
    Basic: 50000,
    Intermediate: 30000,
    Hard: 15000
};
console.log("WELCOME TO THE SPEED CLUB");
async function typingTest(exp, duration) {
    const startTime = Date.now();
    let totalWords = 0;
    let correctWords = 0;
    let wrongWords = 0;
    let completeCorrectSentences = 0;
    let mistakes = [];
    let lastInput = '';
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    console.log(chalk.yellow(`Type the following sentence as many times as you can:\n${exp}`));
    return new Promise((resolve) => {
        const interval = setInterval(() => {
            const currentTime = Date.now();
            if (currentTime - startTime >= duration) {
                clearInterval(interval);
                rl.close();
                // Process the last input if it exists
                if (lastInput) {
                    const { correct, wrong, allCorrect } = analyzeInput(lastInput, exp);
                    totalWords += correct + wrong;
                    correctWords += correct;
                    wrongWords += wrong;
                    if (allCorrect && correct === exp.split(' ').length) {
                        completeCorrectSentences++;
                    }
                    if (correct !== exp.split(' ').length || wrong > 0) {
                        mistakes.push({ input: lastInput, correct: exp });
                    }
                }
                const durationMinutes = (Date.now() - startTime) / 60000;
                const wpm = totalWords / durationMinutes;
                const accuracy = totalWords > 0 ? (correctWords / totalWords) * 100 : 0;
                console.log(chalk.green(`Time's up!`));
                console.log(chalk.green(`Words per minute (WPM): ${wpm.toFixed(2)}`));
                console.log(chalk.green(`Total words typed: ${totalWords}`));
                console.log(chalk.green(`Correct words typed: ${correctWords}`));
                console.log(chalk.green(`Wrong words: ${wrongWords}`));
                console.log(chalk.green(`Complete correct sentences: ${completeCorrectSentences}`));
                console.log(chalk.green(`Accuracy: ${accuracy.toFixed(2)}%`));
                if (mistakes.length > 0) {
                    console.log(chalk.red(`\nMistakes made:`));
                    mistakes.forEach((mistake, index) => {
                        console.log(chalk.red(`${index + 1}. Your input: "${highlightMistakes(mistake.input, exp)}"`));
                        console.log(chalk.green(`   Correct: "${exp}"`));
                    });
                }
                else {
                    console.log(chalk.green(`No mistakes made! Great job!`));
                }
                resolve(); // Resolve the promise when the test is done
            }
        }, 1000);
        rl.on('line', (input) => {
            if (Date.now() - startTime < duration) {
                lastInput = input; // Store the last input
                const { correct, wrong, allCorrect } = analyzeInput(input, exp);
                totalWords += correct + wrong;
                correctWords += correct;
                wrongWords += wrong;
                if (allCorrect && correct === exp.split(' ').length) {
                    completeCorrectSentences++;
                }
                if (correct !== exp.split(' ').length || wrong > 0) {
                    mistakes.push({ input, correct: exp });
                }
                lastInput = ''; // Reset lastInput after processing
            }
        });
    });
}
function analyzeInput(input, exp) {
    const inputWords = input.trim().split(/\s+/);
    const expWords = exp.split(' ');
    let correct = 0;
    let wrong = 0;
    let allCorrect = true;
    inputWords.forEach((word, index) => {
        if (index < expWords.length && word === expWords[index]) {
            correct++;
        }
        else if (index < expWords.length) {
            wrong++;
            allCorrect = false;
        }
        else {
            wrong++;
        }
    });
    return { correct, wrong, allCorrect };
}
function highlightMistakes(input, exp) {
    const inputWords = input.split(' ');
    const expWords = exp.split(' ');
    return inputWords.map((word, index) => {
        if (word !== expWords[index]) {
            return chalk.red.underline(word);
        }
        return word;
    }).join(' ');
}
async function main() {
    while (true) {
        const ask = await inquirer.prompt({
            name: "selectedOption",
            type: "list",
            message: "Select an Option from the list",
            choices: ["Warm up Exercise (30 sec)", "Basic Level (50 sec)", "Intermediate Level (30 sec)", "Hard Level (15 sec)", "Exit"]
        });
        switch (ask.selectedOption) {
            case "Warm up Exercise (30 sec)":
                await typingTest(getRandomSentence(), times.sample);
                break;
            case "Basic Level (50 sec)":
                await typingTest(getRandomSentence(), times.Basic);
                break;
            case "Intermediate Level (30 sec)":
                await typingTest(getRandomSentence(), times.Intermediate);
                break;
            case "Hard Level (15 sec)":
                await typingTest(getRandomSentence(), times.Hard);
                break;
            case "Exit":
                console.log("Exiting...");
                return; // Exit the loop and the function
            default:
                console.log(chalk.red("Invalid option selected."));
                break;
        }
    }
}
function getRandomSentence() {
    return sentences[Math.floor(Math.random() * sentences.length)];
}
main();
