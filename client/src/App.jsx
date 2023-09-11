import Header from './Component/Layouts/Header';
import Home from './Component/Home/Section';
import Join from './Component/Chat/Section';
import Room from './Component/Chat/Room';
import Live from './Component/LiveLocation/Section';
import Video from './Component/Video/Section';

import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <div className="">
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/join" element={<Join />} />
          <Route path="/room" element={<Room />} />
          <Route path="/live" element={<Live />} />
          <Route path="/video" element={<Video />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
