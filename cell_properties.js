let allSheetPropsDB = [];
let sheetDB = [];  //initialied in sheets_handling.js in handleSheetActiveness() function

{
    let sheet_addicon_elem = document.querySelector(".sheet-add-icon");
    sheet_addicon_elem.click();  //will trigger sheet_addicon_elem.addEventListener() in sheets_handling.js, firs ttime when index.html is opened,
    //so that by-default 1 sheet is mandatority opened automatically, rather than hardcoding sheet_0 in index.html
    ApplyingSheetPropsOnToggling();  //Applying cell props for the 1st sheet that is automatically opened, in sheets_handling.js
}

// for(let i = 0; i<rows; i++){
//     let sheetrow = [];
//     for(let j = 0; j<cols; j++){
//         let cell_props = {
//             bold:false,
//             italic:false,
//             underline:false,
//             alignment:"left",
//             fontfamily:"Arial Black",
//             fontsize:"16",
//             fontcolor:"#000000",  //black
//             bgcolor: "#ffffff",  //white
//             cell_value: "",  //when user puts some formula & evaluates for a cell, result is stored here
//             formula: "",  //value at current cell was produced by this formula
//             children:[],  //current cell needs to store its dependent/children cells, to help derive part of results for its dependent/children cells,
//             //so that whenever value at current cell changes, values at dependent cells are accordiingly re-evaluated & put + stored
//         };
//         sheetrow.push(cell_props);
//     }
//     sheetDB.push(sheetrow);
// }

let fontfamily_elem = document.querySelector(".font-family-prop");
let fontsize_elem = document.querySelector(".font-size-prop");
let bold_elem = document.querySelector(".bold");
let italic_elem = document.querySelector(".italic");
let underline_elem = document.querySelector(".underline");
let fontcolor_elem = document.querySelector(".font-color-prop");
let bgcolor_elem = document.querySelector(".bg-color-prop");
let alignment_elem = document.querySelectorAll(".alignment");
let left_align = alignment_elem[0];
let center_align = alignment_elem[1];
let right_align = alignment_elem[2];
let justify_align = alignment_elem[3];
let active_cellprop_color = "#ffffff";  //white
let inactive_cellprop_color = "#778899";  //lightslategray, whatever surrounding color is set as default
let all_cells = document.querySelectorAll(".col-cell");  //get all cells

//Attach cell property event listeners by applying 2-way-binding
//For bold property
bold_elem.addEventListener("click", (event) => {
    //when bold is clicked, to make the selected cell content bold, we need access to that cell
    //this we can do by getting the content of address bar which shows current selected cell's co-oridnate
    let address_bar_elem = document.querySelector(".address-bar");
    let cell_addr = address_bar_elem.value;
    //console.log(cell_addr);
    let [active_cell, active_cell_props] = getActiveCellAndProps(cell_addr);
    //when bold is clciked, if already bold, do unbold, if unbold, do bold.
    active_cell_props.bold = !active_cell_props.bold;
    //Change the cell UI format
    active_cell.style.fontWeight = (active_cell_props.bold ? "bold" : "normal");
    // if(active_cell_props.bold){
    //     active_cell.style.fontWeight = "bold";
    // }
    // else{
    //     active_cell.style.fontWeight = "normal";
    // }
    bold_elem.style.backgroundColor = (active_cell_props.bold ? active_cellprop_color : inactive_cellprop_color);
})
//for italic property
italic_elem.addEventListener("click", (event) => {
    let address_bar_elem = document.querySelector(".address-bar");
    let cell_addr = address_bar_elem.value;
    //console.log(cell_addr);
    let [active_cell, active_cell_props] = getActiveCellAndProps(cell_addr);
    //when italic is clciked, if already italic, do unbold, if non-italic, do italic.
    active_cell_props.italic = !active_cell_props.italic;
    //Change the cell UI format
    active_cell.style.fontStyle = (active_cell_props.italic ? "italic" : "normal");
    italic_elem.style.backgroundColor = (active_cell_props.italic ? active_cellprop_color : inactive_cellprop_color);
})
//for underlining
underline_elem.addEventListener("click", (event) => {
    let address_bar_elem = document.querySelector(".address-bar");
    let cell_addr = address_bar_elem.value;
    //console.log(cell_addr);
    let [active_cell, active_cell_props] = getActiveCellAndProps(cell_addr);
    //when italic is clciked, if already italic, do unbold, if non-italic, do italic.
    active_cell_props.underline = !active_cell_props.underline;
    //Change the cell UI format
    active_cell.style.textDecoration = (active_cell_props.underline ? "underline" : "none");
    underline_elem.style.backgroundColor = (active_cell_props.underline ? active_cellprop_color : inactive_cellprop_color);
})
//for changing font size
fontsize_elem.addEventListener("change", (event) => {
    let address_bar_elem = document.querySelector(".address-bar");
    let cell_addr = address_bar_elem.value;
    //console.log(cell_addr);
    let [active_cell, active_cell_props] = getActiveCellAndProps(cell_addr);
    active_cell_props.fontsize = fontsize_elem.value;  //changing the cell property object stored in sheetDB
    //console.log(fontsize_elem.value);
    active_cell.style.fontSize = active_cell_props.fontsize + "px";  //acually changing of cell content
    fontsize_elem.value = active_cell_props.fontsize;  //changing the property's chosen value to be displayed in drop-down menu
})

//for changing font family
fontfamily_elem.addEventListener("change", (event) => {
    let address_bar_elem = document.querySelector(".address-bar");
    let cell_addr = address_bar_elem.value;
    //console.log(cell_addr);
    let [active_cell, active_cell_props] = getActiveCellAndProps(cell_addr);
    active_cell_props.fontfamily = fontfamily_elem.value;
    //console.log(fontfamily_elem.value);
    active_cell.style.fontFamily = active_cell_props.fontfamily;
    fontfamily_elem.value = active_cell_props.fontfamily;
})

//for changing font text color
fontcolor_elem.addEventListener("change", (event) => {
    let address_bar_elem = document.querySelector(".address-bar");
    let cell_addr = address_bar_elem.value;
    //console.log(cell_addr);
    let [active_cell, active_cell_props] = getActiveCellAndProps(cell_addr);
    active_cell_props.fontcolor = fontcolor_elem.value;
    //console.log(fontcolor_elem.value);
    active_cell.style.color = active_cell_props.fontcolor;
    fontcolor_elem.value = active_cell_props.fontcolor;
    //fontcolor_elem.color = active_cell_props.fontcolor;
})

bgcolor_elem.addEventListener("change", (event) => {
    let address_bar_elem = document.querySelector(".address-bar");
    let cell_addr = address_bar_elem.value;
    //console.log(cell_addr);
    let [active_cell, active_cell_props] = getActiveCellAndProps(cell_addr);
    active_cell_props.bgcolor = bgcolor_elem.value;
    //console.log(bgcolor_elem.value);
    active_cell.style.backgroundColor = active_cell_props.bgcolor;
    bgcolor_elem.value = active_cell_props.bgcolor;
})

//alignments are mutually exclusive, so we attach eventListeners to each of the alignments nodelist, and use switch case
alignment_elem.forEach((alignment) => {
    alignment.addEventListener("click", (event) => {
        let address_bar_elem = document.querySelector(".address-bar");
        let cell_addr = address_bar_elem.value;
        //console.log(cell_addr);
        let [active_cell, active_cell_props] = getActiveCellAndProps(cell_addr);
        let align_value = event.target.classList[0];  //will return left/right/center/justify
        //console.log(align_value);
        active_cell_props.alignment = align_value;
        active_cell.style.textAlign = active_cell_props.alignment;
        // event.target.backgroundColor = active_cellprop_color;
         switch (align_value) {
            case "left":
                //Only left is active
                left_align.style.backgroundColor = active_cellprop_color;
                right_align.style.backgroundColor = inactive_cellprop_color;
                center_align.style.backgroundColor = inactive_cellprop_color;
                justify_align.style.backgroundColor = inactive_cellprop_color;
                break;
            case "right":
                left_align.style.backgroundColor = inactive_cellprop_color;
                //only right is active
                right_align.style.backgroundColor = active_cellprop_color;
                center_align.style.backgroundColor = inactive_cellprop_color;
                justify_align.style.backgroundColor = inactive_cellprop_color;
                break;
            case "center":
                left_align.style.backgroundColor = inactive_cellprop_color;
                right_align.style.backgroundColor = inactive_cellprop_color;
                //only center is active
                center_align.style.backgroundColor = active_cellprop_color;
                justify_align.style.backgroundColor = inactive_cellprop_color;
                break;
            case "justify":
                left_align.style.backgroundColor = inactive_cellprop_color;
                right_align.style.backgroundColor = inactive_cellprop_color;
                center_align.style.backgroundColor = inactive_cellprop_color;
                //only justify is active
                justify_align.style.backgroundColor = active_cellprop_color;
                break;
            default: "left"
                break;
         }
    })
})

function getActiveCellAndProps(cell_addr){
    let [rowId, colId] = getActiveCellCoordinates(cell_addr);
    let active_cell = document.querySelector(`.col-cell[row_id="${rowId}"][col_id="${colId}"]`);
    //console.log(active_cell);
    let active_cell_props = sheetDB[rowId][colId];
    //console.log(active_cell_props);
    return [active_cell, active_cell_props];
}

function getActiveCellCoordinates(cell_address){
    let rowId = Number(cell_address.slice(1)-1);
    let colId = Number(cell_address.charCodeAt(0)) - 65;
    //console.log(rowId, colId);
    return [rowId, colId];
}

//Iterating over all cells to add event Listener so that when clicked, it highlights all properties applied
for(let i = 0; i<all_cells.length; i++){
    let selected_cell = all_cells[i];
    PropsAppliedOnSelectedCell(selected_cell);
}

//Function to highlight all cell properties applied on selecting a cell
function PropsAppliedOnSelectedCell(selected_cell){
    selected_cell.addEventListener("click", (event) => {
        let address_bar_elem = document.querySelector(".address-bar");
        let cell_addr = address_bar_elem.value;
        //console.log(cell_addr);
        let [rowId, colId] = getActiveCellCoordinates(cell_addr);
        active_cell_props = sheetDB[rowId][colId];
        //console.log(active_cell_props);
        bold_elem.style.backgroundColor = (active_cell_props.bold ? active_cellprop_color : inactive_cellprop_color);
        italic_elem.style.backgroundColor = (active_cell_props.italic ? active_cellprop_color : inactive_cellprop_color);
        underline_elem.style.backgroundColor = (active_cell_props.underline ? active_cellprop_color : inactive_cellprop_color);
        fontsize_elem.value = active_cell_props.fontsize;
        fontfamily_elem.value = active_cell_props.fontfamily;
        fontcolor_elem.value = active_cell_props.fontcolor;
        bgcolor_elem.value = active_cell_props.bgcolor;
        switch (active_cell_props.alignment) {
            case "left":
                //Only left is active
                left_align.style.backgroundColor = active_cellprop_color;
                right_align.style.backgroundColor = inactive_cellprop_color;
                center_align.style.backgroundColor = inactive_cellprop_color;
                justify_align.style.backgroundColor = inactive_cellprop_color;
                break;
            case "right":
                left_align.style.backgroundColor = inactive_cellprop_color;
                //only right is active
                right_align.style.backgroundColor = active_cellprop_color;
                center_align.style.backgroundColor = inactive_cellprop_color;
                justify_align.style.backgroundColor = inactive_cellprop_color;
                break;
            case "center":
                left_align.style.backgroundColor = inactive_cellprop_color;
                right_align.style.backgroundColor = inactive_cellprop_color;
                //only center is active
                center_align.style.backgroundColor = active_cellprop_color;
                justify_align.style.backgroundColor = inactive_cellprop_color;
                break;
            case "justify":
                left_align.style.backgroundColor = inactive_cellprop_color;
                right_align.style.backgroundColor = inactive_cellprop_color;
                center_align.style.backgroundColor = inactive_cellprop_color;
                //only justify is active
                justify_align.style.backgroundColor = active_cellprop_color;
                break;
            default: "left"
                break;
        }

        //Also displaying the formula associated to the cell clicked on
        let [clicked_cell, clicked_cell_props] = getActiveCellAndProps(cell_addr);
        let formula_bar_elem = document.querySelector(".formula-bar");
        formula_bar_elem.value = clicked_cell_props.formula;
        clicked_cell.innerText = clicked_cell_props.cell_value;
    })
}