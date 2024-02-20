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
    const [imageUploadError, setImageUploadAlert] = useState(null);
    const { currentUser } = useSelector((state) => state.user);
    const [updateAlert, setUpdateAlert] = useState(null); 
    const [imageFile, setImageFile] = useState(null); 
    const [formData, setFormData] = useState({});
    const { postId } = useParams();

    useEffect(() => {
        try {
            const getPost = async () =>  {
                const res = await fetch(`/api/post/search?postId=${postId}`); 
                const data = await res.json();
                if (!res.ok) {
                    console.log(data.message)
                 setUpdateAlert({message: data.message, type: "failure"})
                    return;
                } 
                if (res.ok) {
                    console.log(data.posts)
                 setUpdateAlert({message: "Post Loaded Successfully", type: "success"})
                    setFormData(data.posts[0])
                };
            };
            getPost();
        } catch (error) {
            console.log(error)
         setUpdateAlert({message: error, type: "failure"})
        }
    }, [postId]);
  
    const handleImageUpload = (e) => {
      setUpdateAlert(null)
      const file = e.target.files[0];
      const fileTypes = [
          "image/png",
          "image/bmp",
          "image/gif",
          "image/jpeg",
          "image/jpg",
          "image/png",
          "image/svg+xml",
          "image/tiff",
          "image/webp",
          "image/x-icon",
        ];
  
          if (file && fileTypes.includes(file.type) && file.size < 3 * 1024 * 1024) {
              setImageFile(file);
          }  else if (!file) {
              setImageUploadAlert({message:"No File Selected", type: "failure"}); 
              console.log(imageUploadError);
          } else   {
              setImageUploadAlert({message: "File Not Supprted", type: "failure"}); 
              console.log(imageUploadError);
          }          
      };
  
      const uploadImage = async () => {
          try {
              if (!imageFile) {
                  setImageUploadAlert({message: "No File Selected", type: "failure"})
                  return; 
              }
              
              setImageUploadAlert(null)
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
                      setImageUploadAlert({message:"Image Upload Failed", type:"failure"})
                      setImageFile(null)
                      setImageUploadProgress(null)
                  },
                  () => {
                      getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                          setFormData({...formData, image: downloadURL});
                          setImageUploadProgress(null);
                          setImageUploadAlert(null); 
                  });
              }); 
  
          } catch (error) {
              setImageUploadAlert({message:"Image Upload Failed", type:"failure"});
              setImageUploadProgress(null); 
              console.log(error)
          }
          
      }; 
  
    const handleFormSubmit = async (e) => {
      e.preventDefault();
      setUpdateAlert(null)
      if (!formData.content) {
         setUpdateAlert({message: "No Post Content Submitted", type:'failure'});
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
                 setUpdateAlert(data.message);
                  return
              } else if (res.ok) {
                setUpdateAlert({message:"Post Successfully Updated", type: "success"});
              }
          } catch (error) {
             setUpdateAlert({message:"Something Went Wrong", type: "failure"});
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
              {formData.image && (
                  <img src={formData.image} 
                  alt='upload' 
                  className='w-full h-72 object-cover'/>
                  )
              }
               { imageUploadError && (
                  <Alert color='failure'>
                      {imageUploadError}
                  </Alert>
                  ) 
              }
              {
                  updateAlert && (
                      <Alert className='mt-5' color={updateAlert.type}>
                          {updateAlert.message}
                      </Alert>
                  )
              }
              <ReactQuill 
                  theme='snow' placeholder='Write something...' 
                  className='h-72 mb-12' onChange={(value) => setFormData({...formData, content: value})}
                  required value={formData.content}
                  />
              <Button type='submit' gradientDuoTone='tealToLime'>Update</Button>
          </form>
      </div>
    )
  }

export default UpdatePost