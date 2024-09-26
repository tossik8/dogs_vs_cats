let uploadedImage

window.onload = () => {
    const imageInput = document.getElementById('image-input')
    imageInput.addEventListener('change', (e) => uploadImage(e))

    const imageForm = document.getElementById('image-form')
    imageForm.addEventListener('submit', (e) => submitForm(e))
}

function uploadImage(e){
    const file = e.target.files[0]
    if (!file){
        document.getElementById('image').src = '../images/default image.jpg'
        hideElements(['prediction-container'])
        uploadedImage = null
        return
    }
    uploadedImage = file
    const reader = new FileReader()
    reader.onload = (e) => {
        document.getElementById('image').src = e.target.result
        hideElements(['prediction-container'])
    }
    reader.readAsDataURL(uploadedImage)
}

async function submitForm(e){
    e.preventDefault()
    if(!uploadedImage){
        return
    }
    const formData = new FormData()
    formData.append('image', uploadedImage)
    showElements(['loader-background', 'loader'])
    const response = await fetch(
        'http://localhost:8000/images',
        {
            method: 'POST',
            body: formData
        }
    )
    const score = await response.json()
    hideElements(['loader-background', 'loader'])
    processPrediction(score)
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
    document.getElementById('prediction').innerHTML = `This is a <span>${prediction}</span>!`
    showElements(['prediction-container'])
}

function hideElements(elements){
    for(let element of elements){
        document.getElementById(element).classList.add('hidden')
    }
}

function showElements(elements){
    for(let element of elements){
        document.getElementById(element).classList.remove('hidden')
    }
}
