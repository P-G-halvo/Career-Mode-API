const apiEndpoint = "https://fc-api.netlify.app/players_cleaned_v3.json";

const resultContainer = document.getElementById("results");
const searchForm = document.getElementById("searchform");
const inputName = document.getElementById("name")
const inputNation = document.getElementById("nation")
const inputLeague = document.getElementById("league")
const inputTeam = document.getElementById("team")
const input = document.getElementById("ovr");
const inputAge= document.getElementById("age")
const details= document.getElementById("details")
const maxAge = document.getElementById("age-max")
const maxRating = document.getElementById("ovr-max")


let allPlayers = []; // Lagrer alle spillerne

function cleanString(str) {
    return str
      .toLowerCase()
      .normalize("NFD")                    
      .replace(/\p{Diacritic}/gu, "")     
      .replace(/\s+/g, "")                
      .replace(/[^a-z0-9]/g, "");        
}


async function fetchData() {
    try {
        let response = await fetch(apiEndpoint);
        let data = await response.json();
        allPlayers = data;
    } catch (error) {
        console.log("Error when fetching data", error);
    }
}

fetchData();


searchForm.addEventListener("submit", (event) => {
    event.preventDefault();

     const searchName   =  cleanString(inputName.value) || 0;
    
     const searchNation =  inputNation.value.toLowerCase().replace(/\s+/g, "")  || 0;
 
     const searchLeague =  inputLeague.value.toLowerCase().replace(/\s+/g, "")  || 0;

     const searchTeam   =  inputTeam.value.toLowerCase().replace(/\s+/g, "")    || 0;

     const searchOvr    =  parseInt(input.value)            || 0;
 
     const searchAge    =  parseInt(inputAge.value)         || 0;

     const searchOvrMax    =  parseInt(maxRating.value)     || 99;
 
     const searchAgeMax    =  parseInt(maxAge.value)        || 99;

    
     const filteredPlayers = allPlayers.filter(player => {
        return(
     (!searchName || cleanString(player.Name).includes(searchName)) &&
     
     (!searchNation || player.Nation.toLowerCase().replace(/\s+/g, "") === searchNation) &&
     
     (!searchLeague || player.League.toLowerCase().replace(/\s+/g, "") === searchLeague) &&
     
     (!searchTeam || player.Team.toLowerCase().replace(/\s+/g, "").includes(searchTeam)) &&
        
     (player.OVR >= searchOvr && player.OVR <= searchOvrMax) &&

     (player.Age >= searchAge && player.Age <= searchAgeMax)
    );
});

renderPlayers(filteredPlayers);
searchForm.reset()
});

// 3. Render the list
function renderPlayers(playerList) {
    resultContainer.innerHTML = ''; 

    if (playerList.length === 0) {
        resultContainer.textContent = "No players found.";
        return;
    }

    playerList.forEach(player => {
        const playerDiv = document.createElement("div");
        playerDiv.innerHTML = `
            <p><strong>${player.Name}</strong>  ${player.Team}, ${player.League} <br>${player.Position} - Age: ${player.Age}   - Rating: ${player.OVR}</p>
            
        `;
        playerDiv.addEventListener("click", () => ShowPlayer(player));
        resultContainer.appendChild(playerDiv);
    });

 
}


function ShowPlayer(player) {
    const stats = document.createElement("div");
    stats.classList.add("deatil-div");
  
    let content = `<div id="stats"><h2>${player.Name}</h2><ul>`;
  
    for (let key in player) {
      if (key !== "Name") {
        content += `<li><strong>${key}:</strong> ${player[key]}</li>`;
      }
    }
  
    content += `</ul></div><button id="closeBtn">Close</button>`;
  
    stats.innerHTML = content;
  
    details.appendChild(stats);
    
  
    stats.querySelector("#closeBtn").addEventListener("click", () => {
      details.removeChild(stats);
    });
  }

