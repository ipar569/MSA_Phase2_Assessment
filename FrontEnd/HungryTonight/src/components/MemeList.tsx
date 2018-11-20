
import * as React from "react";


interface IProps {
    memes: any[],
    selectNewMeme: any,
    searchByTag: any
}

export default class MemeList extends React.Component<IProps, {}> {
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
                {this.createTable()}
                </div>
            </div>
		);
    }

    // Construct table using meme list
	private createTable() {
        const cards:any = []
        const memeList = this.props.memes
        if (memeList == null) {
            return cards
        }

        for (const meme of memeList) {
            cards.push(this.createCard(meme))
        }
        return cards
    }

    private createCard(meme:any){
        const style = { 
            backgroundImage: 'url(' + meme.url + ')',
            backgroundSize: '100% calc(100vh - 220px)'
            
        };
        return (
            
      <article className="card">
        <header style={style} className="card-header">
            <div className="card-tags"><a className="card-header--title">{meme.tags}</a></div>
        </header>
         <div className="card-body">
     
             <h2>{meme.id}</h2>
     
                <p className="body-content">{meme.name}</p>
     
        </div>
     </article>
        )
    }

    // Search meme by tag
    private searchByTag() {
        const textBox = document.getElementById("search-tag-textbox") as HTMLInputElement
        if (textBox === null) {
            return;
        }
        const tag = textBox.value 
        this.props.searchByTag(tag)  
    }

}