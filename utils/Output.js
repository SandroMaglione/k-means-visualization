const Output = {
    download: (text, name) => {
        let a = document.getElementById("download")
        let file = new Blob([text], { type: 'application/json' })
        a.href = URL.createObjectURL(file)
        a.download = name
    }
}