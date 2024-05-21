import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const accessToken = localStorage.getItem('accessToken');
    const navigate = useNavigate();
    const [photo, setPhoto] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetch('http://localhost:4000/home', {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + accessToken
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            navigate('/display');
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
    }, [navigate, accessToken]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];

        if (file) {
            if (file.type && file.type.startsWith('image/')) {
                setPhoto(file);
            } else {
                console.log('Not an image');
            }
        }
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        if (!photo) {
            setError('No file selected');
            return;
        }

        const formData = new FormData();
        formData.append('photo', photo);

        setLoading(true);

        fetch('http://localhost:4000/saveData', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + accessToken
            },
            body: formData
        })
        .then(res => {
            setLoading(false);
            if (res.ok) {
                navigate('/display')
                console.log('File uploaded successfully');
            } else {
                console.log('File upload unsuccessful');
            }
        })
        .catch(error => {
            setLoading(false);
            console.log('There was an error with the upload operation:', error);
        });
    };

    const handleLogout = () => {
        localStorage.removeItem('accessToken');
        navigate('/login');
    };

    return (
        <>
            <div>
                <form onSubmit={handleFormSubmit}>
                    <input type="file" onChange={handleFileChange} />
                    <button type="submit" className='bg-slate-400 p-2 rounded-3xl'>Submit</button>
                </form>
                {photo && (
                    <div>
                        <p>Selected Image: {photo.name}</p>
                        <img src={URL.createObjectURL(photo)} alt="Selected" width="100" />
                    </div>
                )}
                {error && <p>{error}</p>}
                {loading && <p>Loading...</p>}
            </div>
            <div>
                <button onClick={handleLogout} className="w-fit text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                    Logout
                </button>
            </div>
        </>
    );
};

export default Home;
