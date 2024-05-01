//Graph DS storage format
let allSheetGraphMatrix = [];
//3-D matrix
let graph_matrix = [];  //initialized in sheets_handling.js in handleSheetActiveness() function

// for(let i = 0; i<rows; i++){
//     let curr_row = [];
//     for(let j = 0; j<cols; j++){
//         curr_row.push([]);
//     }
//     graph_matrix.push(curr_row);
// }
//console.log(graph_matrix.length, graph_matrix[0].length);

//isGraphCyclic() is being invoked from within formula.js
function isGraphCyclic(graph_matrix){
    //since cells are 2D, Visisted & DFSVisisted will be 2D arrays
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
    for(let i = 0; i<rows; i++){
        for(let j = 0; j<cols; j++){
            if(Visisted[i][j] === false){
                //DFS_detect_cycle() is being invoked for all cells, in case there are multiple components in the graph_matrix
                let status = DFS_detect_cycle(graph_matrix, i, j, Visisted, DFSVisisted);
                if(status===true){
                    //return status;
                    return [i, j];
                }
            }
        }
    }
    //return false;
    return null;
}
function DFS_detect_cycle(graph_matrix, gm_row, gm_col, Visisted, DFSVisisted){
    Visisted[gm_row][gm_col] = true;
    DFSVisisted[gm_row][gm_col] = true;
    for(let ith_child = 0; ith_child<graph_matrix[gm_row][gm_col].length; ith_child++){
        let [ith_child_rid, ith_child_colid] = graph_matrix[gm_row][gm_col][ith_child];
        if(Visisted[ith_child_rid][ith_child_colid]===false){
            let status = DFS_detect_cycle(graph_matrix, ith_child_rid, ith_child_colid, Visisted, DFSVisisted);
            if(status===true){
                return true;
            }
        }
        else if(Visisted[ith_child_rid][ith_child_colid]===true && DFSVisisted[ith_child_rid][ith_child_colid]===true){
            return true;
        }
        else{
            let status = DFS_detect_cycle(graph_matrix, ith_child_rid, ith_child_colid, Visisted, DFSVisisted);
            if(status===true){
                return true;
            }
        }
    }
    DFSVisisted[gm_row][gm_col] = false;
    return false;
}