import { Button, FileInput, Select, TextInput } from 'flowbite-react'
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import React from 'react'

const CreatePost = () => {
  return (
    <div className='p-3 max-w-3xl mx-auto min-h-screen'>
        <h1 className='text-center text-3xl my-7 font-semibold'>
            Create A Post
        </h1>
        <form className='flex flex-col gap-4'>
            <div className='flex flex-col gap-4 sm:flex-row justify-between'>
                <TextInput 
                    type='text' placeholder='Title' 
                    required id='title' className='flex-1'/>
                <Select>
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
                <FileInput type='file' accept='image/*' className='flex-1'/>
                <Button type='button' gradientDuoTone='greenToBlue' size='sm' outline>
                    Upload Image
                </Button>
            </div>
            <ReactQuill 
            theme='snow' placeholder='Write something...' 
            className='h-72 mb-12' required/>
            <Button type='submit' gradientDuoTone='greenToBlue'>Publish</Button>
        </form>
    </div>
  )
}

export default CreatePost