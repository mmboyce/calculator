const display = document.querySelector("#display")
const nums = document.querySelectorAll('.num')
const funcs = document.querySelectorAll('.func')
const clear = document.querySelector("#func-clear")
const equals = document.querySelector("#func-equal")
const decimal = document.querySelector("#func-dec")
const bksp = document.querySelector("#func-bksp")

let equation = ""

const divideByZeroMsg = " YOU CAN'T DIVIDE BY ZERO >:[ "

const add = (x, y) => +x + +y

const subtract = (x, y) => +x - +y

const multiply = (x, y) => x * y

const divide = (x, y) => x / y

const operate = (operator, x, y) => {
    switch (operator) {
        case '+':
            return add(x, y)
        case '-':
            return subtract(x, y)
        case 'x':
        case '*':
            return multiply(x, y)
        case '/':
        case '÷':
            return divide(x, y)
        default:
            break;
    }
}

const getDisplayValue = () => {
    return display.value
}

const setDisplayValue = newValue => {
    display.value = newValue
}

const updateEquation = () => {
    equation = getDisplayValue()
}


const stripEquationSpaces = () => {
    if (getDisplayValue() === divideByZeroMsg) {
        return
    }

    equation = equation.split(" ").join('')
}

const getCurrentNumber = () => {
    const numReg = /[\d\.]+/g

    const displayValue = getDisplayValue()

    const nums = displayValue.match(numReg)

    return nums[nums.length - 1]
}

const currentNumberContainsDecimal = () => {
    return getCurrentNumber().includes('.')
}

const getLastDisplayCharacter = () =>
    (getDisplayValue().charAt(getDisplayValue().length - 1))

const addToDisplay = toAdd => {
    let lastChar = getLastDisplayCharacter()

    if (getDisplayValue() === divideByZeroMsg) {
        setDisplayValue("")
    }

    if (toAdd == ".") {
        if (lastChar == toAdd) {
            // we don't want repeated decimals
            return
        } else if (lastChar == " " || lastChar == "") {
            // Pressing the decimal before a number inserts a 0 before decimal
            toAdd = "0."
        } else if (currentNumberContainsDecimal()) {
            // We don't want repeated decimals in our numbers
            return
        }
    }

    setDisplayValue(getDisplayValue() + toAdd)
}

const addOperatorToDisplay = func => {
    let lastChar = getLastDisplayCharacter()
    if (lastChar === " " || lastChar === "") {
        // we don't want to be able operators to the end
        // of the display.
        return
    }

    addToDisplay(" " + func + " ")
}

const backspace = () => {
    let displayValue = ""
    let charsToRemove = 1
    let length = getDisplayValue().length

    if (getLastDisplayCharacter() == " ") {
        // then we have an operator that we must remove
        // since operators have spaces on either side, we must remove 3 chars
        charsToRemove = 3
    }

    displayValue = getDisplayValue().substring(0, length - charsToRemove)

    display.value = displayValue
}

const calculate = () => {
    updateEquation()

    // Regular Expression to find multiplication or division
    const multDivReg = /-*[\d\.]+[/\*]-*[\d\.]+/
    // Regular Expression to find addition or subtraction
    const addSubReg = /-*[\d\.]+[-\+]-*[\d\.]+/

    if (getLastDisplayCharacter() == " ") {
        // then our last input was an operator so no math can be done yet
        return
    }

    stripEquationSpaces()

    // Iterate for multiplaction or division with regex
    //   replace equation with solution
    while (equation.includes('*') || equation.includes('/')) {
        let match = equation.match(multDivReg)[0]

        if (match.includes('*')) {
            let firstFactor = match.split("*")[0]
            let secondFactor = match.split("*")[1]

            let product = operate('*', firstFactor, secondFactor)

            equation = equation.replace(match, product)

        } else if (match.includes('/')) {
            let dividend = match.split("/")[0]
            let divisor = match.split("/")[1]

            if (divisor == 0) {
                setDisplayValue(divideByZeroMsg)
                return
            }

            let quotient = operate('/', dividend, divisor)

            equation = equation.replace(match, quotient)
        }
    }

    // Itearte for addition or subtraction with regex
    //   replace equation with solution
    while (equation.includes('+') || equation.includes('-')) {
        let match = equation.match(addSubReg)

        if (match === null) {
            // This occurrs when our final solution is a negative number,
            // so we can just exit the loop
            break
        } else {
            // if match isn't null, then it is an array of length 1 that contains
            // an equation we need to solve.
            match = match[0]
        }

        if (match.includes("+")) {
            let firstAdd = match.split("+")[0]
            let secondAdd = match.split("+")[1]

            let sum = operate("+", firstAdd, secondAdd)

            equation = equation.replace(match, sum)
        } else if (match.includes("-")) {
            let firstSub = match.split("-")[0]
            let secondSub = match.split("-")[1]

            let difference = operate("-", firstSub, secondSub)

            equation = equation.replace(match, difference)
        }
    }

    // use string.prototype.match

    // e.g.
    // 15 + 12 * 2 + 22 - 18 / 3 =
    // 15 + [12 * 2] + 22 - 18 / 3 =
    // 15 + 24 + 22 - [18 / 3]
    // [15 + 24] + 22 - 6
    // [39 + 22] - 6
    // [61 - 6]
    // 55

    setDisplayValue(equation)

    if (currentNumberContainsDecimal()) {
        // We want to trim overly long decimals
        let firstHalf = getCurrentNumber().split('.')[0]
        let secondHalf = getCurrentNumber().split('.')[1]

        if (secondHalf.length > 3) {
            secondHalf = secondHalf.substring(0, 3)
            let truncated = [firstHalf, secondHalf].join('.')
            setDisplayValue(truncated)
        }
    }
}


// add eventListener to add nums to display
nums.forEach(num => {
    num.addEventListener("click", () => {
        let numId = num.innerText
        addToDisplay(numId)
    })
})

// clear button functionality
clear.addEventListener("click", () => {
    setDisplayValue("")
})

// function buttons add to display (except equals)
funcs.forEach(func => {
    let funcID = func.innerText
    func.addEventListener("click", () => {
        addOperatorToDisplay(funcID)
    })

})

// add equals button functionality
equals.addEventListener("click", () => {
    calculate()
})

// add decimal button functionality
decimal.addEventListener("click", () => {
    let dec = decimal.innerText
    addToDisplay(dec)
})

// add backspace button functionality
bksp.addEventListener("click", () => {
    backspace()
})