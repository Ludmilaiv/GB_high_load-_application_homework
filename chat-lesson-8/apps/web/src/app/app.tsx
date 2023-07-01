import { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignIn from './sign-in/sign-in';
import Profile from './profile/profile';
import { QueryClient, QueryClientProvider } from 'react-query'
import Home from './home/home';
import Chat from './chat/chat';

const queryClient = new QueryClient();

export function App() {

  return (
    <QueryClientProvider client={queryClient}>
      <div>
        <header>
          <nav>
            |<a href="/chat">Чат</a> |
            |<a href="/user/profile">Профиль</a> |
            |<a href="/signin">Вход</a> |
          </nav>
        </header>

        <hr />

        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path="/user/profile" element={<Profile />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path='/' element={<Home />}></Route>
            <Route path='/chat' element={<Chat/>}></Route>
          </Routes>
        </Suspense>
      </div>
    </QueryClientProvider>
  );
}

export default App;
