window.onload = () => {
    const imageInput = document.getElementById('image-input')
    let uploadedImage
    imageInput.addEventListener('change', (e) => {
        const file = e.target.files[0]
        if (!file){
            document.getElementById('image').src = '../images/default image.jpg'
            uploadedImage = null
            return
        }
        uploadedImage = file
        const reader = new FileReader()
        reader.onload = (e) => {
            document.getElementById('image').src = e.target.result
        }
        reader.readAsDataURL(uploadedImage)
    })

    const imageForm = document.getElementById('image-form')
    imageForm.addEventListener('submit', async (e) => {
        e.preventDefault()
        if(!uploadedImage){
            return
        }
        const formData = new FormData()
        formData.append('image', uploadedImage)
        const response = await fetch(
            'https://dogs-vs-cats-z7qe.onrender.com/images',
            {
                method: 'POST',
                body: formData
            }
        )
        const score = await response.json()
        processPrediction(score)
    })
}

function processPrediction(score){
    const label = Math.round(score)
    let prediction
    if (label === 0){
        prediction = 'cat'
    }
    else{
        prediction = 'dog'
    }
    alert(`This is a ${prediction}`)
}
