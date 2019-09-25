import React, { Component } from 'react';
import Particles from 'react-particles-js';
import Navigation from './components/Navigation/Navigation';
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';

import './App.css';
import 'tachyons';

// const logo = document.querySelectorAll("#logo path");
// for(let i = 0; i < logo.length; i++) {
//   console.log(`Letter ${i} is ${logo[i].getTotalLength()}`);
// }

const particlesOptions = {
  particles: {
    number: {
      value: 75,
      density: {
        enable: true,
        value_area: 800
      }
    }
  }
}

const initalState = {
  input: '',
  imageUrl:'',
  //https://samples.clarifai.com/face-det.jpg
  box: {},
  route: 'signin',
  isSignedIn: false,
  user: {
    id: '',
    name: '',
    email: '',
    entries: 0,
    joined: ''
  }
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = Object.assign({},initalState);
  }

  loadUser = ({ id, name, email, entries, joined }) => {
    this.setState({ user: {
      id: id,
      name: name,
      email: email,
      entries: entries,
      joined: joined
    }})
  }

  calculateFaceLocation = (data) => {
    const faceLocation = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById("inputimage");
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      leftCol: width * faceLocation.left_col,
      topRow: height * faceLocation.top_row,
      rightCol: width - (width * faceLocation.right_col),
      bottomRow: height - (height * faceLocation.bottom_row)
    }
  }
  
  setFaceBox = (box) => {
    this.setState({box})
  }

  onInputChange = (event) => {
    this.setState({input: event.target.value});
  }

  onPictureSubmit = (event) => {
    if(this.state.input.length !== 0){
      this.setState({imageUrl: this.state.input});
      fetch('https://vast-earth-54222.herokuapp.com/imageurl', {
        method: 'post',
        headers: {'content-type': 'application/json'},
        body: JSON.stringify({
            input: this.state.input
        })
      })
      .then(response => response.json())
      .then(response => {
        if(response) {            
          fetch('https://vast-earth-54222.herokuapp.com/image', {
            method: 'put',
            headers: {'content-type': 'application/json'},
            body: JSON.stringify({
                id: this.state.user.id
            })
          })
          .then(res => res.json())
          .then(entries => {
            this.setState(Object.assign(this.state.user, {entries}))
          })
          .catch(err => console.log)
        }
        this.setFaceBox(this.calculateFaceLocation(response));
      })    
      .catch(err => console.log(err))
    }
  }

  onRouteChange = (route) => {
    if(route === 'signin') {
      this.setState(initalState);
    } else if(route === 'home'){
      this.setState({isSignedIn: true})
    }
    this.setState({route: route});
  }

  render() {
    //console.log("input: ", this.state.input, " imageURL: ", this.state.imageUrl);
    const { isSignedIn, box, imageUrl, route } = this.state;
    const { name, entries } = this.state.user;
    return (
      <div className="App">
        <Particles className='particles'
                params={particlesOptions} />
        <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange}/>
        { route === 'home' 
          ? <div> 
              <Logo />
              <Rank name={name} entries={entries}/>
              <ImageLinkForm onInputChange={this.onInputChange} onPictureSubmit={this.onPictureSubmit} />
              <FaceRecognition box={box} imageUrl={imageUrl}/> 
            </div>
          : (route === 'signin' 
              ? <Signin loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
              : <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
            )  
        } 
      </div>
    );
  }
}

export default App;
