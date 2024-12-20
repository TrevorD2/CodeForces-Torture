const fs = require('fs/promises');

async function filter_by_rating(lower_bound, upper_bound) {
    try {
        const data = await fs.readFile('data.json', 'utf-8');
        const problems = JSON.parse(data);
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
