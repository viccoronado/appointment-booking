import { Route } from 'react-router-dom';
import AdminClients from './Pages/AdminClients';
import BookingAppointments from './Pages/BookingAppointments';
import Graphics from './Pages/Graphics';

import './style.css'

function App() {
  return (
    <>
      <Route path="/" component={BookingAppointments} exact />
      <Route path="/admin" component={AdminClients} exact />
      <Route path="/statistics" component={Graphics} exact />
    </>
  );
}

export default App;
