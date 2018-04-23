type vec3 = [number, number, number];

class Die {
    public readonly containerDiv: HTMLDivElement;
    private readonly dieDiv: HTMLDivElement;
    private faceIndex: number;
    private currentAngle: vec3;

    constructor(private parentDiv: HTMLDivElement, private onDiceClick: () => void) {
        this.containerDiv = document.createElement("div");
        this.containerDiv.className = "dieContainer";
        this.dieDiv = this.makeDie();
        this.containerDiv.appendChild(this.dieDiv);
        this.parentDiv.appendChild(this.containerDiv);
        this.faceIndex = 0;
        this.currentAngle = [0, 0, 0];
    }

    public getValue(): number {
        return this.faceIndex + 1;
    }

    private makeDie(): HTMLDivElement {
        const die = document.createElement("div");
        die.className = "die";
        die.onclick = this.onDiceClick;
        const sides = ["front", "right", "top", "bottom", "left", "back"];
        for (let i = 0; i < 6; i++) {
            const figure = document.createElement("figure");
            figure.className = sides[i];
            figure.innerText = (i + 1).toString();
            die.appendChild(figure);
        }
        return die;
    }

    public roll(): number {
        const randInt = Math.floor(Math.random() * 6);
        const angles: vec3 = Die.cubeFaces[randInt].slice() as vec3;

        for (let i = 0; i < 3; i++) {
            angles[i] += 360 * (Math.floor(Math.random() * 3) - 1);
        }

        if (
            angles[0] === this.currentAngle[0] &&
            angles[1] === this.currentAngle[1] &&
            angles[2] === this.currentAngle[2]
        ) {
            angles[0] += 360;
            angles[2] -= 360;
        }

        this.rotateTo(angles);
        this.faceIndex = randInt;
        return this.faceIndex + 1;
    }

    private rotateTo(angles: vec3): void {
        this.dieDiv.style.transform =
            `rotateX(${angles[0]}deg) rotateY(${angles[1]}deg) rotateZ(${angles[2]}deg)`;
        this.currentAngle = angles;
    }

    private static cubeFaces: vec3[] = [
        [0, 0, 0],
        [0, -90, 0],
        [-90, 0, 0],
        [90, 0, 0],
        [0, 90, 0],
        [180, 0, 0]
    ];
}

class DiceArea {

    private dice: Die[] = [];
    private onRoll: ((newTotal: number) => void) | undefined;

    constructor(
        public diceholderDiv: HTMLDivElement,
        onRoll?: (newTotal: number) => void,
        initialDie?: number,
    ) {
        this.dice = [];
        this.diceholderDiv.classList.add("diceHolder");
        initialDie = initialDie || 0;
        for (let i = 0; i < initialDie; i++) {
            this.addDie();
        }
        this.onRoll = onRoll;
    }

    private updateTotal(): void {
        let sum = 0;
        for (let i = 0; i < this.dice.length; i++) {
            sum += this.dice[i].getValue();
        }
        if (this.onRoll) {
            this.onRoll(sum);
        }
    }

    public get diceCount(): number {
        return this.dice.length;
    }

    public rollDice(): void {
        this.dice.forEach((die) => die.roll());
        this.updateTotal();
    }

    public rollDie(dieId: number): void {
        if (this.dice[dieId]) {
            this.dice[dieId].roll();
            this.updateTotal();
        } else {
            throw Error(`Die with ID ${dieId} does not exist.`);
        }
    }

    public addDie(): number {
        const index = this.dice.length;
        this.dice.push(new Die(this.diceholderDiv, () => this.rollDie(index)));
        this.updateTotal();
        return this.dice.length;
    }

    public removeLast(): number {
        if (this.dice.length === 0) {
            return 0;
        }
        this.diceholderDiv.removeChild(this.dice[this.dice.length - 1].containerDiv);
        const die = this.dice.pop();
        this.updateTotal();
        return this.dice.length;
    }
}
