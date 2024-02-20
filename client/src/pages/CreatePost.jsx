import 'react-quill/dist/quill.snow.css';
import 'react-circular-progressbar/dist/styles.css';
import { app } from '../firebase';
import { useState } from 'react'
import ReactQuill from 'react-quill';
import { Alert, Button, FileInput, Select, TextInput } from 'flowbite-react'
import { CircularProgressbar } from 'react-circular-progressbar';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { useNavigate } from 'react-router-dom';

const CreatePost = () => {
  const [imageFile, setImageFile] = useState(null); 
  const [imageUploadError, setImageUploadError] = useState(null);
  const [imageUploadProgress, setImageUploadProgress] = useState(null); 
  const [publishError, setPublishError] = useState(null); 
  const [formData, setFormData] = useState({})
  const navigate = useNavigate()

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
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
        }  else if (!file) {
            setImageUploadError("No File Selected"); 
            console.log(imageUploadError);
        } else   {
            setImageUploadError("File Not Supported"); 
            console.log(imageUploadError);
        }          
    };

    const uploadImage = async () => {
        try {
            if (!imageFile) {
                setImageUploadError("No File Selected")
                return; 
            }
            
            setImageUploadError(null)
            const storage = getStorage(app);
            const filename = new Date().getTime() + imageFile.name;
            const storageRef = ref(storage, filename);
            const uploadTask = uploadBytesResumable(storageRef, imageFile);
            uploadTask.on(
                'state_changed',
                (snapshot) => {
                    const progress = 
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    setImageUploadProgress(progress.toFixed(0));
                },
                (error) => {
                    setImageUploadError("Image Upload Failed")
                    setImageFile(null)
                    setImageUploadProgress(null)
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        setFormData({...formData, image: downloadURL});
                        setImageUploadProgress(null);
                        setImageUploadError(null); 
                });
            }); 

        } catch (error) {
            setImageUploadError("Image Upload Failed");
            setImageUploadProgress(null); 
            console.log(error)
        }
        
    }; 

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.content) {
        setPublishError("No Post Content Submitted");
        console.log(publishError);
        return
    } else {
        try {
            const res = await fetch('/api/post/create', {
                method: 'POST', 
                headers: {
                    'Content-Type': 'application/json', 
                },
                body: JSON.stringify(formData),
            });
            const data = await res.json();
            if (!res.ok) {
                setPublishError(data.message);
                return
            } else if (res.ok) {
                setPublishError(null);
                navigate(`/dashboard?tab=posts`)
            }
        } catch (error) {
            setPublishError('Something Went Wrong');
            console.log(error);
        }
    }
  };
    
  return (
    <div className='p-3 max-w-3xl mx-auto min-h-screen'>
        <h1 className='text-center text-3xl my-7 font-semibold'>
            Create A Post
        </h1>
        <form className='flex flex-col gap-4'
            onSubmit={handleFormSubmit}>
            <div className='flex flex-col gap-4 sm:flex-row justify-between'>
                <TextInput 
                    type='text' placeholder='Title' 
                    required id='title' className='flex-1'
                    onChange={(e) => setFormData({...formData, title: e.target.value})}/>
                <Select 
                    onChange={(e) => setFormData({...formData, category: e.target.value})}>
                    <option value="uncategorized">Uncategorized</option>
                    <option value="philosophy">Philosopy</option>
                    <option value="mental health">Mental Health</option>
                    <option value="fitness">Fitness</option>
                    <option value="meditation">Meditation</option>
                    <option value="herbal remedies">Herbal Remedies</option>
                    <option value="nutrition">Nutrition</option>
                </Select>
            </div>
            <div className='
                flex  gap-4 items-center justify-between 
                border-4 border-teal-500 border-dotted p-3'>
                <FileInput type='file' accept='image/*' className='flex-1'
                    onChange={handleImageUpload}/>
                <Button type='button' gradientDuoTone='tealToLime'  size='sm' outline
                    onClick={uploadImage} disabled={imageUploadProgress}>
                    { 
                        imageUploadProgress ? (
                            <div className="w-16 h-16">
                              <CircularProgressbar value={imageUploadProgress}
                              text={`${imageUploadProgress || 0}%` }/>
                            </div>
                        ) : ("Upload Image")
                    }
                </Button>
            </div>
            { imageUploadError && (
                <Alert color='failure'>
                    {imageUploadError}
                </Alert>
                ) 
            }
            {formData.image && (
                <img src={formData.image} 
                alt='upload' 
                className='w-full h-72 object-cover'/>
                )
            }
            <ReactQuill 
                theme='snow' placeholder='Write something...' 
                className='h-72 mb-12' onChange={(value) => setFormData({...formData, content: value})}
                required
                />
            <Button type='submit' gradientDuoTone='tealToLime'>Publish</Button>
            {
                publishError && (
                    <Alert className='mt-5' color='failure'>
                        {publishError}
                    </Alert>
                )
            }
        </form>
    </div>
  )
}

export default CreatePost; 