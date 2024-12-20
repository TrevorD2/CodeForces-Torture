import {get_random_problem, filter_by_rating} from "./problem_manager.js";

function redirect(details, problem_URL){
    if(details.url==problem_URL || details.url=="https://codeforces.com/problemset/submit") return;
    else{
        return {redirectUrl: problem_URL};
    }
}

const filter = {urls: ["<all_urls>"]};
const options = ["blocking"];

function addRedirectListener(problem_URL){
    chrome.webRequest.onBeforeRequest.addListener(redirect(problem_URL), filter, options);
}

function removeRedirectListener(problem_URL){
    chrome.webRequest.onBeforeRequest.removeListener(redirect(problem_URL));
}

var solved = false;
const midnight = "0:00:00";
var lower = 1000;
var upper = 1500;

function main(){
    const pset = filter_by_rating(lower, upper); //REPLACE TO GET PARAMS
    const problem = get_random_problem(pset);

    addRedirectListener(problem["url"])

    if(solved){
        solved = false;
        removeRedirectListener()
        setTimeout(
            main(),
            moment("24:00:00", "hh:mm:ss").diff(moment(), 'seconds')
        );
    }
}

main();