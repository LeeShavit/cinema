'use strict'

var gCinema
var gElSelectedSeat = null
var gSelectedSeat= null
var isHighlight = false

var gColBreaks= [2,7]
var gRowBreaks= [3]

function onInit() {
    gCinema = createCinema()
    renderCinema()
}

function createCinema() {
    const cinema = []

    for (var i = 0; i < 6; i++) {
        cinema[i] = []
        for (var j = 0; j < 10; j++) {
            var isSeat = true
            if (isAtBreak(i,j)) isSeat = false
            const cell = { isSeat: isSeat }
            if (cell.isSeat) {
                cell.price = 5 + i
                cell.isBooked = false
            }
            cinema[i][j] = cell
        }
    }
    cinema[4][4].isBooked = true
    return cinema
}

function renderCinema() {
    var strHTML = ''

    for (var i = 0; i < gCinema.length; i++) {
        strHTML += `<tr class="cinema-row" >\n`
        for (var j = 0; j < gCinema[0].length; j++) {
            const cell = gCinema[i][j]

            // For a cell of type SEAT add seat class
            var className = (cell.isSeat) ? 'seat' : ''

            // For a cell that is booked add booked class
            if (cell.isBooked) {
                className += ' booked'
            }

            // Add a seat title
            const title = `Seat: ${i + 1}, ${j + 1}`
            const data = `data-i="${i}" data-j="${j}"`
            strHTML += `\t<td ${data}title="${title}" class="cell ${className}" 
                            onclick="onCellClicked(this, ${i}, ${j})" >
                         </td>\n`
        }
        strHTML += `</tr>\n`
    }

    const elSeats = document.querySelector('.cinema-seats')
    elSeats.innerHTML = strHTML
}

function onCellClicked(elCell, i, j) {
    const cell = gCinema[i][j]

    // ignore none seats and booked seats
    if (!cell.isSeat || cell.isBooked) return

    console.log('Cell clicked: ', elCell, i, j)

    // Selecting a seat
    elCell.classList.add('selected')

    // Only a single seat should be selected
    if (gElSelectedSeat) {
        gElSelectedSeat.classList.remove('selected')
    }
    gElSelectedSeat = (gElSelectedSeat !== elCell) ? elCell : null
    gSelectedSeat= {i,j}
    // When seat is selected a popup is shown
    if (gElSelectedSeat) {
        showSeatDetails({ i, j })
    } else {
        hideSeatDetails()
    }
}

function showSeatDetails(pos) {
    const elPopup = document.querySelector('.popup')
    const elBtn = elPopup.querySelector('.btn-book-seat')

    const seat = gCinema[pos.i][pos.j]

    elPopup.querySelector('h2 span').innerText = `${pos.i + 1}-${pos.j + 1}`
    elPopup.querySelector('h3 span').innerText = `${seat.price}`
    elPopup.querySelector('h4 span').innerText = countAvailableSeatsAround(gCinema, pos.i, pos.j)

    elBtn.dataset.i = pos.i
    elBtn.dataset.j = pos.j
    elPopup.hidden = false
}

function hideSeatDetails() {
    document.querySelector('.popup').hidden = true
}

function onBookSeat(elBtn) {
    console.log('Booking seat, button: ', elBtn)
    const i = +elBtn.dataset.i
    const j = +elBtn.dataset.j

    gCinema[i][j].isBooked = true
    renderCinema()

    hideSeatDetails()
}

function countAvailableSeatsAround(board, rowIdx, colIdx) {
    var count = 0

    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i >= board.length) continue
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (i === rowIdx && j === colIdx) continue
            if (j < 0 || j >= board[0].length) continue
            var currCell = board[i][j]
            if (currCell.isSeat && !currCell.isBooked) {
                count++
                if(isHighlight){
                    highlightSeat(i,j)
                }
            }
        }
    }
    if(isHighlight){
        isHighlight=false
        return
    } 
    return count
}

function onHighlight(){
    isHighlight=true
    countAvailableSeatsAround(gCinema,gSelectedSeat.i,gSelectedSeat.j)
} 


function highlightSeat(i,j){
    const elSeat = document.querySelector(`[data-i="${i}"][data-j="${j}"]`)
    elSeat.classList.add('highlighted')
    setTimeout(()=> elSeat.classList.remove('highlighted'),2500)
}

function isAtBreak(idxRow,idxCol){
    for (var i = 0; i < gColBreaks.length; i++) {
        if(gColBreaks[i]===idxCol) return true
    }
    for (var i = 0; i < gRowBreaks.length; i++) {
        if(gRowBreaks[i]===idxRow) return true
    }
    return false
}




