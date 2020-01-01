const display = document.querySelector("#display")
const nums = document.querySelectorAll('.num')
const funcs = document.querySelectorAll('.func')
const clear = document.querySelector("#clear")

const add = (x, y) => x + y

const subtract = (x, y) => x - y

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

const addToDisplay = (toAdd) => {
    display.value += toAdd
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
    display.value = ""
})


// function buttons add to display (except equals)
funcs.forEach(func => {
    if (func.id != "func-equal") {
        let funcID = func.innerText
        func.addEventListener("click", () => {
            addToDisplay(" " + funcID + " ")
        })
    }
})
