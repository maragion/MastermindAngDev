import {Component, ViewChild} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'MasterMindAng'

  // @ViewChild("numberInput") userNumber: any
  @ViewChild("messageLog") messageLog: any
  @ViewChild("guessLog") guessLog: any
  secretNumber: string
  guess: number
  result: { cows: number, bulls: number }
  message: any
  messages: any
  rules: boolean = true;
  gameField: boolean = false;
  repeatButton: boolean = false;
  checkButton: boolean = true
  helpButton: boolean = false;
  userNumber: string

  constructor() {
    this.secretNumber = this.makeSecretNumber();
    this.guess = 0;
    this.result = {
      cows: 0, bulls: 0
    };
    this.message = {};
    this.messages = []
    this.userNumber = ""
  }

  makeSecretNumber() {
    let secretNumber = "";
    for (let i = 0; i < 4; i++) {
      let randomNumber = Math.floor(Math.random() * 10).toString();

      if (randomNumber === "0" && i === 0) {
        i -= 1;
      } else if (secretNumber.includes(randomNumber)) {
        i -= 1;
      } else secretNumber += randomNumber;
    }
    return secretNumber
  }

  validateUserInput() {
    console.log(this.userNumber)
    let number = this.userNumber

    if (number[0] === "0") {
      this.message = {
        message: `Число не должно начинаться с нуля!`, type: "error"
      }
      return false
    } else if (!(Number.isInteger(Number(number))) || number.includes("e")) {
      this.message = {
        message: `Число должно состоять только из цифр!`, type: "error"
      }
      return false
    } else if (number.length > 4 || number.length < 4) {
      this.message = {
        message: `Число должно состоять из четырёх цифр!`, type: "error"
      }
      return false
    } else if (new Set(number).size !== number.length) {
      this.message = {
        message: `Цифры не должны повторяться!`, type: "error"
      }
      return false
    } else return true
  }

  countBullsAndCows() {
    if (!this.validateUserInput()) {
      return
    }
    let result = {
      cows: 0, bulls: 0
    }
    const secretNumber = this.secretNumber;
    let userNumber = this.userNumber

    for (let i = 0; i < secretNumber.length; i++) {
      if (userNumber[i] === secretNumber[i]) {
        result.bulls += 1;
      } else if (secretNumber.includes(userNumber[i])) {
        result.cows += 1;
      }
    }
    this.guess += 1;
    this.result = result;
    this.message = {
      message: `Вы ввели: ${userNumber}
                    Коровы: ${this.result.cows}, Быки: ${this.result.bulls}`, type: "ok"
    };
  }

  checkWin() {
    if (this.result.bulls === 4) {
      this.message = {message: `Вы Победили!!! Количество попыток: ${this.guess}`, type: "win"};
      this.repeatButton = true;
      this.checkButton = false;
    }
    return true
  }

  sendMessage() {
    this.messages.push(this.message);
  }

  help() {
    let help: string[] = [" Число состоит из четырёх цифр в формате '1234'.",
      " Цифры не повторяются. Загаданное число не начинается с нуля.",
      "'Корова' - цифра есть в числе, но не на своём месте.",
      "'Бык' - цифра есть в числе и стоит на своём месте."];

    help.forEach(item => this.messages.push({message: item, type: "help"}));
    setTimeout(() => this.scroll(), 0);
  }

  step() {
    this.countBullsAndCows();
    this.checkWin();
    this.sendMessage();
    //TODO: Think about remove setTimeout
    setTimeout(() => this.scroll(), 0);
  }

  hideRules() {
    this.rules = false;
  }

  showGame() {
    this.gameField = true;
    this.helpButton = true;
  }

  startGame() {
    this.hideRules();
    this.showGame();
    this.makeSecretNumber();
    console.log(this.secretNumber);
  }

  playAgain() {
    this.secretNumber = this.makeSecretNumber();
    this.repeatButton = false;
    this.checkButton = true;
    this.guess = 0;
  }

  scroll() {
    this.messageLog.nativeElement.scrollTop = this.messageLog.nativeElement.scrollHeight;
  }
}
