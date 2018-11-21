
import * as React from 'react';
import Modal from 'react-responsive-modal';
// import * as Webcam from "react-webcam";
import './App.css';
// import MemeDetail from './components/MemeDetail';
import RecipeList from './components/RecipeList';


interface IState {
	currentRecipe: any,
	open: boolean,
	recipes: any[],
	
	uploadFileList: any,
	authenticated: boolean,
	refCamera: any
	predictionResult: any
}

class App extends React.Component<{}, IState> {
	constructor(props: any) {
        super(props)
        this.state = {
			authenticated: false,
			currentRecipe: {"id":0, "title":"Loading ","url":"","tags":"⚆ _ ⚆","uploaded":"","width":"0","height":"0"},
			open: false,
			predictionResult: null,
			recipes: [],
			
			
			refCamera: React.createRef(),
			uploadFileList: null,
			
			
			
		}     
		
		this.fetchRecipes("")
		this.selectNewRecipe = this.selectNewRecipe.bind(this)
		this.handleFileUpload = this.handleFileUpload.bind(this)
		this.fetchRecipes = this.fetchRecipes.bind(this)
		this.uploadrecipe = this.uploadrecipe.bind(this)
		this.authenticate = this.authenticate.bind(this)
	}

	public render() {
		const { open } = this.state;
		
		// const { authenticated } = this.state
		return (
			<div>

				{/* {(!authenticated) ?
					<Modal open={!authenticated} onClose={this.authenticate} closeOnOverlayClick={false} showCloseIcon={false} center={true}>
						<Webcam
							audio={false}
							screenshotFormat="image/jpeg"
							ref={this.state.refCamera}
						/>
						<div className="row nav-row">
							<div className="btn btn-primary bottom-button" onClick={this.authenticate}>Login</div>
						</div>
					</Modal> : ""} */}



				{/* {(authenticated) ?	 */}
				<div className="body">
					<div className="header-wrapper">
						<div className="header">
							&nbsp;Hungry Tonight &nbsp;
					{/*<div className="btn btn-primary btn-action btn-add" onClick={this.onOpenModal}>Add recipe</div>*/}
					
						</div>
					</div>
					<div className="container">
						<div className="row">
							{/* <div className="col-7">
								<recipeDetail currentrecipe={this.state.currentrecipe} />
							</div> */}
							<div >
								<RecipeList recipes={this.state.recipes} selectNewRecipe={this.selectNewRecipe} searchByTag={this.fetchRecipes} />
							</div>
						</div>
						<button aria-label="Add" className="add-button" onClick={this.onOpenModal}>
        				Add New Recipe
      					</button>	
					</div>
					<Modal open={open} onClose={this.onCloseModal}>
						<form>
							<div className="form-group">
								<label>recipe Title</label>
								<input type="text" className="form-control" id="recipe-title-input" placeholder="Enter Title" />
								<small className="form-text text-muted">You can edit any recipe later</small>
							</div>
							<div className="form-group">
								<label>Tag</label>
								<input type="text" className="form-control" id="recipe-tag-input" placeholder="Enter Tag" />
								<small className="form-text text-muted">Tag is used for search</small>
							</div>
							<div className="form-group">
								<label>Image</label>
								<input type="file" onChange={this.handleFileUpload} className="form-control-file" id="recipe-image-input" />
							</div>
							<button type="button" className="btn" onClick={this.uploadrecipe}>Upload</button>
						</form>
					</Modal>
					
				</div>
				
				{/* : ""} */}
							
		</div>
		);
	}

	
	// Call custom vision model
	private getFaceRecognitionResult(image: any) {
		const url = "https://southcentralus.api.cognitive.microsoft.com/customvision/v2.0/Prediction/7bce860c-db89-4fc8-abb3-3143c0354af0/image?iterationId=51421a18-ab66-46ca-8936-248b65f76a20"
		if (image === null) {
			return;
		}
		const base64 = require('base64-js');
		const base64content = image.split(";")[1].split(",")[1]
		const byteArray = base64.toByteArray(base64content);
		fetch(url, {
			body: byteArray,
			headers: {
				'Content-Type': 'application/octet-stream','Prediction-Key': 'e8b59d414b4641e6b57a82f4eaa4d2e1', 'cache-control': 'no-cache'
			},
			method: 'POST'
		})
			.then((response: any) => {
				if (!response.ok) {
					// Error State
					alert(response.statusText)
				} else {
					response.json().then((json: any) => {
						console.log(json.predictions[0])

						this.setState({predictionResult: json.predictions[0] })
						if (this.state.predictionResult.probability > 0.7) {
							this.setState({authenticated: true})
						} else {
							this.setState({authenticated: false})
						console.log(json.predictions[0].tagName)
						}
					})
				}
			})
	}

	// Authenticate
	private authenticate() {
		const screenshot = this.state.refCamera.current.getScreenshot();
		this.getFaceRecognitionResult(screenshot);
	}

	// Modal open
	private onOpenModal = () => {
		this.setState({ open: true });
	  };
	
	// Modal close
	private onCloseModal = () => {
		this.setState({ open: false });
	};
	
	// Change selected recipe
	private selectNewRecipe(newRecipe: any) {
		this.setState({
			currentRecipe: newRecipe
		})
	}

	// GET recipes
	private fetchRecipes(tag: any) {
		let url = "https://apimyrecipe.azurewebsites.net/api/recipes"
		if (tag !== "") {
			url += "/tag?=" + tag
		}
        fetch(url, {
            method: 'GET'
        })
        .then(res => res.json())
        .then(json => {
			let currentRecipe = json[0]
			if (currentRecipe === undefined) {
				currentRecipe = {"id":0, "title":"No recipes (╯°□°）╯︵ ┻━┻","url":"","tags":"try a different tag","uploaded":"","width":"0","height":"0"}
			}
			this.setState({
				currentRecipe,
				recipes: json
			})
        });
	}

	// Sets file list
	private handleFileUpload(fileList: any) {
		this.setState({
			uploadFileList: fileList.target.files
		})
	}

	// POST recipe
	private uploadrecipe() {
		const titleInput = document.getElementById("recipe-title-input") as HTMLInputElement
		const tagInput = document.getElementById("recipe-tag-input") as HTMLInputElement
		const imageFile = this.state.uploadFileList[0]

		if (titleInput === null || tagInput === null || imageFile === null) {
			return;
		}

		const title = titleInput.value
		const tag = tagInput.value
		const url = "https://apimyrecipe.azurewebsites.net/api/recipes/upload"

		const formData = new FormData()
		formData.append("Title", title)
		formData.append("Tags", tag)
		formData.append("image", imageFile)

		fetch(url, {
			body: formData,
			headers: {'cache-control': 'no-cache'},
			method: 'POST'
		})
        .then((response : any) => {
			if (!response.ok) {
				// Error State
				alert(response.statusText)
			} else {
				location.reload()
			}
		  })
	}
}

export default App;
