//get all cells
for(let i = 0; i<rows; i++){
    for(let j = 0; j<cols; j++){
        let focus_cell = document.querySelector(`.col-cell[row_id="${i}"][col_id="${j}"]`);
        focus_cell.addEventListener("blur", (event) => {
            let address_bar_elem = document.querySelector(".address-bar");
            let focus_cell_addr = address_bar_elem.value;
            let [active_cell, active_cell_props] = getActiveCellAndProps(focus_cell_addr);
            let cell_data = active_cell.innerText;
            //if entered data in current cell is same as stored cell data in cellprops object, no action required
            if(cell_data === active_cell_props.cell_value){
                return;
            }
            active_cell_props.cell_value = cell_data;
            //console.log(active_cell_props);
            //if(cell_data is not equal to active_cell_props.cell_value): break dependency
            removeChildFromParent_onFormulaChange(active_cell_props.formula);
            //then make current parent cell's formula as empty due to change in result value
            active_cell_props.formula = "";
            //re-update all children due to impact in current parent cell's value
            //updateAllChildren_onParentValueChange(focus_cell_addr);
        })
    }
}

let formula_bar_elem = document.querySelector(".formula-bar");
//event has to be declared as async as isGraphCyclicTracePath() function is awaited
formula_bar_elem.addEventListener("keydown", async (event) => {
    //if enter is pressed on formula bar after putting a formula and formula bar content is not empty
    let input_formula = formula_bar_elem.value;
    if(event.key === "Enter" && input_formula){
        ////first need to check if formula for the current resultant cell exists, if exists, check if formula is same or has changed.
        let address_bar_elem = document.querySelector(".address-bar");
        let target_cell_addr = address_bar_elem.value;
        let [target_cell, target_cell_props] = getActiveCellAndProps(target_cell_addr);
        //comparing currently entered formula and already stored formula, if exists.
        if(input_formula !== target_cell_props.formula){
            removeChildFromParent_onFormulaChange(target_cell_props.formula);
        }
        ////Create the DS for graph for cycle detection, even before evaluating formula, to avoid presence of cycle
        add_child_to_graph(input_formula, target_cell_addr);
        let cycle_cell = isGraphCyclic(graph_matrix);
        if(cycle_cell !== null){
            //alert("Your formula is cyclic!");
            let response = confirm("Your formula is cyclic, trace path?");
            while(response === true){
                //keep tracking cyclic path untill user chooses 'cancel'
                //This step needs to run in async await mode, to make color change in every iteration visible. So, event has been made async.
                await isGraphCyclicTracePath(graph_matrix, cycle_cell);
                response = confirm("Your formula is cyclic, trace path?");
            }
            //whichever child has been pushed to graph_matrix by add_child_to_graph(), will be popped by removeChildFromGraph() if there is a cycle in formula
            removeChildFromGraph(input_formula, target_cell_addr);
            return;
        }
        //let result = eval(input_formula);
        let result = eval_formula(input_formula);
        ////After altering the previous dependency (from old formula), establish new dependency using new formula
        setResultIn_Cellvalue_cellProps(result, input_formula, target_cell_addr);
        //add all children to parent cell props object based on established dependency through formula in formula-bar
        addChildToParent(input_formula);
        //When formula of a cell changes & its impact has to be reflected on all its child (dependent cells)
        updateAllChildren_onParentFormulaChange(target_cell_addr);
    }
})
function eval_formula(encoded_formula){
    //formula expression can be purely numeric or purely variable operand or a mix of both, so it has to be decoded
    let splitted_formula = encoded_formula.split(" ");
    //below for loop is a filter to check for any cell address operand in the formula. If pure numeric operands, no action in for loop.
    for(let i = 0; i<splitted_formula.length; i++){
        //ASCII value of alphabet part of operand
        let operand_cell_addr = splitted_formula[i];
        let asciiVal = operand_cell_addr.charCodeAt(0);
        if(asciiVal >=65 && asciiVal <=90){
            let [operand_cell, operand_cell_props] = getActiveCellAndProps(operand_cell_addr);
            //replacing the operand cell address with its cell value in splitted_formula array, to convert to a pure numeric operand formula for eval()
            splitted_formula[i] = operand_cell_props.cell_value;
        }
    }
    let decoded_formula = splitted_formula.join(" ");
    //eval() takes a string as input & returns a NUMBER
    return eval(decoded_formula);
}

//funtion to update UI and cell property
function setResultIn_Cellvalue_cellProps(result, input_formula, target_cell_addr){
    //fetch address of cell from address bar, where result has to be put
    //let address_bar_elem = document.querySelector(".address-bar");
    //let target_cell_addr = address_bar_elem.value;
    let [target_cell, target_cell_props] = getActiveCellAndProps(target_cell_addr);
    target_cell.innerText = result;
    target_cell_props.cell_value = result;
    //console.log(target_cell.innerText, target_cell_props.cell_value);
    target_cell_props.formula = input_formula;
}

function addChildToParent(encoded_formula){
    let address_bar_elem = document.querySelector(".address-bar");
    //because, each operand in formula will help derive the result to be put in a cell, whose address is currently in address-bar, this cell is child.
    let child_cell_addr = address_bar_elem.value;
    //formula expression can be purely numeric or purely variable operand or a mix of both, so it has to be decoded
    let splitted_formula = encoded_formula.split(" ");
    //below for loop is a filter to check for any cell address operand in the formula. If pure numeric operands, no action in for loop.
    for(let i = 0; i<splitted_formula.length; i++){
        //ASCII value of alphabet part of operand
        let operand_cell_addr = splitted_formula[i];
        let asciiVal = operand_cell_addr.charCodeAt(0);
        if(asciiVal >=65 && asciiVal <=90){
            let [parent_cell, parent_cell_props] = getActiveCellAndProps(operand_cell_addr);
            //replacing the operand cell address with its cell value in splitted_formula array, to convert to a pure numeric operand formula for eval()
            parent_cell_props.children.push(child_cell_addr);
            //console.log(operand_cell_addr, parent_cell_props.children);
        }
    }
}

function removeChildFromParent_onFormulaChange(old_encoded_formula){
    let address_bar_elem = document.querySelector(".address-bar");
    //because, each operand in formula will help derive the result to be put in a cell, whose address is currently in address-bar, this cell is child.
    let child_cell_addr = address_bar_elem.value;
    //formula expression can be purely numeric or purely variable operand or a mix of both, so it has to be decoded
    let splitted_formula = old_encoded_formula.split(" ");
    ////below for loop is a filter to check for any cell address operand in the formula. If pure numeric operands, no action in for loop.
    //for all the cells in formula (these are the parent cells), remove child_cell_adress from the children array of the cell's property object.
    for(let i = 0; i<splitted_formula.length; i++){
        //ASCII value of alphabet part of operand
        let operand_cell_addr = splitted_formula[i];
        let asciiVal = operand_cell_addr.charCodeAt(0);
        if(asciiVal >=65 && asciiVal <=90){
            let [parent_cell, parent_cell_props] = getActiveCellAndProps(operand_cell_addr);
            //replacing the operand cell address with its cell value in splitted_formula array, to convert to a pure numeric operand formula for eval()
            let index = parent_cell_props.children.indexOf(child_cell_addr);
            //console.log(index);
            //deleting 1 element starting from index 'index' in children array of the current parent cell
            parent_cell_props.children.splice(index, 1);
            //console.log(operand_cell_addr, parent_cell_props.children);
        }
    }
}

function updateAllChildren_onParentFormulaChange(parent_cell_address){
    let [parent_cell, parent_cell_props] = getActiveCellAndProps(parent_cell_address);
    let children_arr = parent_cell_props.children;
    for(let i = 0; i<children_arr.length; i++){
        let ith_child_addr = children_arr[i];
        let [ith_childCell, ith_childCell_props] = getActiveCellAndProps(ith_child_addr);
        let ith_child_formula = ith_childCell_props.formula;
        let result = eval_formula(ith_child_formula);
        setResultIn_Cellvalue_cellProps(result, ith_child_formula, ith_child_addr);
        //(DFS) Recursively calling the function for children & sub-children to take effect of formula change for a parent
        updateAllChildren_onParentFormulaChange(ith_child_addr);
    }
}

// function updateAllChildren_onParentValueChange(){
// }

//if A = B + C + 10, B,C are parents, A is child, B,C -> A or B,C derives A
function add_child_to_graph(formula, childCellAddress){
    let [child_row_id, child_col_id] = getActiveCellCoordinates(childCellAddress);
    let splitted_formula = formula.split(" ");
    for(let i = 0; i<splitted_formula.length; i++){
        let ascii_val = splitted_formula[i].charCodeAt(0); //getting the alphabet part of address
        if(ascii_val >= 65 && ascii_val <= 90){  //to consider only alpha-numeric chars and skip +,-,/,*
            let [parent_row_id, parent_col_id] = getActiveCellCoordinates(splitted_formula[i]);
            //Both B & C will have A s co-ordinates
            graph_matrix[parent_row_id][parent_col_id].push([child_row_id, child_col_id]);
        }
        
    }
}

function removeChildFromGraph(encoded_formula, child_cell_addr){
    //let [child_row_id, child_col_id] = getActiveCellCoordinates(child_cell_addr);
    let splitted_formula = encoded_formula.split(" ");
    for(let i = 0; i<splitted_formula.length; i++){
        let ascii_val = splitted_formula[i].charCodeAt(0); //getting the alphabet part of address
        if(ascii_val >= 65 && ascii_val <= 90){  //to consider only alpha-numeric chars and skip +,-,/,*
            let [parent_row_id, parent_col_id] = getActiveCellCoordinates(splitted_formula[i]);
            //Both B & C will have A s co-ordinates
            graph_matrix[parent_row_id][parent_col_id].pop();
        }
    }
}