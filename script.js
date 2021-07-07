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

start = [Math.floor(Math.random()*20),Math.floor(Math.random()*40)];
goal = [Math.floor(Math.random()*20),Math.floor(Math.random()*40)];

document.getElementById(start[0]+"-"+start[1]).style.backgroundColor = "red";
document.getElementById(goal[0]+"-"+goal[1]).style.backgroundColor = "green";

let m=0,n=0;
for(var i=0;i<100;i++)
{
    m = Math.floor(Math.random()*20);
    n = Math.floor(Math.random()*40);
    if(m!== goal[0] &&m!==start[0] && n!==goal[1] && n!=start[1])
    {
        document.getElementById(m+"-"+n).style.backgroundColor = "grey";
        document.getElementById(m+"-"+n).className = "obstacle";
        grid[m][n] = 1;
    }
}

let dragSD;

// document.addEventListener("drag", function(event) {}, false);
document.addEventListener("dragstart", function(event) {
    if(event.target.className == "dropzone")
    {
        dragSD = event.target.style.backgroundColor;
        event.target.style.backgroundColor="";
    }
  }, false);

document.addEventListener("dragend", function(event) {
    if (event.target.className == "dropzone")
        event.target.style.opacity = "";
}, false);

document.addEventListener("dragover", function(event) {
    event.preventDefault();
    if (event.target.className == "dropzone")
    {
        event.target.style.backgroundColor = dragSD;
        reset();
        // eval(document.getElementById("fun").getAttribute("value") + "()");
    }
}, false);

document.addEventListener("dragenter", function(event) {
    if (event.target.className == "dropzone") {
        event.target.style.background = dragSD;
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
        event.target.style.background = dragSD;
    }
}, false);


let ROW = 20;
let COL = 40;
// Direction vectors
let dRow = [-1, 0, 1, 0,   -1, 1, -1, 1];
let dCol = [ 0, 1, 0, -1,   1, 1, -1,-1];

// let vis = Array.from(Array(ROW), ()=> Array(COL).fill(false));

function isValid(row, col)
{
    // If cell lies out of bounds
    if (row < 0 || col < 0
        || row >= ROW || col >= COL)
        return false;

    // If cell is already visited
    if (grid[row][col] == 1)
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
    document.getElementById(goal[0]+"-"+goal[1]).style.backgroundColor = "green";
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
    document.getElementById(start[0]+"-"+start[1]).style.backgroundColor = "red";
}

function getSG()
{
    let row = document.getElementById('table').rows;
    for (let i = 0; i < row.length; i++) {
        for (let j = 0; j < row[i].cells.length; j++ ) {
            if(row[i].cells[j].style.backgroundColor == "red")
            {
                start = [i,j];
            }
            else if(row[i].cells[j].style.backgroundColor == "green")
            {
                goal = [i,j];
            }
        }
    }   
}

function reset()
{
    for(let i=0;i<20;i++)
    {
        for(let j=0;j<40;j++)
        {
            if(document.getElementById(i+"-"+j).className != "obstacle")
                grid[i][j] = 0;
            if(document.getElementById(i+"-"+j).style.backgroundColor == "yellow")
                document.getElementById(i+"-"+j).style.backgroundColor = "";
            if(document.getElementById(i+"-"+j).style.backgroundColor == "blue")
                document.getElementById(i+"-"+j).style.backgroundColor = "";
        }
    }
}

const Bfs = async () =>
{
    reset();
    document.getElementById("fun").setAttribute("value","Bfs");
    getSG();
    openList = [];
    closedList = [];

    if(start[0] == goal[0] && start[1] == goal[1])
    {
        await sleep(10);
        return ;
    }
    else
    {
        grid[start[0]][start[1]] = 1;
        openList.push({'curr':start, 'parent':[-1,-1]});
    }
    while(openList.length != 0)
    {
        let curr = openList[0];
        openList.shift();

        await sleep(10);
        if(curr.curr != start)
        document.getElementById(curr.curr[0]+"-"+curr.curr[1]).style.backgroundColor = "blue";
        closedList.push(curr);

        for (let i = 0; i < 4; i++) {
 
            let adjx = curr.curr[0] + dRow[i];
            let adjy = curr.curr[1] + dCol[i];
 
            if (isValid(adjx, adjy)) 
            {
                if(adjx == goal[0] && adjy == goal[1])
                {
                    closedList.push({'curr': [adjx, adjy],'parent':[curr.curr[0],curr.curr[1]]})
                    printPath(closedList);
                    return;
                }
                openList.push({'curr': [adjx, adjy],'parent':[curr.curr[0],curr.curr[1]]});
                grid[adjx][adjy] = 1;
            }
        }
    }
}

const Dfs = async () =>
{
    reset();
    document.getElementById("fun").setAttribute("value","Dfs");
    getSG();
    openList = [];
    closedList = [];

    if(start[0] == goal[0] && start[1] == goal[1])
    {
        await sleep(10);
        return ;
    }
    else
    {
        grid[start[0]][start[1]] = 1;
        openList.push({'curr':start, 'parent':[-1,-1]});
    }
    while(openList.length != 0)
    {
        let curr = openList[openList.length-1];
        openList.pop();

        await sleep(10);

        if(curr.curr != start)
        document.getElementById(curr.curr[0]+"-"+curr.curr[1]).style.backgroundColor = "blue";
        closedList.push(curr);

        for (let i = 0; i < 4; i++) {
 
            let adjx = curr.curr[0] + dRow[i];
            let adjy = curr.curr[1] + dCol[i];
 
            if (isValid(adjx, adjy)) 
            {
                if(adjx == goal[0] && adjy == goal[1])
                {
                    closedList.push({'curr': [adjx, adjy],'parent':[curr.curr[0],curr.curr[1]]})
                    printPath(closedList);
                    return;
                }
                openList.push({'curr': [adjx, adjy],'parent':[curr.curr[0],curr.curr[1]]});
                grid[adjx][adjy] = 1;
            }
        }

    }
}


// Clear the Grid
function clean()
{
    window.location.reload();
}


