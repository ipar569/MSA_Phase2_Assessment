
import * as React from 'react';
import Modal from 'react-responsive-modal';
// import * as Webcam from "react-webcam";
import './App.css';
// import MemeDetail from './components/MemeDetail';
import RecipeList from './components/RecipeList';
import EditRecipe from './EditRecipe'


interface IState {
	currentRecipe: any,

	open: boolean,
	openRecipe: boolean,
	// openEdit: boolean,
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
			// openEdit:false,
			openRecipe: false,
			predictionResult: null,
			recipes: [],
			refCamera: React.createRef(),
			uploadFileList: null,
			
			
			
		}     
		
		this.fetchRecipes("")
		this.selectNewRecipe = this.selectNewRecipe.bind(this)
		this.handleFileUpload = this.handleFileUpload.bind(this)
		this.fetchRecipes = this.fetchRecipes.bind(this)
		this.uploadRecipe = this.uploadRecipe.bind(this)
		this.authenticate = this.authenticate.bind(this)
	}

	public render() {
		const { open, openRecipe } = this.state;
		const recipe = this.state.currentRecipe;
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
					{/* Modal for adding new recipe*/ }
					<Modal open={open} onClose={this.onCloseModal}>
						<form>
							<div>
								<h1 className="add-header">Add New Recipe</h1>
								<hr />
							</div>
							<div className="form-group">
								<label>Recipe Name</label>
								<input type="text" className="form-control" id="recipe-name-input" placeholder="Enter Name of the Dish" />
								<small className="form-text text-muted">You can edit any recipe later</small>
								<hr className="add-hr"/>
							</div>
							<div className="form-group">
								<label>Cusine/Tag</label>
								<input type="text" className="form-control" id="recipe-tag-input" placeholder="Enter " />
								<small className="form-text text-muted">Tag/Cuisine is used for search and identification</small>
								<hr className="add-hr"/>
							</div>
							<div className="form-group">
								<label>Overview</label>
								<input type="text" className="form-control" id="recipe-overview-input" placeholder="Enter " />
								<small className="form-text text-muted">Please describe the overview of the dish</small>
								<hr className="add-hr"/>
							</div>
							<div className="form-group">
								<label>Ingridients</label>
								<input type="text" className="form-control" id="recipe-ingridients-input" placeholder="Enter " />
								<small className="form-text text-muted">You can edit any recipe late</small>
								<hr className="add-hr"/>
							</div>
							<div className="form-group">
								<label>Description</label>
								<input type="text" className="form-control" id="recipe-description-input" placeholder="Enter " />
								<small className="form-text text-muted">You can edit any recipe late</small>
								<hr className="add-hr"/>
							</div>
							<div className="form-group">
								<label>Image</label>
								<input type="file" onChange={this.handleFileUpload} className="form-control-file" id="recipe-image-input" />
							</div>
							<button type="button" className="find-button bold" onClick={this.uploadRecipe}>Upload</button>
						</form>
					</Modal>
					{/* Modal to show individual recipe menu*/ }
					<Modal open={openRecipe} onClose={this.onCloseModal}>
						<form>
							<div>
								<h1 className="add-header">{recipe.name}</h1>
								<hr />
								<h6>Author: {recipe.author}</h6>
							</div>
							
							<img className='single-image' src={recipe.url}/>
	
							<div className="overview">"{recipe.overview}"</div>
							<div className="ingridients">
							<h5>Ingridients Needed</h5>
							{recipe.ingridients}
							</div>
							<div className="description">
							<h5>Method</h5>
							{recipe.description}</div>
							<EditRecipe currentRecipe={recipe}/>
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
		this.setState({ open: false,openRecipe:false});
	};

	// private onCloseEditModal = () => {
	// 	this.setState({ openEdit:false });
	// };
	
	// Change selected recipe
	private selectNewRecipe(newRecipe: any) {
		newRecipe.description = newRecipe.description.replace("\n","\n\n")
		this.setState({
			
			currentRecipe: newRecipe,
			openRecipe: true
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
	private uploadRecipe() {
		const nameInput = document.getElementById("recipe-name-input") as HTMLInputElement
		const tagInput = document.getElementById("recipe-tag-input") as HTMLInputElement
		const overviewInput = document.getElementById("recipe-overview-input") as HTMLInputElement
		const ingridientsInput = document.getElementById("recipe-ingridients-input") as HTMLInputElement
		const descriptionInput = document.getElementById("recipe-description-input") as HTMLInputElement
		const imageFile = this.state.uploadFileList[0]

		if (nameInput === null || tagInput === null ||overviewInput === null ||ingridientsInput === null ||descriptionInput === null || imageFile === null) {
			alert("Please fill in the empty input field!!")
			return;
		}

		const name = nameInput.value
		const tag = tagInput.value
		const overview = overviewInput.value
		const ingridients = ingridientsInput.value
		const description = descriptionInput.value
		const url = "https://apimyrecipe.azurewebsites.net/api/recipes/upload"

		const formData = new FormData()
		formData.append("Name", name)
		formData.append("Tags", tag)
		formData.append("Author", "admin")
		formData.append("Overview", overview)
		formData.append("Ingridients", ingridients)
		formData.append("Description", description)
		formData.append("Image", imageFile)

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
