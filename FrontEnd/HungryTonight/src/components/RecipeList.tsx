
import * as React from "react";


interface IProps {
    recipes: any[],
    selectNewRecipe: any,
    searchByTag: any
}

export default class RecipeList extends React.Component<IProps, {}> {
    constructor(props: any) {
        super(props)   
        this.searchByTag = this.searchByTag.bind(this)
    }

	public render() {
		return (
			<div className="container meme-list-wrapper">
                <div className="row meme-list-heading">
                    <div className="input-group">
                        <input type="text" id="search-tag-textbox" className="form-control" placeholder="Search By Tags" />
                        <div className="input-group-append">
                            <div className="btn btn-outline-secondary search-button" onClick = {this.searchByTag}>Search</div>
                        </div>
                    </div>  
                </div>
                <div className="app-card-list" id="app-card-list">
                {this.createCardsList()}
                </div>
            </div>
		);
    }

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
            backgroundSize: '100% calc(100vh - 220px)'
            
        };
        return (
            
      <article className="card">
        <header style={style} className="card-header">
            <div className="card-tags"><a className="card-header--title">{recipe.tags}</a></div>
        </header>
         <div className="card-body">
     
             <h2>{recipe.name}</h2>
     
                <p className="body-content">{recipe.overview}</p>
     
        </div>
     </article>
        )
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