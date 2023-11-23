const form = document.querySelector('.login')

form.addEventListener('submit', function (e) {
    e.preventDefault();
    const formdata = new FormData(form)
    const dataf = new URLSearchParams();

    for(let pair of formdata) {
        dataf.append(pair[0], pair[1]);
    }

    fetch("http://localhost:3000/api/login", {
        method: "POST",
        body: dataf
    }).then(response => {
       response.json().then(data => {
           if(response.status === 200) {
               window.location.href = "/dashboard.html"
           }
       })
    })
})