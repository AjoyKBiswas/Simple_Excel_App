//Rather than having separate view for all sheets, we just store the data in every sheet separately, we will use the UI view of single sheet only.
//When we toggle between sheets, both allSheetsPropsDB and allSheetsGraphMatrix array have to be accessed, similarly  when we modify some sheet,
//both allSheetsPropsDB and allSheetsGraphMatrix array have to be modified accordingly

let sheet_addicon_elem = document.querySelector(".sheet-add-icon");
let sheets_folder_cont_elem = document.querySelector(".sheets-folder-cont");
sheet_addicon_elem.addEventListener("click", (event) => {
    let new_sheet_div = document.createElement("div");
    new_sheet_div.setAttribute("class", "sheet-folder");
    let allSheetsFolder_elem = document.querySelectorAll(".sheet-folder");

    new_sheet_div.setAttribute("id", allSheetsFolder_elem.length);
    new_sheet_div.innerHTML = `<div class="sheet-content">Sheet_${allSheetsFolder_elem.length}</div>`;
    sheets_folder_cont_elem.appendChild(new_sheet_div);
    new_sheet_div.scrollIntoView();  //to bring the newly added sheet into window view, when sheet names gets out of current window dimensions.
    createAllSheetPropsDB();
    createAllSheetGraphMatrix();
    handleSheetActiveness(new_sheet_div);
    handleSheetRemoval(new_sheet_div);
    new_sheet_div.click();  //whenever a new sheet is added, it will be automatically clicked/selected.
})

function handleSheetRemoval(selected_sheet){
    selected_sheet.addEventListener("mousedown", (event) => {
        //remove sheet on right click -> mousedown can be left click(0) or scroll(1)  or right click(2)
        let clicked = event.button;
        if(clicked !== 2){
            return;
        }
        let allSheetsFolder_elem = document.querySelectorAll(".sheet-folder");
        if(allSheetsFolder_elem.length == 1){
            alert("You need to have atleast 1 sheet opened!");
            return;
        }
        let response = confirm("Your sheet will be removed permanently, procceed?");
        if(response === false){
            return;
        }
        //To delete sheet, we need to get sheet id, using which we will delete from sheet DB and Graph DB.
        let sheet_idx = Number(selected_sheet.getAttribute("id"));
        allSheetPropsDB.splice(sheet_idx, 1);  //remove 1 element starting from index sheet_idx
        allSheetGraphMatrix.splice(sheet_idx, 1);
        
        //After selected sheet is deleted, sheetDB and graph_matrix has to be pointed to sheet_0's DB entry.If sheet_0 is deleted, allSheetPropsDB[0]
        //and allSheetGraphMatrix[0] will automatically point to sheet_1's entries.
        sheetDB = allSheetPropsDB[0];
        graph_matrix = allSheetGraphMatrix[0];
        ApplyingSheetPropsOnToggling();  //since selected/active sheet is sheet_0, its properties needs to be applied on the cells
        handleSheetNameUIRemoval(selected_sheet);  //remove sheet from UI
    })
}

//If we delete i-th sheet, then (i+1)th sheet will be placed at i-th index, but the sheet name will not match the sheet id, this needs to be managed.
function handleSheetNameUIRemoval(selected_sheet){
    //Remove sheet itself from UI
    selected_sheet.remove();  //ith sheet removed
    let allSheetsFolder_elem = document.querySelectorAll(".sheet-folder");
    for(let i = 0; i<allSheetsFolder_elem.length; i++){
        allSheetsFolder_elem[i].setAttribute("id", i);  //correcting id attribute
        let sheet_content_elem = allSheetsFolder_elem[i].querySelector(".sheet-content");
        sheet_content_elem.innerText = `Sheet_${i}`;  //correcting the sheet name, matching the id attribute
    }
    handleSheetBtnColor(allSheetsFolder_elem[0]);  //we need to highlight sheet_0 by-default automatically
}

function createAllSheetPropsDB(){
    let sheetDB = [];
    for(let i = 0; i<rows; i++){
        let sheetrow = [];
        for(let j = 0; j<cols; j++){
            let cell_props = {
            bold:false,
            italic:false,
            underline:false,
            alignment:"left",
            fontfamily:"Arial Black",
            fontsize:"16",
            fontcolor:"#000000",  //black
            bgcolor: "#ffffff",  //white
            cell_value: "",  //when user puts some formula & evaluates for a cell, result is stored here
            formula: "",  //value at current cell was produced by this formula
            children:[],  //current cell needs to store its dependent/children cells, to help derive part of results for its dependent/children cells,
            //so that whenever value at current cell changes, values at dependent cells are accordiingly re-evaluated & put + stored
            };
        sheetrow.push(cell_props);
        }
    sheetDB.push(sheetrow);
    }
    allSheetPropsDB.push(sheetDB);
}

//For each sheet, there will be separate graph relations (dependencies),so separate graph matrices have to be maintained
function createAllSheetGraphMatrix(){
    let graph_matrix = [];  //3-D matrix
    for(let i = 0; i<rows; i++){
        let curr_row = [];
        for(let j = 0; j<cols; j++){
            curr_row.push([]);
        }
        graph_matrix.push(curr_row);
    }
    allSheetGraphMatrix.push(graph_matrix);
}

function InitializeSelectedSheet(sheet_index){
    sheetDB = allSheetPropsDB[sheet_index];
    graph_matrix = allSheetGraphMatrix[sheet_index];
}

function ApplyingSheetPropsOnToggling(){
    for(let i = 0; i<rows; i++){
        for(let j = 0; j<cols; j++){
            let curr_cell = document.querySelector(`.col-cell[row_id="${i}"][col_id="${j}"]`);
            let source_cell_props = sheetDB[i][j];
            //curr_cell.click();  //will trigger focus_cell.addEventListener() in cell_properties.js after blur (clicking a certain cell ), & moving to 
            //next cell to apply properties on it & Store in DB object
            curr_cell.innerText = source_cell_props.cell_value;  //needed because of curr_cell.click() step is not used.
            curr_cell.style.fontWeight = (source_cell_props.bold ? "bold" : "normal");
            curr_cell.style.fontStyle = (source_cell_props.italic ? "italic" : "normal");
            curr_cell.style.textDecoration = (source_cell_props.underline ? "underline" : "none");
            curr_cell.style.fontSize = source_cell_props.fontsize + "px";
            curr_cell.style.fontFamily = source_cell_props.fontfamily;
            curr_cell.style.color = source_cell_props.fontcolor;
            curr_cell.style.backgroundColor = source_cell_props.bgcolor;
            curr_cell.style.textAlign = source_cell_props.alignment;
        }
    }
    //by default selected cell will be A1 when page is opened, this has to be reflected in address bar. For first cell, we dont need row/col ID.
    //let firstCell = document.querySelectorAll(".col-cell")[0];
    let firstCell = document.querySelector(".col-cell");
    firstCell.click();
}

//function to display sheet properties, whichever sheet we will be on
function handleSheetActiveness(selected_sheet){
    //sheet-content element has id attribute, which we can use as index in allSheetPropsDB array to access a specific sheet
    selected_sheet.addEventListener("click", (event) => {
        let sheet_idx = Number(selected_sheet.getAttribute("id"));
        InitializeSelectedSheet(sheet_idx);
        // sheetDB = allSheetPropsDB[sheet_index];
        // graph_matrix = allSheetGraphMatrix[sheet_index];
        ApplyingSheetPropsOnToggling();
        handleSheetBtnColor(selected_sheet);  //newly created sheet has to be highlighted as selected.
    })
}

//function to highlight the selected sheet uisng a specific color
function handleSheetBtnColor(selected_sheet){
    let allSheetsContent_elems = document.querySelectorAll(".sheet-content");
    for(let i = 0; i<allSheetsContent_elems.length; i++){
        allSheetsContent_elems[i].style.backgroundColor = "whitesmoke";  //rest of the sheets are set as default color, as some other sheet would have been
        //selected previously
    }
    let selected_sheet_content_elem = selected_sheet.querySelector(".sheet-content");
    selected_sheet_content_elem.style.backgroundColor = "darkgray";  //only selected sheet is highlighted
}