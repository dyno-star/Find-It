
import React, { useState } from 'react';

function App() {
  const [foundItems, setFoundItems] = useState([]);
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [currentPhoto, setCurrentPhoto] = useState(null);

  return (
    <div className="container">
      <h1>Lost & Found</h1>
      
      {/* Capture Section */}
      <CameraCapture onCapture={setCurrentPhoto} />
      
      {/* Form */}
      {currentPhoto && (
        <>
          <img src={currentPhoto} alt="Captured" />
          <input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
          />
          <input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Location"
          />
          <button onClick={() => {
            setFoundItems([{ photo: currentPhoto, description, location }, ...foundItems]);
            setCurrentPhoto(null);
            setDescription('');
            setLocation('');
          }}>
            Post Item
          </button>
        </>
      )}

      {/* Items List */}
      {foundItems.map((item, index) => (
        <FoundItem key={index} {...item} />
      ))}
    </div>
  );
}

export default App;