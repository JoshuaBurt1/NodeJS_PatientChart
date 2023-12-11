//This is for column formatting (making cell input into lists or a specific format)
document.addEventListener("DOMContentLoaded", function () {
  const noteCells = document.querySelectorAll("#td5");
  const updateCells = document.querySelectorAll("#td2");
  const supplyOrderCells = document.querySelectorAll("#td3");

  //update date COLUMN
  updateCells.forEach((cell) => {
    const updateText = cell.querySelector("#cellList").textContent;
    const updateList = document.createElement("p");
    cell.appendChild(updateList);

    var updateItems = updateText.split(" (");
    const dateRegex = /\w{3} \w{3} \d{2} \d{4}/; // Matches the date
    const timeRegex = /\d{2}:\d{2}:\d{2}/; // Matches the time
    const daylightRegex = /\(.*\)$/;

    var dateMatch = updateText.match(dateRegex);
    var timeMatch = updateText.match(timeRegex);
    var daylightMatch = updateText.match(daylightRegex);

    // Output the results
    updateItems = [dateMatch[0], timeMatch[0], daylightMatch[0]];
    //console.log(updateItems);

    updateItems.forEach((item) => {
      const listItem = document.createElement("li");
      listItem.textContent = item;
      updateList.appendChild(listItem);
    });

    cell.removeChild(cell.querySelector("#cellList"));
  });

  //progressNote COLUMN
  noteCells.forEach((cell) => {
    const noteText = cell.querySelector("#cellList").textContent;
    const noteList = document.createElement("ul");
    cell.appendChild(noteList);

    const noteItems = noteText.split(". ");

    noteItems.forEach((item) => {
      const listItem = document.createElement("li");
      listItem.textContent = item;
      noteList.appendChild(listItem);
    });
    cell.removeChild(cell.querySelector("#cellList"));
  });

  //supplyOrder COLUMN
  supplyOrderCells.forEach((cell) => {
    const supplyText = cell.querySelector("#cellList").textContent;
    const supplyList = document.createElement("ul");
    supplyList.classList.add("supplyListStyle");
    cell.appendChild(supplyList);

    const supplyItems = supplyText.split(",");

    supplyItems.forEach((item) => {
      const listItem = document.createElement("li");
      listItem.textContent = item;
      supplyList.appendChild(listItem);
    }); 

    cell.removeChild(cell.querySelector("#cellList"));
  });

});
