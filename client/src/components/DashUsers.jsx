import { Alert, Button, Modal, Table } from 'flowbite-react';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import { FaCheck, FaTimes} from 'react-icons/fa';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';  

const DashUsers = () =>  {
    const { currentUser } = useSelector((state) => state.user)
    const [users, setUsers] = useState([]);
    const [showMore, setShowMore] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [toDelete, setToDelete] = useState({})

    console.log(users)
  
    useEffect(() => {
      const fetchUsers = async () => {
        try {
          const res = await fetch(`/api/user/getusers`)
          const data = await res.json() 
          if (res.ok) {
            setUsers(data.users)
            if (data.users.length < 9) {
              setShowMore(false);
            }
          }
        } catch (error) {
           console.log(error.message)
        }
      };
      if (currentUser.administrator) {
        fetchUsers(); 
      }
    }, [currentUser._id]);
  
    const handleShowMore = async () => {
      const startIndex = users.length
      try {
        const res = await fetch(
          `/api/user/getusers?&startIndex=${startIndex}`
        ); 
        const data = await res.json() 
        if (res.ok) {
          setUsers((prev) => [...prev, ...data.users]);
          if (data.users.length < 9) {
            setShowMore(false)
          }
          console.log(data)
        }
      } catch (error) {
        console.log(error)
      }
    }
  
    const formatDateCreated = (date) => {
      const options = { 
        year: 'numeric', 
        month: '2-digit', 
        day: '2-digit' 
      }; 
  
      const formattedDate =  new Date(date).toLocaleDateString('en-Us', options)
      return formattedDate
     };

    const handleDeleteUser = async () => {
      setShowModal(false);
      try {
        const res = await fetch(
          `/api/user/remove/${toDelete.id}`,
          {method: 'DELETE'}
        );
  
        const data = await res.json();
  
        if (!res.ok) {
          console.log(data.message)
        } else {
          setUsers((prev) => {
            return prev.filter((user) => user._id !== toDelete.id)
          });
        }
      } catch (error) {
        console.log(error)
      }
    }

    return (
      <div className='table-auto overflow-x-scroll md:mx-auto p-3 scrollbar
       scrollbar-track-slate-100 scrollbar-thumb-slate-300
       dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500'> 
  
        {
          currentUser.administrator && users && users.length > 0  ? 
          (
          <>
            <Table hoverable className='shadow-sm'>
              <Table.Head>
                <Table.HeadCell>Date Created</Table.HeadCell>
                <Table.HeadCell>User Image</Table.HeadCell>
                <Table.HeadCell>Username</Table.HeadCell>
                <Table.HeadCell>Email</Table.HeadCell>
                <Table.HeadCell>Admin</Table.HeadCell>
                <Table.HeadCell>Delete</Table.HeadCell>
              </Table.Head>
              <Table.Body className='divide-y'>
              {
                users.map((user, idx) => (
                  <Table.Row className='bg-white dark:border-gray-700 dark:bg-gray-800' key={idx+1}>
                    <Table.Cell>{formatDateCreated(user.createdAt)}</Table.Cell>
                    <Table.Cell>
                      <Link to={`/user/${user.username}`}>
                        <img 
                          src={user.avatar} 
                          alt={user.username}
                          className='w-10 h-10 rounded-full object-cover bg-grey-500'
                        />
                      </Link>
                    </Table.Cell>
                    <Table.Cell>
                      <Link className='font-medium text-gray-800 dark:text-off-white'
                        to={`/user/${user.username}`}>
                        {user.username}
                      </Link>
                    </Table.Cell>
                    <Table.Cell>{user.email}</Table.Cell>
                    <Table.Cell>
                        {user.administrator ? 
                            (<FaCheck className='text-green-400'/>) : 
                            (<FaTimes className='text-red-500'/>)} 
                    </Table.Cell>
                    <Table.Cell>
                      <span className='text-red-500 font-medium hover:underline'
                        onClick={() => {
                          setShowModal(true)
                          setToDelete({id: user._id, username: user.username})
                        }}  >
                        Delete
                      </span>
                    </Table.Cell>
                  </Table.Row> 
                ))}
                </Table.Body>
            </Table>
            {
              showMore && (
                <button onClick={handleShowMore} className='w-full text-teal-500 font-semibold self-center py-7'>
                  Show More
                </button>
              )
            }
          </>
          ) : (
            <Alert color='warning'>No Users To Show Yet - Try Refreshing This Page</Alert>
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
                      <HiOutlineExclamationCircle className='h-14 w-14 text-red-700 mb-4 mx-auto'/> 
                      <h3 className='mb-5 text-lg text-gray-800 dark:text-gray-400'>
                          You are about to permanently delete: <br/> 
                          <span className='font-bold'>
                            "{toDelete.username}"
                          </span><br/>
                           Proceed?
                      </h3>
                      <div className='flex justify-center gap-5'>
                          <Button color='failure' onClick={handleDeleteUser}>Yes, Delete This User</Button>
                          <Button color='gray' onClick={() => setShowModal(false)}>No, Cancel</Button>
                      </div>
                  </div>
              </Modal.Body>
          </Modal>
      </div>
    )
  }

export default DashUsers