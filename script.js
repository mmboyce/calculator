const add = (x, y) => x + y

const subtract = (x, y) => x - y

const multiply = (x, y) => x * y

const divide = (x, y) => x / y

const operate = (operator, x, y) => {
    switch (operator) {
        case '+':
            return add(x,y)
        case '-':
            return subtract(x,y)
        case 'x':
        case '*':
            return multiply(x,y)
        case '/':
        case '÷':
            return divide(x,y)
        default:
            break;
    }
}