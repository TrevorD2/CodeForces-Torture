document.getElementById('input_form').addEventListener('submit', (event) => {
    event.preventDefault(); // Prevent the form from reloading the page
  
    // Get the input data
    const lbound = document.getElementById("lower_rbound").value;
    const rbound = document.getElementById("upper_rbound").value;
    const handle = document.getElementById("handle").value;

    if(handle==""){
        chrome.storage.sync.set({
            lower_rbound: lbound,
            upper_rbound: rbound,
        }, () => {
            console.log('Data saved successfully:', { lbound, rbound });
            alert('Data saved successfully!');
        });
    }else{
        chrome.storage.sync.set({
            lower_rbound: lbound,
            upper_rbound: rbound,
            handle: handle
        }, () => {
            console.log('Data saved successfully:', { lbound, rbound, handle });
            alert('Data saved successfully!');
        });
    }
    
    chrome.runtime.sendMessage({ action: "startRedirect" }, (response) => {
        if (chrome.runtime.lastError) {
            console.error("Failed to send message:", chrome.runtime.lastError.message);
        } else if (!response?.success) {
            console.error("Failed to start redirect:", response?.error || "Unknown error");
        } else {
            console.log("Redirect rule successfully started:", response);
        }
    });
});
  