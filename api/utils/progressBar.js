const PAY = 50

function generateArray(arrLength, student) {
    const arr = []
    let studentPay = student.pay

    for (let i = 0; i < arrLength; i++) {

        if (student.studentType === 'contract') {

            if (studentPay >= PAY) {
                arr.push(PAY)
                studentPay -= PAY

            } else if (studentPay < PAY) {
                arr.push(studentPay)
                studentPay = 0

            } else if (studentPay === 0) {
                arr.push(0)
            }

        } else {
            arr.push(0)
        }
    }

    return arr
}

function customArray(student, noPayedMonth) {
    let arr = []
    let arrLength = 9

    arrLength = arrLength - noPayedMonth
    arr = generateArray(arrLength, student)

    for (let i = 0; i < noPayedMonth; i++) arr.unshift(null)

    return arr;
}

function switchMonth(month) {
    let index
    switch (month) {
        case 1: { index = 4; break }
        case 2: { index = 5; break }
        case 3: { index = 6; break }
        case 4: { index = 7; break }
        case 8: { index = 0; break }
        case 9: { index = 1; break }
        case 10: { index = 2; break }
        case 11: { index = 3; break }
        case 0:
        case 5:
        case 6:
        case 7: { index = null; break }
    }
    return index
}

module.exports = {
    progressBar(student) {
        const startMonth = new Date(student.startDate).getMonth()
        let arr = []

        switch (startMonth) {
            case 5:
            case 6:
            case 7:
            case 8: {
                arr = customArray(student, 0)
                console.log(arr, student)
                break
            }
            case 9: {
                arr = customArray(student, 1)
                break
            }
            case 10: {
                arr = customArray(student, 2);
                break;
            }
            case 11: {
                arr = customArray(student, 3);
                break;
            }
            case 0:
            case 1: {
                arr = customArray(student, 4);
                break;
            }
            case 2: {
                arr = customArray(student, 5);
                break;
            }
            case 3: {
                arr = customArray(student, 6);
                break;
            }
            case 4: {
                arr = customArray(student, 7);
                break;
            }

        }
        return arr;
    },

    payedMonth(month, progress) {
       const m = month || (new Date()).getMonth()
       console.log(m)
        return switchMonth(m) !== null 
        ? (progress[switchMonth(m)] === 50
            ? true
            : false) 
        : false

    }


}