import "./style.scss";

abstract class Listener {
	constructor(private inputElement: HTMLInputElement) {}
}

class moneyParser extends Listener {
	constructor(private element: HTMLInputElement) {
		super(element);
	}

	public currencyFormat() {
		let amount = this.element.value;

		if (this.checkInput(amount)) {
			amount = this.roundMoney(amount);
			amount = this.formatMoney(amount);
			this.element.value = amount;
		}

		if (this.element.value == "") {
			this.element.classList.remove("warning-input");
		}
	}

	private checkInput(amount: string) {
		const pattern = /^[0-9]+([,.][0-9]{2})?$/g;

		if (amount.match(pattern)) {
			this.element.classList.remove("warning-input");
			return true;
		} else {
			this.element.classList.add("warning-input");
			return false;
		}
	}

	private roundMoney(value: string) {
		value = value.replace(",", ".");
		return parseFloat(value).toFixed(2).toString().replace(".", ",");
	}

	private formatMoney(value: string) {
		return value.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.");
	}
}

class cardParser extends Listener {
	private accepted: boolean;
	private cardType!: string;

	constructor(
		private element: HTMLInputElement,
		private typeElement: HTMLInputElement
	) {
		super(element);
		this.accepted = false;
	}

	public cardFormat() {
        let cardNumber = this.element.value;
        
        if (this.checkInput(cardNumber)) {
            this.checkSupported(cardNumber);
		    this.showCardType(this.typeElement);
		    this.element.value = this.addSpace(cardNumber);
        }
        
        if (cardNumber == "") {
            this.element.classList.remove("warning-input");
            this.typeElement.innerHTML = "";
        }
	}

	private checkSupported(cardNumber: string) {
		const acceptedCards: any = {
			// HAD TO PUT any BECAUSE I COULDNT GET AWAY WITH AN REGEXP ERROR ODWN IN Object.keys
			visa: /^4[0-9]{12}(?:[0-9]{3})?$/,
			mastercard: /^5[1-5][0-9]{14}$|^2(?:2(?:2[1-9]|[3-9][0-9])|[3-6][0-9][0-9]|7(?:[01][0-9]|20))[0-9]{12}$/,
			amex: /^3[47][0-9]{13}$/,
			discover: /^65[4-9][0-9]{13}|64[4-9][0-9]{13}|6011[0-9]{12}|(622(?:12[6-9]|1[3-9][0-9]|[2-8][0-9][0-9]|9[01][0-9]|92[0-5])[0-9]{10})$/,
			dinersClub: /^3(?:0[0-5]|[68][0-9])[0-9]{11}$/,
			jcb: /^(?:2131|1800|35[0-9]{3})[0-9]{11}$/,
		};

		this.accepted = false;
		cardNumber = cardNumber.replace(/\D/g, ""); // REMOVING NON DIGIT CHARACTERS
		Object.keys(acceptedCards).forEach((key) => {
			let regex = acceptedCards[key]; // HERE WAS AN ERROR REGARDING acceptedCards FOR WHICH I HAD TO PUT IT TO any TYPE
			if (cardNumber.match(regex)) {
				this.accepted = true;
				this.cardType = key;
			}
		});

		if (!this.accepted) {
			this.cardType = "";
		}
	}

	private showCardType(typeElement: HTMLInputElement) {
		typeElement.innerHTML = this.cardType;
		typeElement.style.display = "flex";
	}

	private addSpace(cardNumber: string) {
		let tempValue = "";
		cardNumber = cardNumber.replace(/\s/g, "");
		for (let i = 0; i < cardNumber.length; i++) {
			if (i % 4 == 0 && i > 0) {
				tempValue = tempValue.concat(" ");
			}
			tempValue = tempValue.concat(cardNumber[i]);
		}
		return tempValue;
    }

    private checkInput(input: string) {
        const pattern = /^[0-9\s]+$/g;

        if (input.match(pattern)) {
            this.element.classList.remove("warning-input");
            return true;
        } else {
            this.element.classList.add("warning-input");
            return false;
        }
    }
}

document.addEventListener("DOMContentLoaded", () => {
	const moneyAmount = <HTMLInputElement>document.getElementById("money-amount");
	const cardNumber = <HTMLInputElement>document.getElementById("card-number");
	const cardType = <HTMLInputElement>document.getElementById("card-type");
	const resetButton = <HTMLInputElement>document.getElementById("reset-button");

	const moneyListener = new moneyParser(moneyAmount);
	const cardListener = new cardParser(cardNumber, cardType);

	moneyAmount.addEventListener("blur", () => {
		moneyListener.currencyFormat();
	});

	cardNumber.addEventListener("keyup", () => {
        cardListener.cardFormat();
    });

	resetButton.addEventListener("click", () => {
		moneyAmount.value = "";
		moneyAmount.classList.remove("warning-input");
	});
});
