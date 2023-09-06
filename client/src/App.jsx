import Header from './Component/Layouts/Header';
import Home from './Component/Home/Section';
import Chat from './Component/Chat/Section';
import Live from './Component/LiveLocation/Section';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <div className="">
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/live" element={<Live />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
