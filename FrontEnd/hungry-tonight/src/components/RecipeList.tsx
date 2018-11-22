
import * as React from "react";

// import Modal from 'react-responsive-modal';


interface IProps {
    recipes: any[],
    selectNewRecipe: any,
    searchByTag: any
}

export default class RecipeList extends React.Component<IProps, {}> {
    constructor(props: any) {
        super(props)   
        this.state = {
            open: false,
          };
        this.searchByTag = this.searchByTag.bind(this)
        this.selectNewRecipe = this.selectNewRecipe.bind(this)
    }

	public render() {
		return (
			<div>

                    <div className="input-group search">
                        <input type="text" id="search-tag-textbox" className="form-control" placeholder="Search By Cuisine Type" onKeyPress={this.handleKeyPress} />
                        <div className="input-group-append">
                            <div className="btn btn-outline-secondary search-button" onClick = {this.searchByTag}>Search</div>
                        </div>
                    </div>  

                <div className="app-card-list" id="app-card-list">
                <div className="center">{this.createCardsList()}</div>
                
                </div>
            </div>
		);
    }

    private handleKeyPress = (event:any) => {
        if (event.key === 'Enter') {
          this.searchByTag();
        }
      };

    // Construct cards and display it on the page for each recipes
	private createCardsList() {
        const cards:any = []
        const recipeList = this.props.recipes
        if (recipeList == null) {
            return cards
        }

        for (const recipe of recipeList) {
            cards.push(this.createCard(recipe))
        }
        return cards
    }

    private createCard(recipe:any){
        const style = { 
            backgroundImage: 'url(' + recipe.url + ')',
            backgroundSize: '100%'
            
        };

        return (
            
      <article className="card">
        <header style={style} className="card-header">
            <div className="card-tags"><a className="card-header--title">{recipe.tags}</a></div>
        </header>
         <div className="card-body">
     
                <h3>{recipe.name}</h3>
     
                <p className="body-content">{recipe.overview}</p>
                <button className="find-button" onClick={this.selectNewRecipe.bind(this,recipe)}>
                    Find out more
                </button>
        </div>
     </article>
        )
    }

    private selectNewRecipe(recipe: any){
        this.props.selectNewRecipe(recipe)
    }



    // Search recipe by tag
    private searchByTag() {
        const textBox = document.getElementById("search-tag-textbox") as HTMLInputElement
        if (textBox === null) {
            return;
        }
        const tag = textBox.value 
        this.props.searchByTag(tag)  
    }

}