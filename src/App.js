import React, { Component } from 'react';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import Rank from './components/Rank/Rank';
import Signin from './components/Signin/Signin.js';
import Register from './components/Register/Register.js';
import FaceRecognistion from './components/FaceRecognistion/FaceRecognistion';
import Particles from 'react-particles-js';
import Clarifai from 'clarifai';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import './App.css';

const app = new Clarifai.App({
  apiKey: 'b1fb261e9d124b7788fb1be78ce97d8c'
});

const particle = {
  particles: {
    number: {
        "value": 100
    },
    size: {
        "value": 3
    }
  },
  interactivity: {
    events: {
        onhover: {
            enable: true,
            mode: "repulse"
        }
    }
  }
}

class App extends Component {
  	constructor(){
    	super();
    	this.state = {
			input: '',
			imageUrl: '',
			box: {},
			route: 'signin',
			isSignedIn: false,
			user: {
				id: '',
				name: '',
				email: '',
				password: '',
				entries: 0,
				joined: ''
			}
  		}
  	}

  	loadUser = (data) => {
	  	this.setState({ user: {
			id: data.id,
			name: data.name,
			email: data.email,
			password: data.password,
			entries: data.entries,
			joined: data.joined
			}
		})
  	}

  	CalculateFaceLocation = (data) => {
		const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
		const image = document.getElementById('inputimage');
		const width = Number(image.width);
		const height = Number(image.height);
		return {
			leftCol: clarifaiFace.left_col * width,
			topRow: clarifaiFace.top_row * height,
			rightCol: width - (clarifaiFace.right_col * width),
			bottomRow: height - (clarifaiFace.bottom_row * height)
		}
	} 

  	displayFaceBox = (box) => {
    	console.log(box);
    	this.setState({ box });
  	}

  	onGivenInput = (event) => {
    	this.setState({input: event.target.value});
  	}

  	onGivenClick = () => {
    	this.setState({imageUrl: this.state.input})
		app.models
			.predict(
				Clarifai.FACE_DETECT_MODEL, this.state.input)
			.then(response => {
				if(response){
					fetch('http://localhost:3000/image', {
						method: 'put',
						headers: {'Content-Type': 'application/json'},
						body: JSON.stringify({
							id: this.state.user.id
						})
					})
					.then(response => response.json())
					.then(count => {
						this.setState(Object.assign(this.state.user, { entries: count }))
					})
					
				}
				this.displayFaceBox(this.CalculateFaceLocation(response))
			})
			.catch(err => console.log(err));
	}


 	onRouteChange = (route) => {
		if (route === 'signout') {
			this.setState({isSignedIn: false});
		}else if (route === 'home') {
			this.setState({isSignedIn: true});
		}
		this.setState({ route: route});
	}

  	render(){  

    	const { isSignedIn, imageUrl, route, box } = this.state;

		return (
			<div className="App">
				<Particles className='particles'
				params={particle} 
				/>
				<Navigation onRouteChange={this.onRouteChange} isSignedIn={isSignedIn} />
				{route === 'home'
					? <div>
						<Logo />
						<Rank name={this.state.user.name} entries={this.state.user.entries} />
						<ImageLinkForm 
							onGivenInput={this.onGivenInput}
							onGivenClick={this.onGivenClick}  
						/>
						<FaceRecognistion box={box} imageUrl={imageUrl} />
					</div>
					:(route === 'signin' 
						?<Signin  loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
						:<Register  loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
					) 
				} 
			</div>
		);
  	}
}

export default App;
