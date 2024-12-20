import requests
import json

def get_submittable_codeforces_problems():
    url = "https://codeforces.com/api/problemset.problems"
    response = requests.get(url)
    data = response.json()
    
    if data["status"] != "OK":
        raise Exception("API request failed")
    
    problems = data["result"]["problems"]
    problem_stats = []
    
    for problem in problems:
        if problem.get("type") == "PROGRAMMING":  #Filter for programming problems
            title = problem.get("name", "Unknown Problem")
            rating = problem.get("rating", "Unrated")
            contest_id = problem.get("contestId")
            index = problem.get("index")
            
            #Construct URL
            problem_url = f"https://codeforces.com/problemset/problem/{contest_id}/{index}"
            
            problem_stats.append({
                "title": title,
                "rating": rating,
                "url": problem_url
            })
    
    return problem_stats

#Fetch problems and write to data.json
if __name__ == "__main__":
    problems = get_submittable_codeforces_problems()
    data = json.dumps(problems)

    with open("data.json", "w") as f:
        f.write(data)
