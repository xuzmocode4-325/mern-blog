import 'react-circular-progressbar/dist/styles.css';
import { app } from '../firebase';
import { useSelector, useDispatch  } from 'react-redux';
import { Alert, Button, Modal, Spinner, TextInput } from 'flowbite-react';
import { useEffect, useRef, useState } from 'react'
import { CircularProgressbar } from 'react-circular-progressbar';
import { 

updateStart, 
updateSuccess, 
updateFailure,
deleteUserStart,
deleteUserSuccess,
deleteUserFailure
 
} from '../redux/user/userSlice';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { HiOutlineExclamationCircle } from 'react-icons/hi';


function DashProfile() {
  const {currentUser, error} = useSelector(state=> state.user);
  const [imageFile, setImageFile] = useState(null);
  const [imageFileURL, setImageFileURL] = useState(null);
  const [imageUploadProgress, setimageUploadProgress] = useState(null); 
  const {loading, error: errorMessage} = useSelector(state => state.user);
  const [updateUserSuccess, setUpdateUserSuccess] = useState(null);
  const [updateUserError, setUpdateUserError] = useState(null); 
  const [imageUploding, setImageUploading] = useState(false);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [showModal, setShowModal] = useState(false); 
  const [formData, setFormData] = useState({});
  const filePickerRef = useRef();
  const dispatch = useDispatch();

  const uploadeErrorMessage = 'Upload error. File must be an image type of less than 3MB'
    const handleImageUpload = (e) => {
        setUpdateUserError(null)
        setUpdateUserSuccess(null)
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
        setImageUploading(true);
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
                setImageUploading(false)
            },
            
            () => {
                getDownloadURL(
                    uploadTask.snapshot.ref
                )
                .then((downloadURL) => {
                       setImageFileURL(downloadURL); 
                       setFormData({...formData, avatar: downloadURL});
                       setImageUploading(false)
                    }    
                )
            }
        )
    }

    const handleChange = (e) => {
        setUpdateUserError(null)
        setUpdateUserSuccess(null)
        setFormData({...formData, [e.target.id]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (Object.keys(formData).length === 0) {
            setUpdateUserError("No Changes Made")
            return;
        }
        if (imageUploding) {
            return; 
        }
        try {
            dispatch(updateStart());
            const res = await fetch(`/api/user/update/${currentUser._id}`, {
                method: 'PUT',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(formData),
            });
            const data = await res.json(); 
            if (!res.ok) {
                dispatch(updateFailure(data.message));
                setUpdateUserError(data.message); 
            } else {
                dispatch(updateSuccess(data));
                setUpdateUserSuccess("Profile Sucessfully Updated"); 
            }
        } catch (error) {
            dispatch(updateFailure(error.message));
            setUpdateUserError(error.message); 
        }
    }

    const handleDeleteUser = async ( ) => {
        setShowModal(false);
        try {
            dispatch(deleteUserStart());
            const res = await fetch(`/api/user/delete/${currentUser._id}`, {
                method: 'DELETE',
            })
            const data = await res.json();
            if (!res.ok) {
                dispatch(deleteUserFailure(data.message))
            } else {
                dispatch(deleteUserSuccess(data))
            }

        } catch (error) {
            dispatch(deleteUserFailure(error.message))
            
        }
    };

    return (
    <div className='max-w-lg mx-auto p-3 w-full'>
        <h1 className='my-7 text-center font-semibold
            text-2xl'>
            Profile
        </h1>
        <form className='flex flex-col gap-7' onSubmit={handleSubmit}>
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
                defaultValue={currentUser.username} onChange={handleChange}>
            </TextInput>
            <TextInput type='email' id='email' placeholder='email' 
                defaultValue={currentUser.email} onChange={handleChange}>
            </TextInput>
            <TextInput type='text' id='password' placeholder='password'
             onChange={handleChange}>
            </TextInput>
            <Button type='submit' gradientDuoTone='greenToBlue' outline>
                {
                    loading ? (
                        <>
                            <Spinner size='sm'/>
                            <span className='pl-3'>Loading...</span>
                        </>
                    ) : 
                        <span> Update </span>
                }
            </Button>
        </form>
        <div className='text-red-700 flex justify-between mt-5'>
            <span onClick={()=>setShowModal(true)} className='cursor-pointer p-1'>Delete Account</span>
            <span onClick={()=>{}} className='cursor-pointer p-1'>Log Out</span>
        </div>
        {updateUserSuccess && (
                <Alert color='success' className='w-full flex mt-5'>
                    <div className='text-center'>{updateUserSuccess}</div>
                </Alert>
            )
        }
        {updateUserError && (
                <Alert color='failure' className='w-full flex mt-5'>
                    <div className='text-center'>{updateUserError}</div>
                </Alert>
            )
        }
        {error && (
                <Alert color='failure' className='w-full flex mt-5'>
                    <div className='text-center'>{error}</div>
                </Alert>
            )
        }
        <Modal 
            show={showModal}
            onClose={() => setShowModal(false)}
            popup
            size='md'>
            <Modal.Header/>
            <Modal.Body>
                <div className="text-center">
                    <HiOutlineExclamationCircle className='h-14 w-14 text-red-600 mb-4 mx-auto'/> 
                    <h3 className='mb-5 text-lg text-gray-800 dark:text-gray-400'>Deleting your account is irreversible. Are you sure you want to proceed?</h3>
                    <div className='flex justify-center gap-5'>
                        <Button color='failure' onClick={handleDeleteUser}>Yes, Delete My Account</Button>
                        <Button color='gray' onClick={() => setShowModal(false)}>No, Cancel</Button>
                    </div>
                </div>
            </Modal.Body>
        </Modal>
    </div>
  )
}

export default DashProfile;