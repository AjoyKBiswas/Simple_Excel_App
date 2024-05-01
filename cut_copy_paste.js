//Script for selecting range of cells for copy/paste operation will be done by ctrl+click on the top-left & bottom-right cell
let copy_button = document.querySelector(".copy");
let cut_button = document.querySelector(".cut");
let paste_button = document.querySelector(".paste");
let copy_operation = false;
let cut_operation = false;

let ctrl_key;
document.addEventListener("keydown", (event) => {
    ctrl_key = event.ctrlKey;  //true if ctrl is pressed & hold
})
document.addEventListener("keyup", (event) => {
    ctrl_key = event.ctrlKey;  //true if ctrl is not pressed/pressed but not hold
})

//adding event listener on all cells
for(let i = 0; i<rows; i++){
    for(let j = 0; j<cols; j++){
        let curr_cell = document.querySelector(`.col-cell[row_id="${i}"][col_id="${j}"]`);
        handleClickedCell_Selection(curr_cell);
    }
}

//function to process clicked cell for selecting range for performing copy/cut operation
let cell_range_arr = [];
function handleClickedCell_Selection(curr_cell){
    curr_cell.addEventListener("click", (event) => {
        if(!ctrl_key){  //if ctrl is pressed & hold (not holding will set ctrl_key to false as soon as Listener senses ctrl keyup)
            return;
        }
        if(cell_range_arr.length >= 2){  //cell_range_arr must have exactly 2 cell co-ordinates.
            //return;  //so if already 2 or more exists in cell_range_arr array, return.
            //when we want to discard current range selection, (that is for 3rd entry onwards) & select new range.
            handleUIPostCutCopy();
            cell_range_arr = [];  //make array empty for new entries
        }
        //highligting the selected cell
        curr_cell.style.border = "3px solid #008b8b";
        //We need the co-oridnates of clicked cell & push in cell_range_arr array
        let cell_rid = Number(curr_cell.getAttribute("row_id"));
        let cell_colid = Number(curr_cell.getAttribute("col_id"));
        cell_range_arr.push([cell_rid, cell_colid]);
        //console.log(cell_range_arr);
    })
}

function handleUIPostCutCopy(){
    for(let i = 0; i<cell_range_arr.length; i++){
        let cell = document.querySelector(`.col-cell[row_id="${cell_range_arr[i][0]}"][col_id="${cell_range_arr[i][1]}"]`);
        cell.style.border = "0.1px solid";  //whatever is set in style.css
    }
}

let copied_data_storage = [];  //2D array for storing selected cells's data
//after selecting cell range  to copy, if clicked on copy button.
copy_button.addEventListener("click", (event) => {
    if(cell_range_arr.length <2){
        alert("Range cells not selected, copy properly by selecting 2 cells!");
        cell_range_arr = [];
        return;
    }
    copy_operation = true;
    cut_operation = false;
    copied_data_storage = [];  //refresh by discarding copied data from last copy operation
    let [top_rid, bottom_rid, top_cid, bottom_cid] = [cell_range_arr[0][0], cell_range_arr[1][0], cell_range_arr[0][1], cell_range_arr[1][1]];
    for(let i = top_rid; i<=bottom_rid; i++){
        let copied_data_store_row = [];
        for(let j = top_cid; j<=bottom_cid; j++){
            let curr_cell_props = sheetDB[i][j];
            copied_data_store_row.push(curr_cell_props);
        }
        copied_data_storage.push(copied_data_store_row);
    }
    //console.log('Copy DS:', copied_data_storage);
    handleUIPostCutCopy();  //after copy is done, no need to highlight the selected cell range any more.
})

let cut_data_storage = [];
cut_button.addEventListener("click", (event) => {
    if(cell_range_arr.length <2){
        alert("Range cells not selected, cut properly by selecting 2 cells!");
        cell_range_arr = [];
        return;
    }
    copy_operation = false;
    cut_operation = true;
    cut_data_storage = [];  //refresh by discarding cut data from last cut operation
    let [top_rid, bottom_rid, top_cid, bottom_cid] = [cell_range_arr[0][0], cell_range_arr[1][0], cell_range_arr[0][1], cell_range_arr[1][1]];
    // copy_button.click();  //for both copy & cut, the temporary storage operation remains exactly same.
    for(let i = top_rid; i<=bottom_rid; i++){
        let cut_data_store_row = [];
        for(let j = top_cid; j<=bottom_cid; j++){
            let src_cell_props = sheetDB[i][j];
            let target_cell_props = Object.assign({}, sheetDB[i][j]);  //for cut operation, needs deep cloning of cell_prop object, because we will have
            //have to remove the source cell's data, i.e., source cell objects have to be restored to default, so shallow copy will not store after removal.
            cut_data_store_row.push(target_cell_props);
            //Restore default values for all the properties of current source cell in sheetDB 2D array of json objects, declared in cell_properties.js.
            src_cell_props.bold = false;
            src_cell_props.italic = false;
            src_cell_props.underline = false;
            src_cell_props.alignment = "left";
            src_cell_props.fontfamily = "Arial Black";
            src_cell_props.fontsize = "16";
            src_cell_props.fontcolor = "#000000";  //black
            src_cell_props.bgcolor = "#ffffff";  //white
            src_cell_props.cell_value = "";

            let src_cell = document.querySelector(`.col-cell[row_id="${i}"][col_id="${j}"]`);
            ////Update the cutted cells's UI properties to default.
            src_cell.innerText = "";
            src_cell.style.fontWeight = "normal";
            src_cell.style.fontStyle = "normal";
            src_cell.style.textDecoration = "none";
            src_cell.style.fontSize = "16";
            src_cell.style.fontFamily = "Arial Black";
            src_cell.style.color = "#000000";
            src_cell.style.backgroundColor = "#ffffff";
            src_cell.style.textAlign = "left";
        }
        cut_data_storage.push(cut_data_store_row);
    }
    //console.log('Cut DS:', cut_data_storage);
    handleUIPostCutCopy();
})

//Paste will work as many times as we want after a copy/cut operation.
paste_button.addEventListener("click", (event) => {
    //console.log(cell_range_arr, cell_range_arr.length);
    if(cell_range_arr.length <2){
        alert("Range cells not selected, copy properly by selecting 2 cells!");
        cell_range_arr = [];
        return;
    }
    let [top_rid, bottom_rid, top_cid, bottom_cid] = [cell_range_arr[0][0], cell_range_arr[1][0], cell_range_arr[0][1], cell_range_arr[1][1]];
    let address_bar_elem = document.querySelector(".address-bar");
    let target_cell_addr = address_bar_elem.value;
    let [target_rid, target_cid] = getActiveCellCoordinates(target_cell_addr);
    let num_rows = Math.abs(bottom_rid - top_rid);
    let num_cols = Math.abs(bottom_cid - top_cid);
    //r,c are the row,col indices of copied_data_storage array
    for(let i = target_rid, r = 0; i<=(target_rid + num_rows); i++, r++){
        for(let j = target_cid, c = 0; j<=(target_cid + num_cols); j++, c++){
            let curr_cell = document.querySelector(`.col-cell[row_id="${i}"][col_id="${j}"]`);
            if(!curr_cell){  //if col-cell[target_rid + num_rows][target_rid + num_cols] is out of our available cell range(A1 to Z100),
                //paste only till valid/available target cells.
                alert("Your data is being pasted partially due to invalid target cells!");
                continue;
                //alert("Cannot paste data due to invalid target cells!");
                //return;  //only if we dont want any partial copy operation.
            }
            //let source_cell_props = copied_data_storage[r][c];  //UI change; json cell props object were pushed in copied_data_storage 2D array.
            let source_cell_props;
            //depending on copy or cut operation we are assigning the source DS accordingly.
            if(copy_operation){
                source_cell_props = copied_data_storage[r][c];
            }
            else if(cut_operation){
                source_cell_props = cut_data_storage[r][c];
            }
            //Update all the properties of current target cell in sheetDB 2D array of json objects, declared in cell_properties.js.
            let target_cell_props = sheetDB[i][j];
            target_cell_props.cell_value = source_cell_props.cell_value;
            target_cell_props.bold = source_cell_props.bold;
            target_cell_props.italic = source_cell_props.italic;
            target_cell_props.underline = source_cell_props.underline;
            target_cell_props.alignment = source_cell_props.alignment;
            target_cell_props.fontfamily = source_cell_props.fontfamily;
            target_cell_props.fontsize = source_cell_props.fontsize;
            target_cell_props.fontcolor = source_cell_props.fontcolor;
            target_cell_props.bgcolor = source_cell_props.bgcolor;
            ////Wont copy the formula & children properties, that will be independently decided whether to do or not, so skipping them.
            ////So, updating the corresponding graph_matrix of targetted cells are also not perfromed.
            //target_cell_props.formula = source_cell_props.formula;
            //target_cell_props.children = source_cell_props.children;
            //curr_cell.click();  //alternate way -> function with event listener to apply all properties on cell already exists in cell_properties.js
            //console.log(target_cell_props.fontcolor, target_cell_props.bgcolor, target_cell_props.fontfamily);
            //console.log(sheetDB[i][j].fontcolor, sheetDB[i][j].bgcolor, sheetDB[i][j].fontfamily);

            ////Update the Pasted cells's UI properties to display.
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
})
