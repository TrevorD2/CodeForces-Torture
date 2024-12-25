function add_redirect_rule(targetURL) {
  const redirectRule = {
      id: 1,
      priority: 1,
      action: {
          type: "redirect",
          redirect: {
              url: targetURL
          }
      },
      condition: {
          urlFilter: "*",
          excludedDomains: [new URL(targetURL).hostname],
          resourceTypes: ["main_frame"]
      }
  };
  chrome.declarativeNetRequest.updateDynamicRules(
      {
          removeRuleIds: [1], //Remove any existing rule with the same ID
          addRules: [redirectRule]
      },
      () => {
          if (chrome.runtime.lastError) {
              console.error(`Failed to add rule: ${chrome.runtime.lastError.message}`);
          } else {
              console.log(`Redirect rule added: Redirect to ${targetURL}`);
          }
      }
  );
}

function remove_redirect_rule() {
  chrome.declarativeNetRequest.updateDynamicRules(
      {
          removeRuleIds: [1]
      },
      () => {
          if (chrome.runtime.lastError) {
              console.error(`Failed to remove rule: ${chrome.runtime.lastError.message}`);
          } else {
              console.log(`Redirect rule removed`);
          }
      }
  );
}

async function filter_problems_by_rating(lower_bound, upper_bound) {
  try {
      const response = await fetch(chrome.runtime.getURL("CodeForcesProblems.json"));
      const problems = await response.json();
      const filtered = problems.filter(problem => {
          if (problem["rating"] === "Unrated") return false;
          const rating = parseInt(problem["rating"], 10);
          return rating >= lower_bound && rating < upper_bound;
      });
      return filtered;
  } catch (e) {
      console.error(e);
      return [];
  }
}

function get_random_problem(problemset){
  return problemset[Math.floor(Math.random() * problemset.length)];
}

async function generate_random_problem(){
  const lbound = await chrome.storage.sync.get(["lower_rbound"]);
  const rbound = await chrome.storage.sync.get(["upper_rbound"]);
  
  const problem_set = await filter_problems_by_rating(lbound.lower_rbound,rbound.upper_rbound);
  return get_random_problem(problem_set);
}

function get_miliseconds_til_midnight(){
  const now = new Date();
  const nextMidnight = new Date(now);
  nextMidnight.setHours(24, 0, 0, 0);
  return nextMidnight.getTime() - now.getTime();

}

async function main(){
  try{
    const problem = await generate_random_problem();

    console.log(problem)
    chrome.storage.sync.set({ problem_name: problem["title"] }).then(() => {
      chrome.storage.sync.set({solved: false}).then(()=>{
        add_redirect_rule(problem["url"]);
      });
    });

    
  } catch(e){
    console.error(e);
  }
}

chrome.alarms.create("new_day_alarm", {
  when: Date.now() + get_miliseconds_til_midnight(),
  periodInMinutes: 1440
});

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "new_day_alarm") {
    console.log("A new day has begun!");
    main();
  }
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  console.log("Tab Updated: ", tab.url);
  if (changeInfo.status === 'complete' && tab.url.includes('codeforces.com')) {
      console.log("Injecting script into:", tab.url);
      chrome.scripting.executeScript(
          {
              target: { tabId: tabId },
              files: ["content.js"]
          },
          () => {
              if (chrome.runtime.lastError) {
                  console.error("Injection Error:", chrome.runtime.lastError.message);
              } else {
                  console.log("Script injected successfully!");
              }
          }
      );
  }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("Message received in background script:", message);

  if (message.action === "stopRedirect") {
      remove_redirect_rule();
      //Keep the message channel open for the async operation.
      return true;
  }
  if(message.action === "startRedirect"){
    main();
    return true;
  }
});