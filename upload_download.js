let uploadfile_button = document.querySelector(".upload_file");
let downloadfile_button = document.querySelector(".file_download");

//We will store excel data (sheetDB & graph_matrix) in JSON format
//Downloading task
downloadfile_button.addEventListener("click", (event) => {
    let excel_json_data = JSON.stringify([sheetDB, graph_matrix]);
    let file = new Blob([excel_json_data], {type:"application/json"});
    let anchor_elem = document.createElement("a");
    anchor_elem.href = URL.createObjectURL(file);
    anchor_elem.download = "excel_sheet_data.json";
    anchor_elem.click();
})

//Uploading task
uploadfile_button.addEventListener("click", (event) => {
    let input_elem = document.createElement("input");
    input_elem.setAttribute("type", "file");
    input_elem.setAttribute("id", "inputfile");
    input_elem.click();  //opens local file explorer
    input_elem.addEventListener("change", (event) => {
        let filereader = new FileReader();
        let files = input_elem.files;
        let fileObj = files[0];
        filereader.readAsText(fileObj);
        filereader.addEventListener("load", (event) => {
            let sheetData = JSON.parse(filereader.result);  //this data we will put in a new sheet
            sheet_addicon_elem.click();  //new sheet will be created (with instances of sheetDB, graph_matrix, allSheetPropsDB, allSheetGraphMatrix)
            //with default props in all cells
            //Assigning the stored JSON elements from sheetData to newly opened sheet's cell properties & graph relations.
            sheetDB = sheetData[0];
            graph_matrix = sheetData[1];
            allSheetPropsDB[allSheetPropsDB.length - 1] = sheetDB;
            allSheetGraphMatrix[allSheetGraphMatrix.length - 1] = graph_matrix;
            ApplyingSheetPropsOnToggling();
        })
    })
})