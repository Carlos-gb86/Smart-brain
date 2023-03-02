import React from 'react';
import Navigation from './Components/Navigation/Navigation'
import Signin from './Components/Signin/Signin'
import Register from './Components/Register/Register'
import Logo from './Components/Logo/Logo'
import ImageLinkForm from './Components/ImageLinkForm/ImageLinkForm'
import Rank from './Components/Rank/Rank'
import FaceRecognition from './Components/FaceRecognition/FaceRecognition'
import ParticlesBg from 'particles-bg'
import Clarifai from 'clarifai'
import './App.css';

// console.log(Clarifai)
// window.process = {
//     env: {
//         NODE_ENV: 'development'
//     }
// }

const app = new Clarifai.App({
  apiKey: '5a2919de53b14d8aad9d6691a874c784',
})

class App extends React.Component {
  constructor(){
    super();
    this.state = {
      input:'',
      imageUrl:'',
      box: {},
      route: 'signin',
      isSignedIn: false
    }
  }

  calculateFaceLocation = (data) => {
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputImage');
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width * (1- clarifaiFace.right_col),
      bottomRow: height * (1-clarifaiFace.bottom_row)
    }
  }

  displayFaceBox = (box) => {
    console.log(box)
    this.setState({box: box})
  }

  onInputChange = (event) =>{
    this.setState({input: event.target.value})
  }

  onButtonSubmit = () => {
    this.setState({imageUrl: this.state.input})
    app.models.predict({
          id: 'face-detection',
          name: 'face-detection',
          version: '6dc7e46bc9124c5c8824be4822abe105',
          type: 'visual-detector',
        },
      this.state.input)
    .then(response => { 
        this.displayFaceBox(this.calculateFaceLocation(response));
      })
    .catch(error => console.log(error));
  }

  onRouteChange = (route) => {
    if (route === 'home') {
      this.setState({isSignedIn: true})
    } else {
      this.setState({isSignedIn: false})
    }
    this.setState({route: route});
  }

  render () {
    const {isSignedIn, imageUrl, route, box} = this.state;
    return (
    <div className="App">
      <ParticlesBg color="#ffffff" num={100} type="cobweb" bg={true} />
      <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange}/>
      <Logo />
      { route === 'home'
        ? <div>
            <Rank />
            <ImageLinkForm 
              onInputChange={this.onInputChange}
              onButtonSubmit={this.onButtonSubmit}
            />
            <FaceRecognition box={box} imageUrl={imageUrl}/>
          </div>
        : (
          route === 'signin'
           ? <Signin onRouteChange={this.onRouteChange}/>
           : <Register onRouteChange={this.onRouteChange}/>
        )
      }
    </div>
    )
  };
}

export default App;
