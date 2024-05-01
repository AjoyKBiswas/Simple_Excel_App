let rows = 100;
let cols = 26;
let address_col_cont = document.querySelector(".address-col-cont");
for(let i = 0; i<rows; i++){
    let address_col = document.createElement("div");
    address_col.setAttribute("class", "address_col")
    address_col.innerText = i+1;
    address_col_cont.appendChild(address_col);
}

let address_row_cont = document.querySelector(".address-row-cont");
for(let i = 0; i<cols; i++){
    let address_row = document.createElement("div");
    address_row.setAttribute("class", "address_row");
    address_row.innerText = String.fromCharCode(65 + i);  //String.fromCharCode(65) -> A
    address_row_cont.appendChild(address_row);
}

function add_Event_Listen_Cell_Select(selected_cell, row_num, col_id){
    selected_cell.addEventListener("click", (event) => {
        let address_bar = document.querySelector(".address-bar");
        let row = row_num + 1;
        let col = String.fromCharCode(65 + col_id);
        // address_bar.value = col + row;
        address_bar.value = `${col}${row}`;
    })
}

let cells_cont = document.querySelector(".cells-cont")
for(let i = 0 ; i<rows; i++){
    let row_cont = document.createElement("div");
    row_cont.setAttribute("class", "row-cont");
    for(let j = 0; j<cols; j++){
        let cell = document.createElement("div");
        cell.setAttribute("class", "col-cell");
        cell.setAttribute("contenteditable", "true");
        //setting attributes for each cell for their speific storage identification for accessing applied cell properties
        cell.setAttribute("row_id", i);
        cell.setAttribute("col_id", j);
        //To ignore mis-spelled words
        cell.setAttribute("spellcheck", "false");
        row_cont.appendChild(cell);
        //function for showing cell address when a cell is selected
        add_Event_Listen_Cell_Select(cell, i ,j);
    }
    cells_cont.appendChild(row_cont);
}

//by default selected cell will be A1 when page is opened, this has to be reflected in address bar. For first cell, we dont need row/col ID.
//let firstCell = document.querySelectorAll(".col-cell")[0];
//let firstCell = document.querySelector(".col-cell");
//firstCell.click();
