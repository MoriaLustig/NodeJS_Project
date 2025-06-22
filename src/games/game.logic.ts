
export function generateSecretCode() {
    let secretCode: number[] = [];
    const numbers = Array.from({ length:9 }, (_, i) => i + 1); 
    for (let i = 0; i < 4; i++) {
        const randomIndex = Math.floor(Math.random() * numbers.length);
        secretCode.push(numbers[randomIndex]);
        numbers.splice(randomIndex, 1); 
    }
    return secretCode;
}
export function countBulls(guess: number[], secretCode: number[]): number {
    let correctPosition = 0;
    const secretCodeCopy: (number | null)[] = [...secretCode];
    const guessCopy: (number | null)[] = [...guess];

    guess.forEach((num, index) => {
        if (num === secretCode[index]) {
            correctPosition++;
            secretCodeCopy[index] = null; 
            guessCopy[index] = null; 
        }
    });

    return correctPosition;
}
export function countPgias(guess: number[], secretCode: number[]): number {
    let correctNumber = 0;
    const secretCodeCopy: (number | null)[] = [...secretCode];
    const guessCopy: (number | null)[] = [...guess];
    let index=0;
    guessCopy.forEach((num) => {
        if (num !== null && secretCodeCopy.includes(num)&&secretCode.indexOf(num)!= index) {
            correctNumber++;
            const numberIndex = secretCodeCopy.indexOf(num);
            secretCodeCopy[numberIndex] = null; // Mark as evaluated
        }
        index++;
    });

    return correctNumber;
}
