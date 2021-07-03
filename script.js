let table = document.getElementById('table');
let grid = []

for(let i=0;i<20;i++)
{
    // Insert a row at the end of the table
    let newRow = table.insertRow(-1);
    let t = [];
    for(let j=0;j<40;j++)
    {
        // Insert a cell in the row at index 0
        let newCell = newRow.insertCell(0);
        newCell.id =  i + "-"+ (39-j);
        newCell.className = "dropzone";
        newCell.draggable = true;
        t.push(0);
    }
    grid.push(t);
}

start = [0,0]
goal = [15,14]

document.getElementById(start[0]+"-"+start[1]).style.backgroundColor = "red";
document.getElementById(goal[0]+"-"+goal[1]).style.backgroundColor = "green";

let count = 0, dragged, dragStart;

// function changeStyle(k,j)
// {
//     let div = document.getElementById(k+"-"+j);
//     if(count == 1)
//     {
//         div.style.backgroundColor = "red";
//     }
//     else if (count == 2)
//     {
//         div.style.backgroundColor = "green";
//     }
// } 
// let row = document.getElementById('table').rows;
// for (let i = 0; i < row.length; i++) {
//     for (let j = 0; j < row[i].cells.length; j++ ) {
//         console.log(row[i].cells[j].innerHTML);
//         row[i].cells[j].addEventListener('click', function(){
//             console.log('click');
//             count += 1;
//             changeStyle(i,j);
//         });
//     }
// }   

document.addEventListener("drag", function(event) {}, false);
document.addEventListener("dragstart", function(event) {
    dragged = event.target;
    dragStart = dragged.style.backgroundColor;
    event.target.style.backgroundColor="";
  }, false);

document.addEventListener("dragend", function(event) {
    event.target.style.opacity = "";
}, false);

document.addEventListener("dragover", function(event) {
    event.preventDefault();
}, false);

document.addEventListener("dragenter", function(event) {
    if (event.target.className == "dropzone") {
        event.target.style.background = dragStart;
    }
}, false);

document.addEventListener("dragleave", function(event) {
    if (event.target.className == "dropzone") {
      event.target.style.background = "";
    }
  
}, false);

document.addEventListener("drop", function(event) {
    event.preventDefault();
    if (event.target.className == "dropzone") {
        console.log(dragged);
        event.target.style.background = dragStart;
    }
}, false);


let ROW = 20;
let COL = 40;
// Direction vectors
let dRow = [-1, 0, 1, 0 ];
let dCol = [0, 1, 0, -1 ];

// Declare the visited array
let vis = Array.from(Array(ROW), ()=> Array(COL).fill(false));
 
// Function to check if a cell
// is be visited or not
function isValid(vis, row, col)
{
    // If cell lies out of bounds
    if (row < 0 || col < 0
        || row >= ROW || col >= COL)
        return false;

    // If cell is already visited
    if (vis[row][col])
        return false;
 
    // Otherwise
    return true;
}

const sleep = (time) => {
    return new Promise((resolve) => {
      return setTimeout(function () {
        resolve()
      }, time)
    })
}

const printPath = async (c) =>
{
    c.reverse();
    let x = c[0].parent[0];
    let y = c[0].parent[1];
    await sleep(10);
    document.getElementById(goal[0]+"-"+goal[1]).style.backgroundColor = "purple";
    for(var i=0;i<c.length;i++)
    {
        if(c[i].curr[0] == x && c[i].curr[1] == y)
        {
            await sleep(10);
            document.getElementById(x+"-"+y).style.backgroundColor = "yellow";
            x = c[i].parent[0];
            y = c[i].parent[1];
        }
    }
    await sleep(10);
    document.getElementById(start[0]+"-"+start[1]).style.backgroundColor = "purple";
}

function getSG()
{
    let row = document.getElementById('table').rows;
    for (let i = 0; i < row.length; i++) {
        for (let j = 0; j < row[i].cells.length; j++ ) {
            if(row[i].cells[j].style.backgroundColor == "red")
            {
                start = [];
                start.push(i);
                start.push(j);
                console.log(start);
            }
            else if(row[i].cells[j].style.backgroundColor == "green")
            {
                goal = [];
                goal.push(i);
                goal.push(j);
            }
        }
    }   
}

const Bfs = async() =>
{
    getSG();
    openList = [];
    closedList = [];

    if(start[0] == goal[0] && start[1] == goal[1])
    {
        await sleep(10);
        document.getElementById(start[0]+"-"+start[1]).style.backgroundColor = "blue";
        return ;
    }
    else
    {
        openList.push({'curr':start, 'parent':[-1,-1]});
    }
    while(openList.length != 0)
    {
        let curr = openList[0];
        openList.shift();

        await sleep(10);
        document.getElementById(curr.curr[0]+"-"+curr.curr[1]).style.backgroundColor = "blue";
        closedList.push(curr);

        for (let i = 0; i < 4; i++) {
 
            let adjx = curr.curr[0] + dRow[i];
            let adjy = curr.curr[1] + dCol[i];
 
            if (isValid(vis, adjx, adjy)) 
            {
                if(adjx == goal[0] && adjy == goal[1])
                {
                    closedList.push({'curr': [adjx, adjy],'parent':[curr.curr[0],curr.curr[1]]})
                    printPath(closedList);
                    return;
                }
                openList.push({'curr': [adjx, adjy],'parent':[curr.curr[0],curr.curr[1]]});
                vis[adjx][adjy] = true;
            }
        }
    }
}

const Dfs = async() =>
{
    getSG();
    openList = [];
    closedList = [];

    if(start[0] == goal[0] && start[1] == goal[1])
    {
        await sleep(10);
        document.getElementById(start[0]+"-"+start[1]).style.backgroundColor = "blue";
        return ;
    }
    else
    {
        openList.push({'curr':start, 'parent':[-1,-1]});
    }
    while(openList.length != 0)
    {
        let curr = openList[openList.length-1];
        openList.pop();

        await sleep(10);
        document.getElementById(curr.curr[0]+"-"+curr.curr[1]).style.backgroundColor = "blue";
        closedList.push(curr);

        for (let i = 0; i < 4; i++) {
 
            let adjx = curr.curr[0] + dRow[i];
            let adjy = curr.curr[1] + dCol[i];
 
            if (isValid(vis, adjx, adjy)) 
            {
                if(adjx == goal[0] && adjy == goal[1])
                {
                    closedList.push({'curr': [adjx, adjy],'parent':[curr.curr[0],curr.curr[1]]})
                    printPath(closedList);
                    return;
                }
                openList.push({'curr': [adjx, adjy],'parent':[curr.curr[0],curr.curr[1]]});
                vis[adjx][adjy] = true;
            }
        }

    }
}


// Clear the Grid

function clean()
{
    window.location.reload();
}