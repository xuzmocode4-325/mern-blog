import 'react-quill/dist/quill.snow.css';
import 'react-circular-progressbar/dist/styles.css';
import { app } from '../firebase';
import { useState, useEffect } from 'react'
import ReactQuill from 'react-quill';
import { Alert, Button, FileInput, Select, TextInput } from 'flowbite-react'
import { CircularProgressbar } from 'react-circular-progressbar';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

function UpdatePost() {
  
    const [imageUploadProgress, setImageUploadProgress] = useState(null); 
    const [imageUploadError, setImageUploadError] = useState(null);
    const { currentUser } = useSelector((state) => state.user);
    const [updateError, setUpdateError] = useState(null); 
    const [imageFile, setImageFile] = useState(null); 
    const [formData, setFormData] = useState({});
    const { postId } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        try {
            const getPost = async () =>  {
                const res = await fetch(`/api/post/search?postId=${postId}`); 
                const data = await res.json();
                if (!res.ok) {
                    console.log(data.message)
                    setUpdateError(data.message)
                    return;
                } 
                if (res.ok) {
                    console.log(data.posts)
                    setUpdateError(null)
                    setFormData(data.posts[0])
                };
            };
            getPost();
        } catch (error) {
            console.log(error)
            setUpdateError(data.message)
        }
    }, [postId]);
  
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
                      console.log(error)
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
          setUpdateError("No Post Content Submitted");
          console.log(updateError);
          return
      } else {
          try {
              const res = await fetch(`/api/post/update/${postId}/${currentUser._id}`, {
                  method: 'PUT', 
                  headers: {
                      'Content-Type': 'application/json', 
                  },
                  body: JSON.stringify(formData),
              });
              const data = await res.json();
              if (!res.ok) {
                  setUpdateError(data.message);
                  return
              } else if (res.ok) {
                  setUpdateError(null);
                  navigate('/dashboard?tab=posts')
              }
          } catch (error) {
              setUpdateError('Something Went Wrong');
              console.log(error);
          }
      }
    };
      
    return (
      <div className='p-3 max-w-3xl mx-auto min-h-screen'>
          <h1 className='text-center text-3xl my-7 font-semibold'>
              Update Post
          </h1>
          <form className='flex flex-col gap-4'
              onSubmit={handleFormSubmit}>
              <div className='flex flex-col gap-4 sm:flex-row justify-between'>
                  <TextInput 
                      value={formData.title}
                      type='text' placeholder='Title' 
                      required id='title' className='flex-1'
                      onChange={(e) => setFormData({...formData, title: e.target.value})}  
                    />
                  <Select 
                      value={formData.category}
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
                  required value={formData.content}
                  />
              <Button type='submit' gradientDuoTone='tealToLime'>Update</Button>
              {
                  updateError && (
                      <Alert className='mt-5' color='failure'>
                          {updateError}
                      </Alert>
                  )
              }
          </form>
      </div>
    )
  }

export default UpdatePost