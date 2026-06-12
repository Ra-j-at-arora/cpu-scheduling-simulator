fetch('http://localhost:5000/simulate/rr', {
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify({processes:[{pid:'P1', arrivalTime:0, burstTime:5, priority:1}], timeQuantum:2})
})
.then(r => r.text())
.then(console.log)
.catch(console.error);
