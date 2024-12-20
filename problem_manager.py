import json
import random

#Filters problems so that rating is on the interval [lower_bound, upper_bound)
def filter_by_rating(lower_bound: int, upper_bound: int) -> list[dict]:
    filtered = []

    with open("data.json", 'r') as f:
        data = json.load(f)

    for problem in data:
        if problem["rating"] == "Unrated": continue
        if lower_bound <= problem["rating"] < upper_bound: filtered.append(problem)

    return filtered

def get_random_problem(problem_list: list[dict]) -> dict:
    return random.choice(problem_list)

if __name__ == "__main__": 
    filt = filter_by_rating(1000, 1500)
    print(get_random_problem(filt))