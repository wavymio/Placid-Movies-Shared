const { v2: cloudinary } = require('cloudinary')

const uploadMedia = async (file, resourceType) => {
    const base64Media = Buffer.from(file.buffer).toString("base64")
    const dataURI = `data:${file.mimetype};base64,${base64Media}`

    const uploadResponse = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_large(
            dataURI,
            {
                resource_type: resourceType,
                // chunk_size: 20000000, // 10MB chunks
                timeout: 600000,
                // transformation: {
                //     quality: "auto", // Auto adjusts quality based on content
                //     width: 1280, // Resize width to 1280px
                //     crop: "limit" // Ensure the aspect ratio is maintained
                // }
            },
            (error, result) => {
                if (error) {
                    console.log("oh no")
                    return reject(error)
                }
                resolve(result)
            }
        )
    })
    console.log("Upload successful:", uploadResponse.url)
    return uploadResponse.url
}

module.exports = uploadMedia