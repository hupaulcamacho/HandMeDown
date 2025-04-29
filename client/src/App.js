import React from 'react';
import { Route, Routes, Navigate, useNavigate, useParams, useLocation } from 'react-router-dom';
import api from './services/api';

import './App.css';

import PrivateRoute from './Components/PrivateRoute';
import AuthContainer from './Containers/AuthContainer';

import NavBar from './Components/NavBar';
import Home from './Components/Home';
import Wardrobe from './Components/Wardrobe';
import About from './Components/About';
import Garment from './Components/Garment';

class App extends React.Component {
  state = {
    user: null,
    isUserLoggedIn: false,
    loadingUser: true
  }

  componentDidMount() {
    this.checkUserLoggedIn();
  }

  setUser = (user) => {
    this.setState({
      user: user,
      isUserLoggedIn: true,
      loadingUser: false
    });
  }

  checkUserLoggedIn = async () => {
    try {
      const { data } = await api.get("/auth/isUserLoggedIn");
      this.setUser(data.payload);
    } catch (err) {
      if (err.message.includes(401)) {
        this.setState({
          loadingUser: false
        })
      }
    }
    console.log('Checking if user logged in');
  }

  // Removed renderAuthContainer, renderWardrobe, and renderGarment methods
  // as they're no longer needed with React Router v6 element props

  logoutUser = async () => {
    console.log('logging out user');
    try {
      await api.get('/auth/logout');
      this.setState({
        user: null,
        isUserLoggedIn: false
      });
      this.props.navigate('/');
    } catch (err) {
      console.log('ERROR', err);
    }
  }

  render() {
    return (
      <div className="App">
        <NavBar
          user={this.state.user}
          logoutUser={this.logoutUser}
          isUserLoggedIn={this.state.isUserLoggedIn}
        />
        <Routes>
          <Route path='/user/wardrobe/garment/:id' element={<GarmentWithRouter user={this.state.user} />} />
          
          {/* Use PrivateRoute for protected routes */}
          <Route 
            path='/user/wardrobe' 
            element={
              <PrivateRoute isUserLoggedIn={this.state.isUserLoggedIn}>
                <Wardrobe user={this.state.user} />
              </PrivateRoute>
            } 
          />
          
          <Route path='/login' element={<AuthContainer isUserLoggedIn={this.state.isUserLoggedIn} setUser={this.setUser} />} />
          <Route path='/signup' element={<AuthContainer isUserLoggedIn={this.state.isUserLoggedIn} setUser={this.setUser} />} />
          <Route path='/about' element={<About />} />
          <Route path='/' element={<Home />} />
        </Routes>
      </div>
    );
  }
}

// Higher-order component to provide navigate function to class component
function withRouter(Component) {
  function ComponentWithRouterProp(props) {
    let navigate = useNavigate();
    let params = useParams();
    let location = useLocation();
    
    return <Component {...props} navigate={navigate} params={params} location={location} />;
  }
  
  return ComponentWithRouterProp;
}

// Wrapper for Garment component to provide route params
function GarmentWithRouter(props) {
  const params = useParams();
  return <Garment {...props} id={params.id} />;
}

export default withRouter(App);
