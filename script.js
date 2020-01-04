const display = document.querySelector("#display")
const nums = document.querySelectorAll('.num')
const funcs = document.querySelectorAll('.func')
const clear = document.querySelector("#clear")
const equals = document.querySelector("#func-equal")

let equation = ""

const testVal = "10 / 2 + 15 - 30 + 10 * 2"

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
    equation = equation.split(" ").join('')
}

const addToDisplay = toAdd => {
    display.value += toAdd
}

const addOperatorToDisplay = func => {
    let lastChar = display.value.charAt(display.value.length - 1)
    if (lastChar === " " || lastChar === "") {
        // we don't want to be able operators to the end
        // of the display.
        return
    }

    addToDisplay(" " + func + " ")
}

const calculate = () => {
    updateEquation()
    stripEquationSpaces()

    // Regular Expression to find multiplication or division
    const multDivReg = /-*[\d]+[/\*]-*[\d]+/
    // Regular Expression to find addition or subtraction
    const addSubReg = /-*[\d]+[-\+]-*[\d]+/

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

            let quotient = operate('/', dividend, divisor)

            equation = equation.replace(match, quotient)
        }
    }

    // Itearte for addition or subtraction with regex
    //   replace equation with solution
    while (equation.includes('+') || equation.includes('-')) {
        let match = equation.match(addSubReg)

        if(match === null){
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
    if (func.id != "func-equal") {
        let funcID = func.innerText
        func.addEventListener("click", () => {
            addOperatorToDisplay(funcID)
        })
    }
})

// add equals button functionality
equals.addEventListener("click", () => {
    calculate()
})