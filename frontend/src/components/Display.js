import React, { useState, useEffect } from 'react';

const Display = () => {
  const [photos, setPhotos] = useState([]);
  const accessToken = localStorage.getItem('accessToken');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:4000/getUserData', {
          method: 'GET',
          headers: {
            'Authorization': 'Bearer ' + accessToken
          }
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        setPhotos(data.imagePath);

      } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
      }
    };

    fetchData();
  }, [accessToken]);

  return (
    <>
      <div>Display</div>
      <div>
        {photos.map((path, index) => (
          <img key={index} src={`http://localhost:4000/${path}`} alt={`Image ${index}`} />
        ))}
      </div>
    </>
  );
};

export default Display;
