window.onload = () => {
    const imageInput = document.getElementById('image-input')
    let uploadedImage
    imageInput.addEventListener('change', (e) => {
        const file = e.target.files[0]
        if (!file){
            document.getElementById('image').src = '../images/default image.jpg'
            document.getElementById('prediction').textContent = ''
            uploadedImage = null;
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
            'http://127.0.0.1:8000/images',
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
    alert(`It is a ${prediction}`)
}
