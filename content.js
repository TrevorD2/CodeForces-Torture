async function check_submission() {
    const solved = await chrome.storage.sync.get(["solved"]);
    if(solved.solved==true) return;

    
    const targetNode = document.querySelector('.status-frame-datatable');

    if (!targetNode) {
        console.log("Target node not found");
        return;
    }

    const storageRequest = await chrome.storage.sync.get(["handle"]);
    const handle = storageRequest.handle;

    const url = `https://codeforces.com/api/user.status?handle=${handle}&from=1&count=1`;
    try{
        const response = await fetch(url);
        const recentSubmissions = await response.json();
        console.log(recentSubmissions)
        
        chrome.storage.sync.get(["problem_name"]).then((result) => {
            var problem_name = result["problem_name"];

            for(const submission of recentSubmissions["result"]){      
    
                if(submission["problem"]["name"] == problem_name){
                    if(submission["verdict"]=="OK"){
                        chrome.storage.sync.set({solved: true}).then(()=>{
                            chrome.runtime.sendMessage({ action: "stopRedirect" }, (response) => {
                                if (chrome.runtime.lastError) {
                                    console.error("Failed to send message:", chrome.runtime.lastError.message);
                                } else if (!response?.success) {
                                    console.error("Failed to stop redirect:", response?.error || "Unknown error");
                                } else {
                                    console.log("Redirect rule successfully added:", response);
                                }
                            });
                            console.log("Problem completed!");
                            alert("Problem completed!");
                            return;
                        })
                        
                    }
                }
            }

        });
    }
    catch (e){
        console.error(e);
    }
}

check_submission();
