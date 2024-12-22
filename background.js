function add_redirect_rule(targetURL){
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
      addRules: [redirectRule],
      removeRuleIds: [1]
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

function remove_redirect_rule(){
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
  const problem_set = await filter_problems_by_rating(1000,1500);
  return get_random_problem(problem_set);
}

async function main(){
  const problem = await generate_random_problem(); 
  console.log(problem)
  add_redirect_rule(problem["url"]);
}

main();