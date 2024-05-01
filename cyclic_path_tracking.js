//
async function isGraphCyclicTracePath(graph_matrix, cycle_cell){
    let [cycle_cell_rid, cycle_cell_cid] = cycle_cell;
    let Visisted = [];
    let DFSVisisted = [];
    for(let i = 0; i<rows; i++){
        let visisted_row = [];
        let DFSVisisted_row = [];
        for(let j = 0; j<cols; j++){
            visisted_row.push(false);
            DFSVisisted_row.push(false);
        }
        Visisted.push(visisted_row);
        DFSVisisted.push(DFSVisisted_row);
    }
    //when we know there is cycle, we dont need to iterate over all componnents, we can run DFS on the cycle path only.
    let status = await DFS_detect_cycleTracePath(graph_matrix, cycle_cell_rid, cycle_cell_cid, Visisted, DFSVisisted);
    if(status === true){
        //return true;
        return Promise.resolve(true);
    }
    //return false;
    return Promise.resolve(false);
}

function cycleTraceColorpromise(){
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve();
        }, 1000);
    })
}

//this function will only run on the cyclic path, displaying the cells with color
//setTimeout has to be run in sync (asynchronous execution will not show correct sequence of color display), so we use promises.
async function DFS_detect_cycleTracePath(graph_matrix, gm_row, gm_col, Visisted, DFSVisisted){
    Visisted[gm_row][gm_col] = true;
    DFSVisisted[gm_row][gm_col] = true;
    let parent_cell = document.querySelector(`.col-cell[row_id="${gm_row}"][col_id="${gm_col}"]`);
    //displaying the cells of cycle path one by one
    parent_cell.style.backgroundColor = "lightblue";
    //waiting for the delay to make color change visual
    await cycleTraceColorpromise();

    for(let ith_child = 0; ith_child<graph_matrix[gm_row][gm_col].length; ith_child++){
        let [ith_child_rid, ith_child_colid] = graph_matrix[gm_row][gm_col][ith_child];
        if(Visisted[ith_child_rid][ith_child_colid]===false){
            let status = await DFS_detect_cycleTracePath(graph_matrix, ith_child_rid, ith_child_colid, Visisted, DFSVisisted);
            if(status===true){
                //parent cells marked as lightblue during going deep in DFS, is de-colored during returning.
                parent_cell.style.backgroundColor = "transparent";
                //waiting for the delay to make color change visual
                await cycleTraceColorpromise();
                //return true;
                return Promise.resolve(true);
            }
        }
        else if(Visisted[ith_child_rid][ith_child_colid]===true && DFSVisisted[ith_child_rid][ith_child_colid]===true){
            let curr_cycle_cell = document.querySelector(`.col-cell[row_id="${ith_child_rid}"][col_id="${ith_child_colid}"]`);
            //displaying the start cell of cycle
            curr_cycle_cell.style.backgroundColor = "lightpink";
            //waiting for the delay to make color change visual
            await cycleTraceColorpromise();
            //cycle start cell marked as lightpink during going deep in DFS, is de-colored during returning.
            curr_cycle_cell.style.backgroundColor = "transparent";
            //waiting for the delay to make color change visual
            await cycleTraceColorpromise();
            //parent cells marked as lightblue during going deep in DFS, is de-colored during returning.
            parent_cell.style.backgroundColor = "transparent";
            //waiting for the delay to make color change visual
            await cycleTraceColorpromise();
            //return true;
            return Promise.resolve(true);
        }
        else{
            let status = await DFS_detect_cycleTracePath(graph_matrix, ith_child_rid, ith_child_colid, Visisted, DFSVisisted);
            if(status===true){
                //parent cells marked as lightblue during going deep in DFS, is de-colored during returning.
                parent_cell.style.backgroundColor = "transparent";
                //waiting for the delay to make color change visual
                await cycleTraceColorpromise();
                //return true;
                return Promise.resolve(true);
            }
        }
    }
    DFSVisisted[gm_row][gm_col] = false;
    parent_cell.style.backgroundColor = "transparent";
    //waiting for the delay to make color change visual
    await cycleTraceColorpromise();
    //return false;
    return Promise.resolve(false);
}