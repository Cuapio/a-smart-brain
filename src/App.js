import React, { Component } from 'react';

import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';

import Particles from 'react-particles-js';

import 'tachyons';
import './App.css';

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
  boxes: [],
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

  calculateFacesLocation = (faceDetectionData) => {
    const boundingBoxes = [];

    const image = document.getElementById("inputimage");

    const width = Number(image.width);
    const height = Number(image.height);

    boundingBoxes = faceDetectionData.outputs[0].data.regions.map(region => {
      const boundingBox = region.region_info.bounding_box; 
      const { left_col, top_row, right_col, bottom_row } = boundingBox;

      return {
        leftCol: width * left_col,
        topRow: height * top_row,
        rightCol: width - (width * right_col),
        bottomRow: height - (height * bottom_row)
      }
    })
    //const faceLocation = faceDetectionData.outputs[0].data.regions[0].region_info.bounding_box;
    return boundingBoxes;
  }
  
  setFaceBox = (boxes) => {
    this.setState({boxes})
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
      .then(faceDetectionResponse => {
        if(faceDetectionResponse) {            
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
        this.setFaceBox(this.calculateFacesLocation(faceDetectionResponse));
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
    const { isSignedIn, boxes, imageUrl, route } = this.state;
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
              <FaceRecognition boxes={boxes} imageUrl={imageUrl}/> 
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
