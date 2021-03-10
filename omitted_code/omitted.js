//let function_array = parseFunctions(tournament_contenders);

 //choice_1 = dummyBot("");//function_array[i]("");
        //choice_2 = adeptBot("");//function_array[j]("");

        //choice_1 = dummyBot(choice_2);//(function_array[i])(choice_2);
                //choice_2 = adeptBot(choice_1);//(function_array[j])(choice_1);


                //let td_list = result_container.querySelectorAll("[id^='e']");
                //let next_box = td_list[0];
                //let i = 0;
                //while(td_list[i].id != "[id^='e']"){
                //        next_box = td_list[i+1];
                //        i++;
                //}
                //td_list[i].id = `next-box${i}`;

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