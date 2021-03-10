function main(){
        let tournament_contenders = ["dummyBot","beginnerBot","adeptBot"];
        let function_array = parseFunctions(tournament_contenders);
        let tournament_button = document.querySelector("#tournament");
        tournament_button.addEventListener("click", function(event){
                event.preventDefault();
                let game_results = playTournament(tournament_contenders);
                displayResults(game_results,tournament_contenders);
                sessionStorage.clear();
        });  
}

function playTournament(tournament_contenders){
        let results = [];
        //Each bot will play a total number of 10,000 games against each opponent bot. Two sets of 5K.
        let num_games = 10000;
        //The nested for loops allow each function to play every function that comes after it, this prevents double matchups.
        //Example: Func_X vs. Func_Y, then Func_Y vs. Func_X later.
        for(let i = 0; i < tournament_contenders.length; i++){
                let result_pair = [];
                for(let j = i+1; j < tournament_contenders.length; j++){
                        let win_data = runGames(tournament_contenders, i, j, num_games);
                        result_pair = [tournament_contenders[i], win_data[0], tournament_contenders[j], win_data[1]];
                        results.push(result_pair);       
                }
        }
        return results;
}
function parseFunctions(tournament_contenders){
        let function_array_parsed = [];
        let dummyBot = new Function('previous',`return "rock";`);
        let beginnerBot = new Function('previous',`let choice = Math.random();
        let return_move = "";
        if (choice < 0.3){
                return_move = "rock";
        }
        else if (choice < 0.6){
                return_move = "paper";
        }
        else{
                return_move = "scissors";
        }

        return return_move;`);
        let adeptBot = new Function('previous',`let choice = Math.random();
        let return_move = "";
        if (previous=="rock"){
             return_move = (choice < 0.5) ? "rock" : "scissors";   
        }
        else if (previous=="scissors"){
                return_move = (choice < 0.5) ? "paper" : "scissors";  
        }
        else if (previous=="paper"){
                return_move = (choice < 0.5) ? "rock" : "paper";  
        }
        else{
                return_move = "scissors";
        }
        return return_move;`);

        function_array_parsed.push(dummyBot);
        function_array_parsed.push(beginnerBot);
        function_array_parsed.push(adeptBot);

        return function_array_parsed;
}

function runGames(function_array, i, j, games){
        let choice_1 = "";
        let choice_2 = "";
        let wins_1 = 0;
        let wins_2 = 0;
        let game_outcome = -1;
        //First game
        choice_1 = dummyBot("");//function_array[i]("");
        choice_2 = adeptBot("");//function_array[j]("");

        game_outcome = getWinner(choice_1, choice_2);
                if (game_outcome==1){
                        wins_1 += 1
                }
                else if (game_outcome==2){
                        wins_2 += 1
                }
         
        //Remaining games
        for (let i = 0; i < games; i++){
                choice_1 = dummyBot(choice_2);//(function_array[i])(choice_2);
                choice_2 = adeptBot(choice_1);//(function_array[j])(choice_1);

                game_outcome = getWinner(choice_1, choice_2);
                if (game_outcome==1){
                        wins_1 += 1
                }
                else if (game_outcome==2){
                        wins_2 += 1
                }
        }
        return [wins_1, wins_2];
}

function getWinner(choice_1,choice_2){
        let game_outcome = -1;
        if (choice_1 == "rock" && choice_2=="rock"){
                game_outcome = 0;
        }
        else if (choice_1 == "paper" && choice_2=="paper"){
                game_outcome = 0;
        }
        else if (choice_1 == "scissors" && choice_2=="scissors"){
                game_outcome = 0;
        }
        else if (choice_1 == "rock" && choice_2=="paper"){
                game_outcome = 2;
        }
        else if (choice_1 == "rock" && choice_2=="scissors"){
                game_outcome = 1;
        }
        else if (choice_1 == "paper" && choice_2=="rock"){
                game_outcome = 1;
        }
        else if (choice_1 == "paper" && choice_2=="scissors"){
                game_outcome = 2;
        }
        else if (choice_1 == "scissors" && choice_2=="rock"){
                game_outcome = 2;
        }
        else if (choice_1 == "scissors" && choice_2=="paper"){
                game_outcome = 1;
        }   
        return game_outcome;          
}

function displayResults(results,tournament_contenders){
        //Result data is formatted: [Function1 Name, Function1 Games Won, Function2 Name, Function2 Games Won]
        let max_wins = 0;
        let result_container = document.querySelector("#results");
        tournament_contenders.forEach(function(item){
                //Process the results array and count the number of wins, and find the max wins to declare the winner
                for (let i = 0; i < results.length; i++){
                        let item_data = [];
                        let wins = 0;
                        let losses = 0;
                        if (sessionStorage.getItem(`${item}`)){
                                item_data = JSON.parse(sessionStorage.getItem(`${item}`));
                                wins = item_data[0];
                                losses = item_data[1];
                        }
                        else{
                                item_data = [];
                                item_data.push(wins);
                                item_data.push(losses);
                        }

                        if (results[i][0] == item){
                                wins = wins + results[i][1];
                                if (wins > max_wins){
                                        max_wins = wins;
                                }
                                losses = losses + results[i][3];
                                item_data[0] = wins;
                                item_data[1] = losses;
                                sessionStorage.setItem(`${item}`, JSON.stringify(item_data));
                        }
                        else if (results[i][2] == item){
                                wins = wins + results[i][3];
                                if (wins > max_wins){
                                        max_wins = wins;
                                }
                                losses = losses + results[i][1];
                                item_data[0] = wins;
                                item_data[1] = losses;
                                sessionStorage.setItem(`${item}`, JSON.stringify(item_data));
                        }
                }
                //Outside of results iteration, counting is done for this item.
                let item_data_processed = JSON.parse(sessionStorage.getItem(item));
                let final_wins = item_data_processed[0];
                let final_losses = item_data_processed[1];
                let win_percent = (final_wins / (final_wins + final_losses)) * 100;
                let win_percent_string = `Win Percent: ${win_percent}%`;
                let formatted_string = `${item} - ${win_percent_string}`;
                let result_table = document.querySelector('#result-table-data');
                //let td_list = result_container.querySelectorAll("[id^='e']");
                //let next_box = td_list[0];
                //let i = 0;
                //while(td_list[i].id != "[id^='e']"){
                //        next_box = td_list[i+1];
                //        i++;
                //}
                //td_list[i].id = `next-box${i}`;
                let next_box = document.createElement("TR");
                next_box.innerHTML =`<td><strong>${formatted_string}</strong></td><td></td><td></td>`;
                result_table.appendChild(next_box);
        });
        result_container.style.display = "block";
}

// User Functions
function dummyBot(previous){
        //Creator: Daniel Harris, Daniel.Harris@keyin.com
        return "rock";
}

function beginnerBot(previous){
        //Creator: Daniel Harris, Daniel.Harris@keyin.com
        let choice = Math.random();
        let return_move = "";
        if (choice < 0.3){
                return_move = "rock";
        }
        else if (choice < 0.6){
                return_move = "paper";
        }
        else{
                return_move = "scissors";
        }

        return return_move;
}

function adeptBot(previous){
        //Creator: Daniel Harris, Daniel.Harris@keyin.com
        let choice = Math.random();
        let return_move = "";
        if (previous=="rock"){
             return_move = (choice < 0.5) ? "rock" : "scissors";   
        }
        else if (previous=="scissors"){
                return_move = (choice < 0.5) ? "paper" : "scissors";  
        }
        else if (previous=="paper"){
                return_move = (choice < 0.5) ? "rock" : "paper";  
        }
        else{
                return_move = "scissors";
        }
        return return_move;
}

//Onload, main program start
window.addEventListener('load', main);