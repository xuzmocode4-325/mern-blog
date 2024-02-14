import { Alert, Button, TextInput } from 'flowbite-react';
import { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from '../firebase';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';



function DashProfile() {
  const {currentUser} = useSelector(state=> state.user);
  const [imageFile, setImageFile] = useState(null);
  const [imageFileURL, setImageFileURL] = useState(null);
  const [imageUploadProgress, setimageUploadProgress] = useState(null)
  const [imageUploadError, setImageUploadError] = useState(null)
  const filePickerRef = useRef()
  const uploadeErrorMessage = 'Upload error. File must be of type .png, .jpg or jpeg  and less than 3MB'
    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        console.log(file.type)
        const fileTypes = [
            "image/apng",
            "image/bmp",
            "image/gif",
            "image/jpeg",
            "image/pjpeg",
            "image/png",
            "image/svg+xml",
            "image/tiff",
            "image/webp",
            "image/x-icon",
          ];

        if (file && fileTypes.includes(file.type) && file.size < 3 * 1024 * 1024) {
            setImageFile(file);
            setImageFileURL(URL.createObjectURL(file));
        } else   {
            setImageUploadError(uploadeErrorMessage)
        }          
    };
    
    useEffect(() => {
        if(imageFile) {
            uploadImage();
        }
    }, [imageFile]);

    const uploadImage = async () => {
        // service firebase.storage {
        //    match /b/{bucket}/o {
        //      match /{allPaths=**} {
        //        allow read: 
        //        allow write: if 
        //        request.resource.size < 3 * 1024 * 1024 &&
        //        request.resource.contentType.matches('image/.*');
        //     }
        //   }
        // }
        setImageUploadError(null);
        const storage = getStorage(app);
        const filename = new Date().getTime() + imageFile.name;
        const storageRef = ref(storage, filename);
        const uploadTask = uploadBytesResumable(storageRef, imageFile);
        uploadTask.on(
            'state_changed',
            (snapshot) => {
                const progress = 
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

                setimageUploadProgress(
                    progress.toFixed(0)
                );
            },
            (error) => {
                console.log(error)
                setImageUploadError(uploadeErrorMessage)
                setImageFile(null)
                setimageUploadProgress(null)
                setImageFileURL(null)
            },
            
            () => {
                getDownloadURL(
                    uploadTask.snapshot.ref
                )
                .then((downloadURL) => {
                       setImageFileURL(downloadURL) 
                    }    
                )
            }
        )
        console.log('upload image...')
    }

    return (
    <div className='max-w-lg mx-auto p-3 w-full'>
        <h1 className='my-7 text-center font-semibold
            text-2xl'>
            Profile
        </h1>
        <form className='flex flex-col gap-7'>
            <input type='file' accept='image/*' onChange={handleImageUpload}
            ref={filePickerRef} hidden/>
            <div className='relative w-32 h-32 self-center cursor-pointer
                shadow-md overflow-hidden rounded-full'
                onClick={() => filePickerRef.current.click()}>
                {
                    imageUploadProgress && (
                        <CircularProgressbar 
                            value={imageUploadProgress || 0}
                            text={`${imageUploadProgress}%`}
                            strokeWidth={5}
                            styles={{
                                root: {
                                    width: '100%',
                                    height: '100%',
                                    position: 'absolute',
                                    top: 0,
                                    left: 0
                                },
                                path: {
                                   stroke: `rgba(50, 200, 100, ${imageUploadProgress / 100}`
                                },
                                text: {
                                    // Text color
                                    fill: 'rgb(50, 200, 100)',
                                    // Text size
                                    fontSize: '24px',
                                  },
                            }}
                        />
                    )
                }
                <img src={imageFileURL || currentUser.avatar} alt='user-avatar'
                className={`rounded-full w-full h-full object-cover 
                border-gray-300 border-8
                ${imageUploadProgress && imageUploadProgress < 100 && 'opacity-40'}`}/>
            </div>
            {
                imageUploadError && (
                <Alert className='mx-auto' color='failure'>
                   {imageUploadError}
                </Alert>
                )
            }
            <TextInput type='text' id='username' placeholder='username' 
                defaultValue={currentUser.username}>
            </TextInput>
            <TextInput type='email' id='email' placeholder='email' 
                defaultValue={currentUser.email}>
            </TextInput>
            <TextInput type='text' id='password' placeholder='password'>
            </TextInput>
            <Button type='submit' gradientDuoTone='greenToBlue' outline>
                Update
            </Button>
        </form>
        <div className='text-red-700 flex justify-between mt-6'>
            <span className='cursor-pointer p-1'>Delete Account</span>
            <span className='cursor-pointer p-1'>Log Out</span>
        </div>
      
    </div>
  )
}

export default DashProfile;