import { BrowserRouter as Router,
         Route, 
         Redirect, 
         Switch } from 'react-router-dom';

import CityList from './pages/CityList';
import Home from './pages/Home';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Switch>
          <Route path='/home' component={Home}></Route>
          <Route path='/citylist' component={CityList}></Route>
          <Redirect path='/' to='/home'></Redirect>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
