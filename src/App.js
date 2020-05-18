import React, {useLayoutEffect, useRef, useState} from 'react';
import Posts from './Posts';
import Favorites from './Favorites';
import './styles.css';
  
function App() {
  const posts = useRef([]); // store posts in original "hot" order
  const [favorites, setFavorites] = useState({});
  const [undoStack, setUndoStack] = useState([]); // store both undo and redo actions
  const [redoStack, setRedoStack] = useState([]); // store both undo and redo actions
  const [query, setQuery] = useState(); // search query input 
  const [postsList, setPostsList] = useState([]); // list of sorted posts 

  const sortPosts = (event) => {
    // sorting posts will mutate it losing the original "hot" order
    // so posts needs to be cloned and then it can be sorted
    if (event.target.value === "asc") {
        const ascendingPosts = [...posts.current].sort((a, b) => a.data.ups - b.data.ups);
        setPostsList(ascendingPosts);
    } else if (event.target.value === "desc") {
        const descedingPosts = [...posts.current].sort((a, b) => b.data.ups - a.data.ups);
        setPostsList(descedingPosts);
    } else {
        setPostsList(posts.current);
    }
  };

  const add = (post) => {
    if (!favorites[post.data.id]) {
      // undo action for add is to keep original favorites
      const undo = () => setFavorites({...favorites});

      // redo action for add is to add post to favorites
      const redo = () => setFavorites({...favorites, [post.data.id]: post});

      // make sure that there is no future actions in the redo stack
      // for example if the user favorites a posting then clicks undo, and then
      // favorites a different posting we need to discard the future actions
      setRedoStack([]);

      // two actions are pushed to the undo stack, first the redo action is pushed to the undo stack first
      // and then the undo action is pushed to the undo stack so that when the undo button is pressed, the undo 
      // action at top of undo stack is executed which performs the undo action and then the undo stack pops the 
      // top undo action and pops the next redo action and both actions are pushed to the redo stack with 
      // redo action at top of redo stack
      setUndoStack([...undoStack, redo, undo]);
      
      // add post to favorites
      setFavorites({...favorites, [post.data.id]: post});
    }
  };

  const remove = (id) => {
    // undo action for remove is to add post to favorites
    const undo = () => setFavorites({...favorites});
    
    // redo action for remove is to delete post from favorites
    const favoritesWithPostDeleted = {...favorites};
    delete favoritesWithPostDeleted[id];
    const redo = () => setFavorites(favoritesWithPostDeleted);
    
    // make sure that there is no future actions in the redo stack
    // for example if the user favorites a posting then clicks undo, and then
    // favorites a different posting we need to discard the future actions
    setRedoStack([]);

    // two actions are pushed to the undo stack, first the redo action is pushed to the undo stack first
    // and then the undo action is pushed to the undo stack so that when the undo button is pressed, the undo 
    // action at top of undo stack is executed which performs the undo action and then the undo stack pops the 
    // top undo action and pops the next redo action and both actions are pushed to the redo stack with 
    // redo action at top of redo stack
    setUndoStack([...undoStack, redo, undo]);

    // remvove post from favorites
    setFavorites(favoritesWithPostDeleted);
  };

  const undo = () => {
    if (undoStack.length > 0) {
      // pop two actions the first popped action is the undo action
      const undo = undoStack.pop();
      const redo = undoStack.pop();

      // transfer the two popped actions to the redo stack
      setRedoStack([...redoStack, undo, redo]);

      // execute undo action
      undo();
    }
  };

  const redo = () => {
    if (redoStack.length > 0) {
      // pop two actions the first popped action is the redo action
      const redo = redoStack.pop();
      const undo = redoStack.pop();
      
      // transfer the two popped actions to the undo stack
      setUndoStack([...undoStack, redo, undo]);

      // execute redo action
      redo();
    }
  };

  useLayoutEffect(() => {
    const getPosts = async (query) => {
      let response;
      if (query) {
        // fetch subreddit for search input query, 
        response =  await fetch(`https://www.reddit.com/r/${query}/.json`);
      } else {
        // an empty query fetches home page
        response =  await fetch("https://www.reddit.com/.json");
      }
      const {data} = await response.json();
      if (data && data.children) {
        // update posts and set sort value back to hot
        posts.current = data.children;
        setPostsList(data.children);
        document.getElementById("sort").value = "hot";
      } else {
        // update posts
        posts.current = data;
        setPostsList(data);
      }
    }
    getPosts(query);
  }, [query]);

  return (
    <>
      <header>
        <div>
          <div><img src="/reddit_logo.png" alt="reddit"/></div>
          <div><input type="text" value={query} placeholder="Search" onChange={(event) => setQuery(event.target.value)}/></div>
          <div>
            <span>Sort</span>
            &nbsp;
            <select id="sort" defaultValue="hot" onChange={sortPosts}>
              <option value="hot">Hot</option>
              <option value="desc">Descending</option>
              <option value="asc">Ascending</option>
            </select>
          </div>
        </div>
      </header>
      <main>
        <Favorites favorites={Object.values(favorites)} removeFromFavorites={remove} undo={undo} redo={redo}/>
        <Posts posts={postsList} addToFavorites={add}/>
      </main>
    </>
  );
}

export default App;