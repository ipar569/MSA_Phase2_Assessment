import * as React from "react";
import Modal from 'react-responsive-modal';
import {FacebookShareButton} from 'react-share';
import FacebookIcon from "./FB-Share-icon.png";

interface IProps {
    currentRecipe: any
    user:any
}

interface IState {
    open: boolean
    openConfirm: boolean
    openConfirmDel: boolean
}

export default class EditRecipe extends React.Component<IProps, IState> {

    constructor(props: any) {
        super(props)   
        this.state = {
            open: false,
            openConfirm: false,
            openConfirmDel:false
        }
        
        this.editRecipe = this.editRecipe.bind(this)
    }

	public render() {
        const currentRecipe = this.props.currentRecipe
        const { open } = this.state;
		return (
			<div className="container">

                
                <div className="right-container">
                <FacebookShareButton quote="recipe" url="www.injaepark.co.nz">
                    <img src={FacebookIcon} className="facebook"/>
                </FacebookShareButton>
                    <button type="button" className="find-button bold" onClick={this.onOpenModal}>Edit</button>
					<button type="button" className="find-button bold" onClick={this.onOpenDelModal}>Delete</button>
                </div>
                <Modal open={open} onClose={this.onCloseModal}>
                    <  div>
						<h1 className="add-header"> Edit "{currentRecipe.name}"</h1>
								<hr />
							</div>
							
							<div className="form-group">
								<label>Cusine/Tag</label>
								<input type="text" className="form-control" id="recipe-tag-edit" defaultValue={currentRecipe.tags}/>
								<small className="form-text text-muted">Tag/Cuisine is used for search and identification</small>
								<hr className="add-hr"/>
							</div>
							<div className="form-group">
								<label>Overview</label>
								<input type="text" className="form-control" id="recipe-overview-edit" defaultValue={currentRecipe.overview} />
								<hr className="add-hr"/>
							</div>
							<div className="form-group">
								<label>Ingridients</label>
								<input type="text" className="form-control" id="recipe-ingridients-edit" defaultValue={currentRecipe.ingridients} />

								<hr className="add-hr"/>
							</div>
							<div className="form-group">
								<label>Description</label>
								<input type="text" className="form-control" id="recipe-description-edit" defaultValue={currentRecipe.description} />
								

							</div><div className="right-container"><button type="button" className="find-button bold toLeft" onClick={this.onOpenConModal}>Edit</button></div>
							
                </Modal>
                <Modal open={this.state.openConfirm} onClose={this.onCloseConModal}>
                    <h3 className="up">Are you sure about this?</h3>
                    <div className="confirm">
                    <button type="button" className="find-button bold" onClick={this.editRecipe}>Edit</button>
                    <button type="button" className="find-button bold" onClick={this.onCloseConModal}>Cancel</button>
					</div>
                </Modal>
                <Modal open={this.state.openConfirmDel} onClose={this.onCloseDelModal}>
                    <h3 className="up">Are you sure about this?</h3>
                    <div className="confirm">
                    <button type="button" className="find-button bold" onClick={this.deleteRecipe.bind(this,currentRecipe.id)}>Delete</button>
                    <button type="button" className="find-button bold" onClick={this.onCloseDelModal}>Cancel</button>
					</div>
                </Modal>
            </div>
        );
        
    }
    private onOpenModal = () => {
        if(this.props.user===this.props.currentRecipe.author){
        this.setState({ open: true });
        }else{
            alert("You are not the owner of the recipe so you cannot edit the recipe!!")
        }
      };
      
    
    
    // Modal Close
    private onCloseModal = () => {
		this.setState({ open: false });
    };

    private onOpenConModal = () => {
        this.setState({ openConfirm: true });
      };
      
    
    
    // Modal Close
    private onCloseConModal = () => {
		this.setState({ openConfirm: false });
    };

    private onOpenDelModal = () => {
        if(this.props.user===this.props.currentRecipe.author){
            this.setState({ openConfirmDel: true });
            }else{
                alert("You are not the owner of the recipe so you cannot edit the recipe!!")
            }
      };
      
    
    
    // Modal Close
    private onCloseDelModal = () => {
		this.setState({ openConfirmDel: false });
    };


    private deleteRecipe(id:any){
        const url = "https://apimyrecipe.azurewebsites.net/api/recipes/" + id
    
        fetch(url, {
            method: 'DELETE'
        })
        .then((response : any) => {
            if (!response.ok) {
                // Error Response
                alert(response.statusText)
            }
            else {
                alert("delete recipe")
                location.reload()
            }
        })
        
        
	}

	private editRecipe(){
        const tagInput = document.getElementById("recipe-tag-edit") as HTMLInputElement
        const overviewInput = document.getElementById("recipe-overview-edit") as HTMLInputElement
        const ingridientsInput = document.getElementById("recipe-ingridients-edit") as HTMLInputElement
        const descriptionInput = document.getElementById("recipe-description-edit") as HTMLInputElement

        if (overviewInput === null || tagInput === null||ingridientsInput === null || descriptionInput === null) {
            return;
        }
    
        const currentRecipe = this.props.currentRecipe
        const url = "https://apimyrecipe.azurewebsites.net/api/recipes/" + currentRecipe.id

        fetch(url, {
            body: JSON.stringify({
                "author":currentRecipe.author,
                "description": descriptionInput.value,
                "height": currentRecipe.height,
                "id": currentRecipe.id,
                "ingridients": ingridientsInput.value,
                "name": currentRecipe.name,
                "overview": overviewInput.value,
                "tags": tagInput.value,
                "uploaded": currentRecipe.uploaded,
                "url": currentRecipe.url,
                "width": currentRecipe.width

                
            }),
            headers: {'cache-control': 'no-cache','Content-Type': 'application/json'},
            method: 'PUT'
        })
        .then((response : any) => {
            if (!response.ok) {
                // Error State
                alert(response.statusText + " " + url)
            } else {
                alert("Update Successful!!")
                location.reload()
            }
        })
	
		
	}
	
}